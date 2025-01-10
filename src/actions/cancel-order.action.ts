import { directus } from '@/utils/directus';
import { updateItem } from '@directus/sdk';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const cancelOrderAction = defineAction({
  input: z.object({
    orderNumber: z.string(),
  }),
  handler: async data => {
    try {
      const orderId = +data.orderNumber;
      const order = await directus.request(
        updateItem('order', orderId, {
          status: 'Pedido Cancelado',
        })
      );
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
