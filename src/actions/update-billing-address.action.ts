import { directus } from '@/utils/directus';
import { updateUser } from '@directus/sdk';
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { error } from 'node_modules/astro/dist/core/logger/core';

export const updateBillingAddressAction = defineAction({
  accept: 'form',
  input: z
    .object({
      userId: z.string(),
      firstName: z
        .string({
          invalid_type_error: 'Debes ingresar los nombres',
        })
        .min(2, 'El nombres debe tener más de 1 caracter')
        .max(50, 'Los nombres deben tener como máximo 50 caracteres')
        .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/, 'Formato incorrecto'),
      lastName: z
        .string({
          invalid_type_error: 'Debes ingresar los apellidos',
        })
        .min(2, 'El apellido debe tener más 1 o más caracteres')
        .max(50, 'Los apellidos deben tener como máximo 50 caracteres')
        .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/, 'El formato es incorrecto'),
      documentType: z.string({
        invalid_type_error: 'Debes seleccionar el tipo de documento',
      }),
      document: z.string({
        invalid_type_error: 'Debes ingresar el número de documento',
      }),
      companyName: z
        .string()
        .min(2, 'La razón social debe tener 2 o más caracteres')
        .max(25, 'La razón social debe tener como máximo 25 caracteres')
        .regex(
          /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s&.,\/\-\u00C0-\u017FüÜ0-9]+$/u,
          'El formato es incorrecto'
        )
        .optional(),
      email: z
        .string({
          invalid_type_error: 'Debes ingresar tu correo electrónico',
        })
        .email('Correo electrónico inválido')
        .min(5, 'El correo electrónico tener 5 o más caracteres')
        .max(50, 'El correo electrónico debe tener como máximo 50 caracteres'),
      phoneNumber: z
        .string({
          invalid_type_error: 'Debes ingresar el número de teléfono',
        })
        .min(7, 'El número de teléfono debe tener 7 o más caracteres')
        .max(15, 'Los nombres deben tener como máximo 15 caracteres')
        .regex(/^[0-9]+$/, 'El formato es incorrecto'),
      street: z
        .string({
          invalid_type_error: 'Debes ingresar la dirección',
        })
        .min(5, 'La dirección tener 5 o más caracteres')
        .max(40, 'La dirección debe tener como máximo 40 caracteres')
        .regex(
          /^[a-zA-Z\u00C0-\u017F\u00F1\u00D1\-\/.\-'´`0-9 ]+$/u,
          'El formato es incorrecto'
        ),
      state: z.string({
        invalid_type_error: 'Debes seleccionar el departamento',
      }),
      city: z.string({
        invalid_type_error: 'Debes seleccionar el provincia',
      }),
      postalCode: z
        .string({
          invalid_type_error: 'Debes ingrsar el código postal',
        })
        .min(5, 'El código postal debe tener 5 o más caracteres')
        .max(10, 'El código postal debe tener como máximo 10 caracteres')
        .regex(/^[0-9]+$/, 'El formato es incorrecto'),
    })
    .superRefine(({ documentType, document, companyName }, context) => {
      if (documentType === 'DNI' && document.length !== 8) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El documento debe tener 8 dígitos',
          path: ['document'],
        });
      }
      if (
        documentType === 'CE' &&
        !(document.length >= 9 && document.length <= 12)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El documento debe tener entre 9 y 12 dígitos',
          path: ['document'],
        });
      }
      if (
        documentType === 'PASAPORTE' &&
        !(document.length >= 8 && document.length <= 12)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El documento debe tener entre 8 y 12 dígitos',
          path: ['document'],
        });
      }
      if (documentType === 'RUC' && document.length !== 11) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El documento debe tener 11 dígitos',
          path: ['document'],
        });
      }
      if (
        documentType === 'OTROS' &&
        !(document.length >= 8 && document.length <= 12)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El documento debe tener entre 8 y 12 dígitos',
          path: ['document'],
        });
      }

      if (
        documentType === 'RUC' &&
        (!companyName || companyName?.length === 0)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debes ingresar la razón social',
          path: ['companyName'],
        });
      }

      if (
        documentType === 'RUC' &&
        !!companyName &&
        !(companyName.length >= 5 && companyName.length <= 25)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La razón social debe tener entre 5 y 25 dígitos',
          path: ['companyName'],
        });
      }
    }),
  handler: async formData => {
    try {
      const updatedUser = await directus.request(
        updateUser(formData.userId, {
          billingAddressDocumentType: formData.documentType,
          billingAddressDocument: formData.document,
          companyName: formData.companyName,
          street: formData.street,
          state: formData.state,
          city: formData.city,
          postalCode: formData.postalCode,
        })
      );
      return formData;
    } catch (e: any) {
      console.error(e);
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: e.message || 'Ocurrió un error',
      });
    }
  },
});
