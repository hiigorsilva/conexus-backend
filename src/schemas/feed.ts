import z from 'zod'

export const feedSchema = z.object({
  page: z.coerce.number().min(0).optional(),
})
