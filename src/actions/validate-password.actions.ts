import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

export const validatePasswordAction = defineAction({
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
  }),
  handler: async data => {
    if (data.password !== data.repeatPassword) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: 'Las contraseñas no coinciden',
      });
    }
    return { password: data.password };
  },
});
