import dynamic from 'next/dynamic'
import { type GetServerSideProps } from 'next'
import { getServerAuthSession } from '@/server/auth'
import DefaultSeo from '@/components/seo/default-seo'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      props: {},
    }
  }
  return {
    redirect: {
      destination: `/finds`,
      permanent: false,
    },
  }
}

const Landing = dynamic(() => import('@/components/landing/landing'), { ssr: true })

export default function LandingPage() {
  return (
    <>
      <DefaultSeo />
      <Landing />
    </>
  )
}
