import z from 'zod'

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Digite ao menos 2 caracteres').optional(),
  bio: z.string().min(2, 'Digite ao menos 2 caracteres').optional(),
  link: z.string().url('Digite uma URL válida').optional(),
})
