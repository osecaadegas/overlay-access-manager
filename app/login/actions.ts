'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function redirectAfterLogin(role: string) {
  if (role === 'ADMIN') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}
