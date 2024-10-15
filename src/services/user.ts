import type { Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma'
import { getPublicUrl } from '../utils/url'

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    select: {
      username: true,
      name: true,
      email: true,
      password: true,
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

export const getUserFollowingCount = async (username: string) => {
  const count = await prisma.follow.count({
    where: { user1Slug: username },
  })
  return count
}

export const getUserFollowersCount = async (username: string) => {
  const count = await prisma.follow.count({
    where: { user2Slug: username },
  })
  return count
}

export const getUserTweetsCount = async (username: string) => {
  const count = await prisma.tweet.count({
    where: { userSlug: username },
  })
  return count
}

export const checkIfFollows = async (user1Slug: string, user2Slug: string) => {
  const follows = await prisma.follow.findFirst({
    where: { user1Slug, user2Slug },
  })
  return !!follows
}

export const followUser = async (user1Slug: string, user2Slug: string) => {
  if (user1Slug === user2Slug) {
    throw new Error('Você não pode seguir a si mesmo.')
  }

  await prisma.follow.create({
    data: { user1Slug, user2Slug },
  })
}

export const unfollowUser = async (user1Slug: string, user2Slug: string) => {
  await prisma.follow.deleteMany({
    where: { user1Slug, user2Slug },
  })
}
