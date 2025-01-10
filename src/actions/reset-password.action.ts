import { directus } from '@/utils/directus';
import { updateUser } from '@directus/sdk';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const resetPasswordAction = defineAction({
  accept: 'form',
  input: z.object({
    password: z
      .string({
        invalid_type_error: 'Debes ingresar la contraseña',
      })
      .min(6, 'Debe tener al menos 6 caracteres'),
    repeatPassword: z.string({
      invalid_type_error: 'Debe repetir la contraseña',
    }),
    userId: z.string(),
    token: z.string(),
  }),
  handler: async data => {
    try {
      if (data.password !== data.repeatPassword) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Las contraseñas no coinciden',
        });
      }

      const user = await directus.request(
        updateUser(data.userId, {
          password: data.password,
          //@ts-ignore
          tempToken: '',
        })
      );

      return { success: true };
    } catch (e) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message:
          'Error al cambiar la contraseña, vuelve a intentarlo en unos minutos',
      });
    }
  },
});
