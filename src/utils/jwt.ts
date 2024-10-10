import type { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { findUserBySlug } from '../services/user'
import type { ExtendedRequest } from '../types/extended-request'

export const createJWT = (username: string) => {
  return jwt.sign({ username }, process.env.JWT_SECRET as string)
}

export const verifyJWT = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ error: 'Erro de autenticação' })
    return
  }

  const token = authHeader.split(' ')[1]
  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (error, decoded: any) => {
      if (error) {
        res.status(401).json({ error: 'Erro de autenticação' })
        return
      }

      try {
        const user = await findUserBySlug(decoded.username)
        if (!user) {
          res.status(401).json({ error: 'Erro de autenticação' })
          return
        }

        req.username = user.username
        next()
      } catch (err) {
        res.status(500).json({ error: 'Erro interno de servidor' })
      }
    }
  )
}
