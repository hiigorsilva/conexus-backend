import { hash } from 'bcrypt-ts'
import type { RequestHandler } from 'express'
import slug from 'slug'
import { signupSchema } from '../schemas/signup'
import { createUser, findUserByEmail, findUserBySlug } from '../services/user'

export const signup: RequestHandler = async (req, res) => {
  // validar os dados recebidos
  const safeData = signupSchema.safeParse(req.body)
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  // validar email
  const hasEmail = await findUserByEmail(safeData.data.email)
  if (hasEmail) {
    res.json({ error: 'Email já cadastrado' })
    return
  }

  // verificar username
  // TODO: permitir que o usuário escolha seu username
  const generateUniqueSlug = async (baseName: string): Promise<string> => {
    const baseSlug = slug(baseName, {
      trim: true,
      lower: true,
      replacement: '',
    })
    const hasSlug = await findUserBySlug(baseSlug)

    if (!hasSlug) return baseSlug

    const slugSuffix = Math.floor(Math.random() * 999999).toString()
    return generateUniqueSlug(baseName + slugSuffix)
  }
  const username = await generateUniqueSlug(safeData.data.name)

  // gerar hash de senha
  const hashPassword = await hash(safeData.data.password, 10)

  // cria o user
  const newUser = await createUser({
    username: username,
    name: safeData.data.name,
    email: safeData.data.email,
    password: hashPassword,
  })

  // cria  token
  const token = ''

  // retorna o resultado (token, user)

  res.status(201).json({
    token,
    user: {
      username: newUser.username,
      name: newUser.name,
      avatar: newUser.avatar,
    },
  })
}
