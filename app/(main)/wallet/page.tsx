import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CareerWalletClient from './CareerWalletClient'

export default async function WalletPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return <CareerWalletClient />
}