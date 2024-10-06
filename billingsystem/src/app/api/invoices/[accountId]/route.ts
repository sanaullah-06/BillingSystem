// src/app/api/invoices/[accountId]/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { accountId: string } }) {
  try {
    console.log('Received GET request for accountId:', params.accountId)

    const { accountId } = params
    const customer = await prisma.customer.findUnique({
      where: { accountId },
      include: {
        transactions: true,
        payments: true,
      },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const totalAmount = customer.transactions.reduce((sum, t) => sum + t.quantity * t.price, 0)
    const totalPayments = customer.payments.reduce((sum, p) => sum + p.amount, 0)
    const outstandingBalance = totalAmount - totalPayments

    const invoice = {
      customer,
      transactions: customer.transactions,
      totalAmount,
      totalPayments,
      outstandingBalance,
    }

    return NextResponse.json(invoice)
  } catch (error: any) {
    console.error('GET /api/invoices/[accountId] error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate invoice' }, { status: 500 })
  }
}
