import { Disclosure } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import Image from 'next/image'
import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames/dedupe'
import DynamicMobileLayoutMenu from '@/components/layout/dynamic-mobile-layout-menu'
import DynamicLayoutUser from '@/components/layout/dynamic-layout-user'
import DynamicLayoutFooter from '@/components/layout/footer/dynamic-layout-footer'
import { NextSeo } from 'next-seo'
import { type Session } from 'next-auth'
import CommandPalette from '@/components/layout/command-palette'
import SidebarSearchInput from '@/components/form/sidebar-search-input'
import { useHotkeys } from 'react-hotkeys-hook'

export type Navigation = { name: string; href: string }[]
export const navigation: Navigation = [
  { name: 'Находки', href: '/finds' },
  { name: 'Пропажи', href: '/losses' },
]

export interface LayoutProps {
  title: string
  hideTitle?: boolean
  children: React.ReactNode
  session: Session | null
}

export type UserNavigationDropdown = { name: string; func: () => void; href?: string }[][]

export type UserNavigation = Record<'profile' | 'create', UserNavigationDropdown>

export default function Layout(props: LayoutProps) {
  const router = useRouter()
  const session = props.session
  const [openCommandPalette, setOpenCommandPalette] = useState(false)
  useHotkeys('/', () => setOpenCommandPalette(true), { scopes: ['app'] })
  useHotkeys('Esc', () => setOpenCommandPalette(false), { scopes: ['app'] })

  const userNavigation: UserNavigation = {
    create: [
      [
        {
          name: 'Сообщить о находке',
          func: () => void router.push(session ? '/finds/create' : '/finds'),
          href: '/finds/create',
        },
        {
          name: 'Сообщить о пропаже',
          func: () => void router.push(session ? '/losses/create' : '/losses'),
          href: '/losses/create',
        },
      ],
    ],
    profile: [
      [
        {
          name: 'Ваш профиль',
          func: () => void router.push(session ? `/u/${session.user.nickname}` : '/'),
          href: '/u/[nickname]',
        },
        {
          name: 'Ваши пропажи',
          func: () => void router.push(session ? '/losses/my' : '/losses'),
          href: '/losses/my',
        },
        {
          name: 'Ваши находки',
          func: () => void router.push(session ? '/finds/my' : '/finds'),
          href: '/finds/my',
        },
      ],
      [{ name: 'Выйти', func: () => void signOut() }],
    ],
  }

  return (
    <>
      {props.hideTitle || <NextSeo title={props.title} />}
      <div className='min-h-screen'>
        <Disclosure as='nav' className='bg-gray-800'>
          {({ open }) => (
            <>
              <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                  <div className='flex basis-1/3 justify-start md:hidden md:basis-0'>
                    {/* Mobile menu button */}
                    <Disclosure.Button className='inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                      <span className='sr-only'>Открыть главное меню</span>
                      {open ? (
                        <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                      ) : (
                        <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className='flex basis-1/3 items-center justify-center md:basis-1/2 md:justify-start'>
                    <Link className='flex-shrink-0' href='/'>
                      <Image
                        priority
                        className='h-8 w-8'
                        src='/assets/ninja-logo-white.svg'
                        alt='Mirea Ninja'
                        width={10}
                        height={10}
                      />
                    </Link>
                    <div className='hidden md:block'>
                      <div className='ml-10 flex items-baseline space-x-4'>
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              router.pathname === item.href
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium',
                            )}
                            aria-current={router.pathname === item.href ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex basis-1/3 items-center justify-end md:basis-1/2'>
                    <div className='pr-3'>
                      <button
                        type='button'
                        onClick={() => setOpenCommandPalette(true)}
                        className='rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 lg:hidden'
                      >
                        <span className='sr-only'>Быстрый поиск</span>
                        <MagnifyingGlassIcon className='h-6 w-6' aria-hidden='true' />
                      </button>
                      <SidebarSearchInput setOpenCommandPalette={setOpenCommandPalette} />
                    </div>
                    {session ? (
                      <DynamicLayoutUser
                        userNavigation={userNavigation}
                        openCommandPalette={openCommandPalette}
                        setOpenCommandPalette={setOpenCommandPalette}
                      />
                    ) : (
                      <button
                        onClick={() => void signIn()}
                        type='button'
                        className='h-8 rounded-md border px-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                      >
                        Войти
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <DynamicMobileLayoutMenu
                session={session}
                navigation={navigation}
                userNavigation={userNavigation}
              />
            </>
          )}
        </Disclosure>

        <header className='bg-white shadow-sm'>
          <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
            <h1 className='text-lg font-semibold leading-6 text-gray-900'>{props.title}</h1>
          </div>
        </header>
        <div className='mx-4 flex max-w-7xl flex-col py-4 sm:px-6 md:mx-auto lg:px-8'>
          <div>{props.children}</div>
          <DynamicLayoutFooter />
        </div>
      </div>
      <CommandPalette open={openCommandPalette} setOpen={setOpenCommandPalette} />
    </>
  )
}
