import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicCreatePost from '@/components/posts/create-post/dynamic-create-post'
import { PostItemReason } from '@prisma/client'
import DefaultSeo from '@/components/seo/default-seo'

const title = 'Сообщить о находке'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/finds',
      },
    }
  }
  return { props: { session } }
}

const CreateFind: NextPageWithLayout = () => {
  return (
    <>
      <DefaultSeo />
      <DynamicCreatePost
        name='Находка'
        description='Опишите находку, чтобы хозяин смог легко ее узнать'
        postItemReason={PostItemReason.FOUND}
        routePushOnExit='/finds'
      />
    </>
  )
}

CreateFind.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default CreateFind
