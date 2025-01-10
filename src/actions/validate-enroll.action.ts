import { directus } from '@/utils/directus';
import { readItem, readUser } from '@directus/sdk';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const validateEnrollAction = defineAction({
  input: z.object({
    userId: z.string(),
    courseId: z.string(),
  }),
  handler: async data => {
    try {
      const course = await directus.request(
        readItem('internalCourse', data.courseId)
      );
      const user = await directus.request(
        readUser(data.userId, {
          fields: ['type', { courses: ['*'] }],
        })
      );

      const courseExists = !!(user.courses || []).find(
        ({ internalCourse_id }) => internalCourse_id === data.courseId
      );

      if (courseExists) {
        throw new Error(
          `Ud. ya se encuentra inscrito en el curso ${course.title}`
        );
      }

      if (
        (user.type === 'EXTERNO' && !course.generalAdmission) ||
        (user.type === 'ASOCIADO' &&
          !course.partner &&
          !course.generalAdmission) ||
        (user.type === 'CONTRATADO' &&
          !course.contracted &&
          !course.generalAdmission)
      ) {
        throw new Error(
          `No se puede matricular en el curso ${course.title}. Puede contactarse con nosotros para obtener más información`
        );
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
