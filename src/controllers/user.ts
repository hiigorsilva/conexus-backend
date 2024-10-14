import type { Response } from 'express'
import { userTweetsSchema } from '../schemas/user-tweets'
import { findTweetByUser } from '../services/tweet'
import {
  findUserBySlug,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetsCount,
} from '../services/user'
import type { ExtendedRequest } from '../types/extended-request'

export const getUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const { username } = req.params

    const user = await findUserBySlug(username)
    if (!user) {
      res.json({ error: 'Usuário não encontrado' })
      return
    }

    const followingCount = await getUserFollowingCount(user.username)
    const followersCount = await getUserFollowersCount(user.username)
    const tweetsCount = await getUserTweetsCount(user.username)

    res.json({ user, followingCount, followersCount, tweetsCount })
  } catch (err) {
    console.error('Erro ao buscar usuário: ', err)
  }
}

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
  try {
    const { username } = req.params

    const safeData = userTweetsSchema.safeParse(req.query)
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors })
      return
    }

    const currentPage = safeData.data.page ?? 0
    const perPage = 2

    const tweets = await findTweetByUser(username, currentPage, perPage)

    res.json({ tweets, page: currentPage })
  } catch (err) {
    console.error('Erro ao buscar tweets do usuário: ', err)
  }
}
