import { directus } from '@/utils/directus';
import { izipay } from '@/utils/izipay';
import { createItem, readItem, updateItem } from '@directus/sdk';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { format } from 'date-fns';

export const getIzipayPaymentDataAction = defineAction({
  input: z.object({
    userId: z.string(),
    courseId: z.string(),
    type: z.string(),
  }),
  handler: async data => {
    try {
      let amount: number = 0;
      let discount: number = 0;
      const course = await directus.request(
        readItem('internalCourse', data.courseId)
      );

      if (data.type === 'CONTRATADO' && course.contracted) {
        amount = course.contractedPrice;
      } else if (data.type === 'ASOCIADO' && course.partner) {
        amount = course.partnerPrice;
      } else if (course.generalAdmission) {
        amount = course.price;
      }

      if (
        ['ASOCIADO', 'CONTRATADO'].includes(data.type) &&
        course.generalAdmission
      ) {
        discount = course.price - amount;
      }

      const order = await directus.request(
        createItem('order', {
          user: data.userId,
          currency: 'PEN',
          amount,
          discount,
          courses: [],
          transactions: [],
          status: 'Pedido Pendiente de Pago',
        })
      );

      const orderItem = await directus.request(
        createItem('order_internalCourse', {
          internalCourse_id: data.courseId,
          order_id: order.id,
          amount,
          discount,
          quantity: 1,
          addedDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        })
      );

      const updatedOrder = await directus.request(
        updateItem('order', order.id, {
          courses: [orderItem.id],
        })
      );

      const orderNumber = String(order.id).padStart(15, '0');
      const transactionId = String(new Date().getTime());
      const access = await izipay.getToken(
        transactionId,
        orderNumber,
        amount.toFixed(2)
      );

      return {
        ...access,
        transactionId,
        orderNumber,
        currency: 'PEN',
        amount: amount.toFixed(2),
      };
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
