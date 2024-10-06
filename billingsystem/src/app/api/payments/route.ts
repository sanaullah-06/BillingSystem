// src/app/api/payments/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Handle GET requests to fetch all payments
export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: { customer: true }, // Include customer data
      orderBy: { date: 'desc' },   // Optional: Order payments by date
    })
    return NextResponse.json(payments)
  } catch (error) {
    console.error('GET /api/payments error:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}

// Handle POST requests to add a new payment
export async function POST(request: Request) {
  try {
    const { accountId, amount } = await request.json()

    // Basic validation
    if (!accountId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const customer = await prisma.customer.findUnique({ where: { accountId } })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const payment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        amount: parseFloat(amount),
      },
      include: { customer: true }, // Optionally include customer in the response
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/payments error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create payment' }, { status: 400 })
  }
}
