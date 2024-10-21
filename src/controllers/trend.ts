import type { Response } from 'express'
import { getTrending } from '../services/trend'
import type { ExtendedRequest } from '../types/extended-request'

export const getTrends = async (req: ExtendedRequest, res: Response) => {
  const trends = await getTrending()

  res.json({ trends })
}
