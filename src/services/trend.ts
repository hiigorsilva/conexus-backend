import { prisma } from '../utils/prisma'

export const addHashtagToTrend = async (hashtag: string) => {
  const tag = await prisma.trend.findFirst({
    where: { hashtag },
  })

  // incrementa o contador caso exista a hashtag
  if (tag) {
    await prisma.trend.update({
      where: { id: tag.id },
      data: { counter: tag.counter + 1, updatedAt: new Date() },
    })
  }

  // cria o trend se não existe a hashtag
  if (!tag) {
    await prisma.trend.create({
      data: { hashtag },
    })
  }
}

export const getTrending = async () => {
  const trends = await prisma.trend.findMany({
    select: {
      hashtag: true,
      counter: true,
    },
    orderBy: { counter: 'desc' },
    take: 4,
  })

  return trends
}
