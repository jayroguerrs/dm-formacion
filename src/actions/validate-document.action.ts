import { directus } from '@/utils/directus';
import { dmSearch } from '@/utils/dm-api';
import { readUsers } from '@directus/sdk';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const validateDocumentAction = defineAction({
  accept: 'form',
  input: z.object({
    document: z.string({
      invalid_type_error: 'Debes ingresar el documento de identidad',
    }),
    recaptcha: z.string(),
  }),
  handler: async formData => {
    const users = await directus.request(
      readUsers({
        filter: {
          //@ts-ignore
          document: { _eq: formData.document },
        },
      })
    );
    if (users.length > 0) {
      return {
        //@ts-ignore
        type: users[0].type,
        exists: true,
        document: formData.document,
      };
    }

    const dmUser = await dmSearch(formData.document, formData.recaptcha || '');
    if (dmUser.codigoError) {
      /*
        codigoError = "001", mensaje = "Error en la validación"
        codigoError = "002", mensaje = "Token recaptcha inválido."
        codigoError = "003", mensaje = "El dni ingresado no está registrado en Derrama Magisterial." 
        codigoError = "004", mensaje = "Usuario y/o contraseña incorrecta." 
        codigoError = "005", mensaje = "El usuario está bloqueado por intentos fallidos."
        codigoError = "006", mensaje = "Debe actualizar su clave digital."
        codigoError = "007", mensaje = "Ocurrió un error en el servidor."
      */
      const errorCodes = ['001', '002', '004', '005', '007'];
      if (errorCodes.includes(dmUser.codigoError)) {
        throw new ActionError({
          code: 'NOT_FOUND',
          message: 'Ocurrió un error. inténtalo nuevamente en unos minutos',
        });
      } else if (dmUser.codigoError === '003') {
        return {
          //@ts-ignore
          type: 'EXTERNO',
          exists: false,
          document: formData.document,
        };
      } else if (dmUser.codigoError === '006') {
        return {
          //@ts-ignore
          type: 'EXTERNO',
          exists: false,
          document: formData.document,
          shouldUpdatePassword: true,
        };
      }
    }

    if (dmUser.asociado) {
      if (dmUser.asociado.ASOTIPDES === 'CESANTE') {
        throw new ActionError({
          code: 'NOT_FOUND',
          message: 'Ocurrió un error. inténtalo nuevamente en unos minutos',
        });
      } else {
        return {
          exists: false,
          document: formData.document,
          type:
            dmUser.asociado.ASOTIPDES === 'CONTRATADO'
              ? 'CONTRATADO'
              : 'ASOCIADO',
          firstName: dmUser.asociado.ASONOMDNI,
          lastName: `${dmUser.asociado.ASOAPEPATDNI} ${dmUser.asociado.ASOAPEMATDNI}`,
          phone: dmUser.asociado.CELULAR,
          email: dmUser.asociado.CORREO || undefined,
        };
      }
    }
  },
});
