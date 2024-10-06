// src/app/api/transactions/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { customer: true }, // Ensure customer data is included
      orderBy: { date: 'desc' },   // Optional: Order transactions by date
    })
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('GET /api/transactions error:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { accountId, item, quantity, price } = await request.json()

    // Basic validation
    if (!accountId || !item || !quantity || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const customer = await prisma.customer.findUnique({ where: { accountId } })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        customerId: customer.id,
        item,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      },
      include: { customer: true }, // Optionally include customer in the response
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/transactions error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create transaction' }, { status: 400 })
  }
}
