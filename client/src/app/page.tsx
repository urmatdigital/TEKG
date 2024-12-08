import dynamic from 'next/dynamic'

const AppWithNoSSR = dynamic(() => import('./AppClient'), { ssr: false })

export default function Home() {
  return <AppWithNoSSR />
} 