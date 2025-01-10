import { directus } from '@/utils/directus';
import { dmLogin } from '@/utils/dm-api';
import { readUsers, login, readRoles, createUser } from '@directus/sdk';
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

export const loginAction = defineAction({
  accept: 'form',
  input: z.object({
    document: z.string(),
    password: z.string({
      invalid_type_error: 'Debes ingresar la contraseña',
    }),
    type: z.string(),
    recaptcha: z.string(),
    exists: z.boolean(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }),
  handler: async formData => {
    try {
      if (formData.type !== 'EXTERNO') {
        const dmUser = await dmLogin(
          formData.document,
          formData.password,
          formData.recaptcha || ''
        );

        if (dmUser.codigoError) {
          throw new ActionError({
            code: 'NOT_FOUND',
            message: dmUser.mensaje,
          });
        }

        if (!formData.exists) {
          const [{ id }] = await directus.request(
            readRoles({
              fields: ['id'],
              filter: {
                name: { _eq: 'Student' },
              },
            })
          );

          const user = await directus.request(
            createUser({
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email?.toLowerCase() || undefined,
              //@ts-ignore
              phone: formData.phone || undefined,
              document: formData.document,
              role: id || undefined,
              type: formData.type,
              password: formData.password,
            })
          );
          return {
            user: {
              userId: user.id,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              document: formData.document,
              courses: [],
              type: formData.type,
              billingAddressDocumentType: '',
              billingAddressDocument: '',
              street: '',
              state: '',
              city: '',
              postalCode: '',
              companyName: '',
            },
          };
        }
      } else {
        const users = await directus.request(
          readUsers({
            fields: ['*', { courses: ['*'] }],
            filter: {
              document: { _eq: formData.document },
            },
          })
        );

        if (users.length > 0) {
          const user = users[0];

          if (!!user.email) {
            const auth = await directus.request(
              login(user.email, formData.password)
            );

            if (auth.access_token) {
              return {
                user: {
                  userId: user.id,
                  firstName: user.first_name as string,
                  lastName: user.last_name as string,
                  document: user.document as string,
                  phone: user.phone as string,
                  email: user.email as string,
                  courses: user.courses,
                  type: user.type,
                  billingAddressDocumentType: user.billingAddressDocumentType,
                  billingAddressDocument: user.billingAddressDocument,
                  street: user.street,
                  state: user.state,
                  city: user.city,
                  postalCode: user.postalCode,
                  companyName: user.companyName,
                },
              };
            }
          }
        }
      }

      throw new ActionError({
        code: 'NOT_FOUND',
        message: 'Documento o contraseña incorrecta',
      });
    } catch (e) {
      console.log(e);
      throw new ActionError({
        code: 'NOT_FOUND',
        message: 'Documento o contraseña incorrecta',
      });
    }
  },
});
