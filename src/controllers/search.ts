import type { Response } from 'express'
import { searchSchema } from '../schemas/search'
import { findTweetsByBody } from '../services/tweet'
import type { ExtendedRequest } from '../types/extended-request'

export const searchTweets = async (req: ExtendedRequest, res: Response) => {
  const safeData = searchSchema.safeParse(req.query)
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  const perPage = 2
  const currentPage = safeData.data.page ?? 0

  const tweets = await findTweetsByBody(safeData.data.q, currentPage, perPage)

  res.json({ tweets, page: currentPage })
}
