import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { HeroSection } from '@/components/landing/HeroSection'

export default async function HomePage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')
  return <HeroSection />
}