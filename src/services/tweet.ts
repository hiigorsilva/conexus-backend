import { prisma } from '../utils/prisma'
import { getPublicUrl } from '../utils/url'

export const findTweetById = async (id: number) => {
  try {
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
  } catch (err) {
    console.error('Erro ao buscar tweet: ', err)
  }
}

export const createTweet = async (
  username: string,
  body: string,
  answer?: number
) => {
  try {
    const newTweet = await prisma.tweet.create({
      data: {
        body,
        userSlug: username,
        answerOf: answer ? answer : 0,
      },
    })
    return newTweet
  } catch (err) {
    console.error('Erro ao criar tweet: ', err)
  }
}

export const findAnswersFromTweet = async (id: number) => {
  try {
    const answers = await prisma.tweet.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: {
          select: {
            userSlug: true,
          },
        },
      },
      where: { answerOf: id },
    })

    answers.map(answer => {
      answer.user.avatar = getPublicUrl(answer.user.avatar)
    })

    return answers
  } catch (err) {
    console.error('Erro ao buscar respostas: ', err)
  }
}
export const checkIfTweetIsLikedByUser = async (
  username: string,
  id: number
) => {
  try {
    const isLiked = await prisma.tweetLike.findFirst({
      where: {
        userSlug: username,
        tweetId: id,
      },
    })

    return !!isLiked
  } catch (err) {
    console.error('Erro ao verificar se o tweet é curtido: ', err)
  }
}

export const unlikedTweet = async (username: string, id: number) => {
  try {
    await prisma.tweetLike.deleteMany({
      where: {
        userSlug: username,
        tweetId: id,
      },
    })
  } catch (err) {
    console.error('Erro ao descurtir tweet: ', err)
  }
}

export const likeTweet = async (username: string, id: number) => {
  try {
    await prisma.tweetLike.create({
      data: {
        userSlug: username,
        tweetId: id,
      },
    })
  } catch (err) {
    console.error('Erro ao curtir tweet: ', err)
  }
}
