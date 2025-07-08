import { createHiveChain } from '@hiveio/wax';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(_: NextRequest) {
  await createHiveChain();

  return NextResponse.next();
}

export const config = {
  matcher: '/'
}
