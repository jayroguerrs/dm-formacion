import { directus } from '@/utils/directus';
import { customEndpoint, readUsers, updateUser } from '@directus/sdk';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const forgotPasswordAction = defineAction({
  accept: 'form',
  input: z.object({
    document: z.string({
      invalid_type_error: 'Debes ingresar el documento de identidad',
    }),
  }),
  handler: async data => {
    try {
      const users = await directus.request(
        readUsers({
          filter: {
            //@ts-ignore
            document: {
              _eq: data.document,
            },
          },
        })
      );

      if (users.length === 0) throw new Error('Ocurrió un error');

      const user = users[0];
      //@ts-ignore
      if (user.type === 'EXTERNO') {
        const sendMail = await directus.request(
          customEndpoint({
            path: '/dm/forgot-password',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ document: data.document }),
          })
        );
        console.log(sendMail);
        return { success: true };
      }

      return { success: true };
    } catch (e: any) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message:
          e.message ||
          'Ocurrió un error, por favor intente nuevamente en un momento',
      });
    }
  },
});
