-- CreateTable
CREATE TABLE "user" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'default.jpg',
    "cover" TEXT NOT NULL DEFAULT 'default.jpg',
    "bio" TEXT,
    "link" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "tweet" (
    "id" SERIAL NOT NULL,
    "userSlug" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answerOf" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tweet_like" (
    "id" SERIAL NOT NULL,
    "userSlug" TEXT NOT NULL,
    "tweetId" INTEGER NOT NULL,

    CONSTRAINT "tweet_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow" (
    "id" SERIAL NOT NULL,
    "user1Slug" TEXT NOT NULL,
    "user2Slug" TEXT NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trend" (
    "id" SERIAL NOT NULL,
    "hashtag" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "tweet" ADD CONSTRAINT "tweet_userSlug_fkey" FOREIGN KEY ("userSlug") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tweet_like" ADD CONSTRAINT "tweet_like_userSlug_fkey" FOREIGN KEY ("userSlug") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tweet_like" ADD CONSTRAINT "tweet_like_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
