import { processPayment } from '@/utils/izipay';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[REQUEST]', request.method, request.url);
    request.headers.forEach((value, key) => {
      console.log(`[HEADERS] ${key}: ${value}`);
    });

    const transactionId = request.headers.get('transactionId');

    if (!transactionId) {
      throw new Error('No se ha recibido el transactionId');
    }

    const body = await request.json();
    console.log('[BODY]', JSON.stringify(body));
    const payment = await processPayment(body, 'IPN');
    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        error: e.message || 'Ocurrió un error',
      }),
      { status: 400 }
    );
  }
};
