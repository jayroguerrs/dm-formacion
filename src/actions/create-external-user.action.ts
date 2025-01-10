import { directus } from '@/utils/directus';
import { readRoles, createUser } from '@directus/sdk';
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

export const createExternalUserAction = defineAction({
  accept: 'form',
  input: z.object({
    firstName: z.string({
      invalid_type_error: 'Debes ingresar tus nombres',
    }),
    lastName: z.string({
      invalid_type_error: 'Debes ingresar tus apellidos',
    }),
    email: z
      .string({
        invalid_type_error: 'Debes ingresar tu correo electrónico',
      })
      .email('Correo electrónico inválido'),
    phone: z
      .string({
        invalid_type_error: 'Debes ingresar tu teléfono',
      })
      .regex(/[0-9]/, 'Formato incorrecto'),
    document: z.string(),
    password: z.string(),
  }),
  handler: async formData => {
    try {
      const [{ id }] = await directus.request(
        readRoles({
          fields: ['id'],
          filter: {
            name: { _eq: 'Student' },
          },
        })
      );

      const user = await directus.request(
        createUser({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          //@ts-ignore
          phone: formData.phone,
          document: formData.document,
          password: formData.password,
          role: id || undefined,
          type: 'EXTERNO',
        })
      );
      return {
        user: {
          ...formData,
          userId: user.id,
          type: 'EXTERNO',
          billingAddressDocumentType: user.billingAddressDocumentType,
          billingAddressDocument: user.billingAddressDocument,
          street: user.street,
          state: user.state,
          city: user.city,
          postalCode: user.postalCode,
          companyName: user.companyName,
        },
      };
    } catch (e: any) {
      if (e.errors.length > 0) {
        const repeated = (e.errors as any[]).some(
          error => error.extensions.code === 'RECORD_NOT_UNIQUE'
        );
        if (repeated) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'El correo electrónico ya está en uso',
          });
        }
      }

      throw new ActionError({
        code: 'BAD_REQUEST',
        message: 'Error al crear el usuario',
      });
    }
  },
});
