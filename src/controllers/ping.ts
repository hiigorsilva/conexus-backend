import type { Request, Response } from 'express'
import type { ExtendedRequest } from '../types/extended-request'

export const ping = (req: Request, res: Response) => {
  res.json({ pong: true })
}

export const privatePing = (req: ExtendedRequest, res: Response) => {
  res.json({ pong: true, username: req.username })
}
