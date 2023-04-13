import { prisma } from '@/server/db'
import { v4 as uuid4 } from 'uuid'
import { slugify } from 'transliteration'

export async function getUniqueNickname(nickname: string) {
  if ((await prisma.user.findUnique({ where: { nickname } })) !== null) {
    nickname = `${nickname}-${uuid4()}`
  }
  return slugify(nickname)
}
