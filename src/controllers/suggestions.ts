import type { Response } from 'express'
import { getUserSuggestions } from '../services/user'
import type { ExtendedRequest } from '../types/extended-request'

export const getSuggestions = async (req: ExtendedRequest, res: Response) => {
  const suggestions = await getUserSuggestions(req.username as string)

  res.json({ users: suggestions })
}
