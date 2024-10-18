import z from 'zod'

export const searchSchema = z.object({
  q: z
    .string({ message: 'Digite alguma coisa para pesquisar' })
    .min(3, 'Digite ao menos 3 caracteres')
    .trim(),
  page: z.coerce.number().min(0).optional(),
})
