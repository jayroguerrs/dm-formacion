import { format, parse } from 'date-fns';
import { directus, type Users_InternalCourse } from './directus';
import {
  createItem,
  readItem,
  readItems,
  readUser,
  updateItem,
  updateUser,
} from '@directus/sdk';

const MERCHANT_CODE = import.meta.env.IZIPAY_MERCHANT_CODE;
const PUBLIC_KEY = import.meta.env.IZIPAY_PUBLIC_KEY;
const FACILITATOR_CODE = import.meta.env.IZIPAY_FACILITATOR_CODE;
const URL_IPN = import.meta.env.IZIPAY_URL_IPN;

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'https://sandbox-api-pw.izipay.pe'
    : 'https://api-pw.izipay.pe';

const getToken = async (
  transactionId: string,
  orderNumber: string,
  amount: string
) => {
  try {
    const request = await fetch(`${BASE_URL}/security/v1/Token/Generate`, {
      method: 'POST',
      headers: {
        transactionId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestSource: 'ECOMMERCE',
        merchantCode: MERCHANT_CODE,
        orderNumber,
        publicKey: PUBLIC_KEY,
        amount,
      }),
    });

    const data = await request.json();

    if (!request.ok) {
      console.error(data.message);
      throw new Error(data.message);
    }

    return {
      ...data.response,
      merchantCode: MERCHANT_CODE,
      publicKey: PUBLIC_KEY,
      facilitatorCode: FACILITATOR_CODE || undefined,
      urlIPN: URL_IPN || '',
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const izipay = {
  getToken,
};

export interface IzipayResponse {
  code: string;
  message: string;
  messageUser: string;
  payloadHttp?: string;
  signature?: string;
  transactionId: string;
  response: {
    payMethod: string;
    authentication?: {
      result?: string;
    };
    billing: {
      firstName: string;
      lastName: string;
      documentType: string;
      document: string;
      email: string;
      phoneNumber: string;
      street: string;
      state: string;
      city: string;
      postalCode: string;
      country: string;
      companyName?: string;
    };
    card?: {
      brand?: string;
      pan?: string;
      save?: string;
    };
    customFields?: string[];
    merchant?: {
      merchantCode?: string;
      facilitatorCode?: string;
    };
    miles?: {
      miles?: string;
      netMiles?: string;
    };
    order: {
      amount: string;
      codeAuth?: string;
      currency: string;
      dateTransaction?: string;
      installments?: string;
      deferred?: string;
      orderNumber: string;
      payMethodAuthorization?: string;
      referenceNumber?: string;
      stateMessage?: string;
      timeTransaction?: string;
      uniqueId?: string;
    }[];
    token?: {
      alias?: string;
      cardToken?: string;
      merchantBuyerId?: string;
    };
  };
}

export const processPayment = async (
  data: IzipayResponse,
  source: 'WEB' | 'IPN'
) => {
  try {
    if (!data.transactionId) {
      throw new Error('No se ha recibido el transactionId');
    }
    //validate if trasaction already exists
    const [transactionExists] = await directus.request(
      readItems('transaction', {
        filter: {
          transactionId: {
            _eq: data.transactionId,
          },
        },
      })
    );

    if (!!transactionExists) {
      await directus.request(
        updateItem('transaction', transactionExists.id, {
          ...(source === 'WEB' ? { savedFromUI: true } : {}),
          ...(source === 'IPN' ? { savedFromIPN: true } : {}),
        })
      );
      return { success: true };
    }

    const orderId = +data.response.order[0].orderNumber;
    const transactionDate =
      data.response.order[0].dateTransaction &&
      data.response.order[0].timeTransaction
        ? format(
            parse(
              `${data.response.order[0].dateTransaction}${data.response.order[0].timeTransaction}`,
              'yyyyMMddHHmmss',
              new Date()
            ),
            "yyyy-MM-dd'T'HH:mm:ss"
          )
        : undefined;

    const order = await directus.request(
      readItem('order', orderId, {
        fields: ['user', { courses: ['internalCourse_id'] }],
      })
    );
    const transaction = await directus.request(
      createItem('transaction', {
        transactionId: data.transactionId,
        responseCode: data.code,
        responseMessage: data.messageUser,
        payMethod: data.response.payMethod,
        signature: data.signature,
        cardBrand: data.response.card?.brand,
        cardNumber: data.response.card?.pan,
        merchantCode: data.response.merchant?.merchantCode,
        facilitatorCode: data.response.merchant?.facilitatorCode,
        currency: data.response.order[0].currency,
        amount: data.response.order[0].amount,
        transactionDate,
        codeAuth: data.response.order[0].codeAuth,
        uniqueId: data.response.order[0].uniqueId,
        referenceNumber: data.response.order[0].referenceNumber,
        orderId,
        billingFirstName: data.response.billing.firstName,
        billingLastName: data.response.billing.lastName,
        billingDocumentType: data.response.billing.documentType,
        billingDocument: data.response.billing.document,
        billingEmail: data.response.billing.email,
        billingPhoneNumber: data.response.billing.phoneNumber,
        billingStreet: data.response.billing.street,
        billingState: data.response.billing.state,
        billingCity: data.response.billing.city,
        billingPostalCode: data.response.billing.postalCode,
        billingCountry: data.response.billing.country,
        billingCompanyName: data.response.billing.companyName,
        payloadHttp: data.payloadHttp,
        savedFromUI: source === 'WEB',
        savedFromIPN: source === 'IPN',
      })
    );

    const updatedOrder = await directus.request(
      updateItem('order', orderId, {
        status: data.code === '00' ? 'Pedido Pagado' : 'Pedido Rechazado',
      })
    );

    if (data.code === '00') {
      const user = await directus.request(readUser(order.user));
      const enroll = await directus.request(
        createItem('junction_directus_users_internalCourse', {
          directus_user_id: order.user,
          internalCourse_id: (order.courses?.[0] as Users_InternalCourse)
            .internalCourse_id,
          order_id: orderId,
        })
      );

      const updatedUser = await directus.request(
        updateUser(user.id, {
          courses: [...(user.courses as number[]), enroll.id],
        })
      );

      return { success: true };
    } else {
      throw new Error(
        'Transaccion fallida, póngase en contacto con su banco para obtener más información'
      );
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
};
