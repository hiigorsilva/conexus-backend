import type { RequestHandler } from 'express'
import { signupSchema } from '../schemas/signup'

export const signup: RequestHandler = async (req, res) => {
  // validar os dados recebidos
  const safeData = signupSchema.safeParse(req.body)
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  // validar emaily
  // verificar username
  // gerar hash de senha
  // cria o user
  // cria  token
  // retorna o resultado (token, user)

  res.json({})
}
