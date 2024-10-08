import type { RequestHandler } from 'express'

export const signup: RequestHandler = async (req, res) => {
  // validar os dados recebidos
  // validar email
  // verificar username
  // gerar hash de senha
  // cria o user
  // cria  token
  // retorna o resultado (token, user)

  res.json({ message: 'Hello World' })
}
