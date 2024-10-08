import type { Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma'
import { getPublicUrl } from '../utils/url'

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    select: {
      username: true,
      email: true,
      avatar: true,
      cover: true,
      bio: true,
      link: true,
    },
    where: { email },
  })

  if (!user) return null

  return {
    ...user,
    avatar: getPublicUrl(user.avatar),
    cover: getPublicUrl(user.cover),
  }
}

export const findUserBySlug = async (slug: string) => {
  const user = await prisma.user.findFirst({
    select: {
      username: true,
      name: true,
      avatar: true,
      cover: true,
      bio: true,
      link: true,
    },
    where: { username: slug },
  })

  if (!user) return null

  return {
    ...user,
    avatar: getPublicUrl(user.avatar),
    cover: getPublicUrl(user.cover),
  }
}

export const createUser = async (data: Prisma.UserCreateInput) => {
  const newUser = await prisma.user.create({ data })

  return {
    ...newUser,
    avatar: getPublicUrl(newUser.avatar),
    cover: getPublicUrl(newUser.cover),
  }
}
