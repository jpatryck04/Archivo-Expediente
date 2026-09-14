import { z } from 'zod';

export const entradaSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es obligatorio')
    .max(50)
    .regex(
      /^[A-Z0-9-]+$/,
      'Formato inválido. Use letras mayúsculas, números y guiones'
    ),
  name: z.string().max(200).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
  location_id: z.string().uuid('Debe seleccionar una ubicación'),
});

export type EntradaFormData = z.infer<typeof entradaSchema>;

export const salidaSchema = z.object({
  expediente_id: z.string().uuid(),
  reason: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
  requested_by: z.string().max(200).optional().or(z.literal('')),
});

export type SalidaFormData = z.infer<typeof salidaSchema>;

export const devolucionSchema = z.object({
  expediente_id: z.string().uuid(),
  location_id: z.string().uuid('Debe seleccionar una ubicación'),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type DevolucionFormData = z.infer<typeof devolucionSchema>;

export const trasladoSchema = z.object({
  expediente_id: z.string().uuid(),
  new_location_id: z.string().uuid('Debe seleccionar una ubicación'),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type TrasladoFormData = z.infer<typeof trasladoSchema>;