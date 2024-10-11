import { prisma } from '../utils/prisma'
import { getPublicUrl } from '../utils/url'

export const findTweetById = async (id: number) => {
  const tweet = await prisma.tweet.findFirst({
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
          username: true,
        },
      },
      likes: {
        select: {
          userSlug: true,
        },
      },
    },
    where: { id },
  })

  if (tweet) {
    tweet.user.avatar = getPublicUrl(tweet.user.avatar)
    return tweet
  }

  return null
}

export const createTweet = async (
  username: string,
  body: string,
  answer?: number
) => {
  const newTweet = await prisma.tweet.create({
    data: {
      body,
      userSlug: username,
      answerOf: answer ? answer : 0,
    },
  })
  return newTweet
}
