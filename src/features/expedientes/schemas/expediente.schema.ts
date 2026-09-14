import { z } from 'zod';

export const expedienteSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es obligatorio')
    .max(50, 'El código no puede exceder 50 caracteres')
    .regex(
      /^[A-Z0-9-]+$/,
      'El código solo puede contener letras mayúsculas, números y guiones'
    ),
  name: z
    .string()
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  location_id: z.string().uuid('Ubicación inválida').optional().nullable(),
});

export type ExpedienteFormData = z.infer<typeof expedienteSchema>;

export const expedienteUpdateSchema = expedienteSchema.partial().omit({ code: true });
export type ExpedienteUpdateData = z.infer<typeof expedienteUpdateSchema>;