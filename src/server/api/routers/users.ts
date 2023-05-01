import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { slugify } from 'transliteration'

const zodNickname = z
  .string({
    required_error: 'Никнейм обязателен',
    invalid_type_error: 'Никнейм должен быть строкой',
  })
  .min(5, { message: 'Слишком короткий никнейм' })
  .max(50, { message: 'Слишком длинный никнейм' })
  .refine((nickname) => nickname === slugify(nickname), { message: 'Невалидный никнейм' })

const zodEmail = z
  .string({
    required_error: 'Почта обязательна',
    invalid_type_error: 'Почта должен быть строкой',
  })
  .email({ message: 'Недействительная почта' })
  .min(5, { message: 'Слишком короткая почта' })
  .max(100, { message: 'Слишком длинная почта' })
  .trim()

const zodName = z
  .string({
    required_error: 'Имя обязательно',
    invalid_type_error: 'Имя должно быть строкой',
  })
  .trim()
  .min(3, { message: 'Слишком короткое имя' })
  .max(50, { message: 'Слишком длинное имя' })
  .refine((name) => name === name.replaceAll('\n', ''), { message: 'Невалидное имя' })

const zodTelegramLink = z
  .string({
    required_error: 'Телеграм ссылка обязательна',
    invalid_type_error: 'Телеграм ссылка должен быть строкой',
  })
  .trim()
  .min(3, { message: 'Слишком короткая ссылка' })
  .max(50, { message: 'Слишком длинная ссылка' })
  .url({ message: 'Ссылка должна быть в виде URL' })

const zodUserInfo = z
  .string({
    required_error: 'Описание профиля обязательно',
    invalid_type_error: 'Описание профиля быть строкой',
  })
  .max(280, { message: 'Слишком длинное описание профиля' })
  .trim()

export const usersRouter = createTRPCRouter({
  isValidNewNickname: protectedProcedure
    .input(
      z.object({
        nickname: zodNickname,
      }),
    )
    .query(async ({ ctx, input }) => {
      const usersCount = await ctx.prisma.user.count({ where: { nickname: input.nickname } })
      if (usersCount > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Никнейм существует',
        })
      }
      return true
    }),

  isValidNewEmail: protectedProcedure
    .input(
      z.object({
        email: zodEmail,
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } })
      if (user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Почта существует',
        })
      }
      return true
    }),

  editUser: protectedProcedure
    .input(
      z.object({
        name: zodName.optional(),
        nickname: zodNickname.optional(),
        email: zodEmail.nullable().optional(),
        telegramLink: zodTelegramLink.optional(),
        userInfo: zodUserInfo.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (tx) => {
        const userToUpdate = await tx.user.findFirst({ where: { id: ctx.session.user.id } })
        if (userToUpdate === null) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Несуществующий пользователь',
          })
        }
        await tx.user.update({
          where: { id: ctx.session.user.id },
          data: {
            name: input.name ?? userToUpdate.name,
            nickname: input.nickname ?? userToUpdate.nickname,
            email: input.email ?? userToUpdate.email,
            telegramLink: input.telegramLink ?? userToUpdate.telegramLink,
            userInfo: input.userInfo ?? userToUpdate.userInfo,
          },
        })
      })
    }),
})
