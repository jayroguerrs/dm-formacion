import { directus } from '@/utils/directus';
import { createItem } from '@directus/sdk';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const moreInfoAction = defineAction({
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
    phone: z.string({
      invalid_type_error: 'Debes ingresar tu teléfono',
    }),
    documentType: z.string({
      invalid_type_error: 'Debes seleccionar tus tipo de documento',
    }),
    document: z.string({
      invalid_type_error: 'Debes ingresar tu número de documento',
    }),
    authorization: z.literal('on', {
      errorMap: () => ({
        message: 'Debes aceptar la autorización',
      }),
    }),
    authorizationGetInfo: z.string().optional(),
    course: z.string(),
  }),
  handler: async formData => {
    await directus.request(
      createItem('contactInfo', {
        ...formData,
        authorizationGetInfo: formData.authorizationGetInfo === 'on',
      })
    );
    return { success: true };
  },
});
