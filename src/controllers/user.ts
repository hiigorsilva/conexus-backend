import type { Response } from 'express'
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
