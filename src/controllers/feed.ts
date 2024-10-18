import type { Response } from 'express'
import { feedSchema } from '../schemas/feed'
import { findTweetFeed } from '../services/tweet'
import { getUserFollowing } from '../services/user'
import type { ExtendedRequest } from '../types/extended-request'

export const getFeed = async (req: ExtendedRequest, res: Response) => {
  const safeData = feedSchema.safeParse(req.query)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  const perPage = 2
  const currentPage = safeData.data.page ?? 0

  const following = await getUserFollowing(req.username as string)
  const tweets = await findTweetFeed(following, currentPage, perPage)

  res.json({ tweets, page: currentPage })
}
