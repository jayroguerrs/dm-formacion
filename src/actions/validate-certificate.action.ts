import { directus } from '@/utils/directus';
import { createItem, readItems } from '@directus/sdk';
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

export const validateCertificateAction = defineAction({
  accept: 'form',
  input: z.object({
    code: z.string({
      invalid_type_error: 'Debes ingresar el código único',
    }),
  }),
  handler: async formData => {
    try {
      const exists = await directus.request(
        readItems('certificate', {
          filter: { code: { _eq: formData.code.trim().toUpperCase() } },
        })
      );
      if (exists.length === 0) {
        throw new ActionError({
          code: 'NOT_FOUND',
          message: 'Certificado no válido',
        });
      }

      return exists[0];
    } catch (e: any) {
      throw new ActionError({
        code: e.code || 'BAD_REQUEST',
        message:
          e.message || 'Ocurrió un error. inténtalo nuevamente en unos minutos',
      });
    }
  },
});
