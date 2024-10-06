// src/app/api/customers/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany()
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, contact, accountId } = await request.json()
    const customer = await prisma.customer.create({
      data: { name, contact, accountId },
    })
    return NextResponse.json(customer, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create customer' }, { status: 400 })
  }
}
