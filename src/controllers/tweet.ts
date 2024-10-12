import type { Response } from 'express'
import { addTweetSchema } from '../schemas/add-tweet'
import { addHashtagToTrend } from '../services/trend'
import { createTweet, findTweetById } from '../services/tweet'
import type { ExtendedRequest } from '../types/extended-request'

export const addTweet = async (req: ExtendedRequest, res: Response) => {
  // valida dados enviados
  const safeData = addTweetSchema.safeParse(req.body)
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  // verifica se é resposta
  if (safeData.data.answer) {
    const hasAnswerTweet = await findTweetById(
      Number.parseInt(safeData.data.answer)
    )
    if (!hasAnswerTweet) {
      res.json({ error: 'Tweet não encontrado' })
      return
    }
  }

  // cria o tweet
  const newTweet = await createTweet(
    req.username as string,
    safeData.data.body,
    safeData.data.answer ? Number.parseInt(safeData.data.answer) : 0
  )

  // adiciona a hashtag ao trend
  const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g)
  if (hashtags) {
    for (const hashtag of hashtags) {
      if (hashtag.length >= 2) {
        await addHashtagToTrend(hashtag)
      }
    }
  }

  res.json({ tweet: newTweet })
}

export const getTweet = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params

  const tweet = await findTweetById(Number.parseInt(id))
  if (!tweet) {
    res.json({ error: 'Tweet não encontrado' })
    return
  }

  res.json({ tweet })
}
