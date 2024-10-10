import { compare, hash } from 'bcrypt-ts'
import type { RequestHandler } from 'express'
import slug from 'slug'
import { signinSchema } from '../schemas/signin'
import { signupSchema } from '../schemas/signup'
import { createUser, findUserByEmail, findUserBySlug } from '../services/user'
import { createJWT } from '../utils/jwt'

export const signup: RequestHandler = async (req, res) => {
  // validar os dados preenchidos
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
  const token = createJWT(username)

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

export const signin: RequestHandler = async (req, res) => {
  // valida os dados preenchidos
  const safeData = signinSchema.safeParse(req.body)
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  // verifica se o email está cadastrado
  const user = await findUserByEmail(safeData.data.email)
  if (!user) {
    res.status(401).json({ error: 'Email ou senha inválidos' })
    return
  }

  // verifica se a senha está correta
  const verifyPass = await compare(safeData.data.password, user.password)
  if (!verifyPass) {
    res.status(401).json({ error: 'Email ou senha inválidos' })
  }

  // cria o token
  const token = createJWT(user.username)

  // retorna o resultado (token, user)
  res.json({
    token,
    user: {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    },
  })
}
