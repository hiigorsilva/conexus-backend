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

export const findUserBySlug = async (username: string) => {
  const user = await prisma.user.findFirst({
    select: {
      username: true,
      name: true,
      avatar: true,
      cover: true,
      bio: true,
      link: true,
    },
    where: { username },
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

export const updateUserInfo = async (
  username: string,
  data: Prisma.UserUpdateInput
) => {
  await prisma.user.update({
    where: { username },
    data,
  })
}

export const getUserFollowing = async (username: string) => {
  const followingRelations = await prisma.follow.findMany({
    select: { user2Slug: true }, // pessoas que o usuário logado está seguindo
    where: { user1Slug: username }, // usuário logado
  })

  return followingRelations.map(follow => follow.user2Slug)
}

export const getUserSuggestions = async (username: string) => {
  const following = await getUserFollowing(username)
  const followingPlusMe = [...following, username]

  type Suggestion = Pick<
    Prisma.UserGetPayload<Prisma.UserDefaultArgs>,
    'name' | 'avatar' | 'username'
  >

  const suggestions: Suggestion[] = await prisma.$queryRaw`
    SELECT
      name, avatar, username
    FROM "user"
    WHERE
      username NOT IN (${followingPlusMe.map(user => `${user}`).join(',')})
    ORDER BY RANDOM()
    LIMIT 2
  `

  for (const suggestion in suggestions) {
    suggestions[suggestion].avatar = getPublicUrl(
      suggestions[suggestion].avatar
    )
  }

  // suggestions.map(suggestion => {
  //   suggestion.avatar = getPublicUrl(suggestion.avatar)
  // })

  return suggestions
}
