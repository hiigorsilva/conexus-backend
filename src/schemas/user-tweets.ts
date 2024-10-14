import z from 'zod'

export const userTweetsSchema = z.object({
  page: z.coerce.number().min(0).optional(),
})
