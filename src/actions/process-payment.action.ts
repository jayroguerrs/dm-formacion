import { processPayment } from '@/utils/izipay';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const processPaymentAction = defineAction({
  input: z.object({
    code: z.string(),
    message: z.string(),
    messageUser: z.string(),
    payloadHttp: z.string().optional(),
    signature: z.string().optional(),
    transactionId: z.string(),
    response: z.object({
      payMethod: z.string(),
      authentication: z
        .object({
          result: z.string().optional(),
        })
        .optional(),
      billing: z.object({
        firstName: z.string(),
        lastName: z.string(),
        documentType: z.string(),
        document: z.string(),
        email: z.string(),
        phoneNumber: z.string(),
        street: z.string(),
        state: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string(),
        companyName: z.string().optional(),
      }),
      card: z
        .object({
          brand: z.string().optional(),
          pan: z.string().optional(),
          save: z.string().optional(),
        })
        .optional(),
      customFields: z.array(z.string()).optional(),
      merchant: z
        .object({
          merchantCode: z.string().optional(),
          facilitatorCode: z.string().optional(),
        })
        .optional(),
      miles: z
        .object({
          miles: z.string().optional(),
          netMiles: z.string().optional(),
        })
        .optional(),
      order: z.array(
        z.object({
          amount: z.string(),
          codeAuth: z.string().optional(),
          currency: z.string(),
          dateTransaction: z.string().optional(),
          installments: z.string().optional(),
          deferred: z.string().optional(),
          orderNumber: z.string(),
          payMethodAuthorization: z.string().optional(),
          referenceNumber: z.string().optional(),
          stateMessage: z.string().optional(),
          timeTransaction: z.string().optional(),
          uniqueId: z.string().optional(),
        })
      ),
      token: z
        .object({
          alias: z.string().optional(),
          cardToken: z.string().optional(),
          merchantBuyerId: z.string().optional(),
        })
        .optional(),
    }),
  }),
  handler: async data => {
    try {
      return await processPayment(data, 'WEB');
    } catch (e: any) {
      console.log(JSON.stringify(e));
      throw new ActionError({
        code: 'BAD_REQUEST',
        message:
          e.message ||
          'Ocurrió un error, por favor intente nuevamente en un momento',
      });
    }
  },
});
