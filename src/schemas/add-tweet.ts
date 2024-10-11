import z from 'zod'

export const addTweetSchema = z.object({
  body: z.string({ message: 'Precisa digitar algo' }),
  answer: z.string().optional(),
})
