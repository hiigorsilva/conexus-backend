export const getPublicUrl = (url: string) => {
  return `${process.env.BASE_URL}/${url}`
}
