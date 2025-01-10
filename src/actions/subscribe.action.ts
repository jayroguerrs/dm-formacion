import { directus } from '@/utils/directus';
import { createItem, readItems } from '@directus/sdk';
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

export const subscribeAction = defineAction({
  accept: 'form',
  input: z.object({
    email: z
      .string({
        invalid_type_error: 'Debes ingresar tu correo electrónico',
      })
      .email('Correo electrónico inválido'),
  }),
  handler: async formData => {
    try {
      const exists = await directus.request(
        readItems('subscriber', { filter: { email: { _eq: formData.email } } })
      );
      if (exists.length > 0) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Ya te has suscrito anteriormente',
        });
      }
      const subscriber = await directus.request(
        createItem('subscriber', { email: formData.email })
      );
      return subscriber;
    } catch (e: any) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message:
          e.message || 'Ocurrió un error. inténtalo nuevamente en unos minutos',
      });
    }
  },
});
