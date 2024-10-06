"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Customer {
  id: number
  name: string
  contact: string
  accountId: string
}

interface Transaction {
  id: number
  customerId: number
  item: string
  quantity: number
  price: number
  date: string
  customer: Customer
}

interface Payment {
  id: number
  customerId: number
  amount: number
  date: string
  customer: Customer
}

interface Invoice {
  customer: Customer
  transactions: Transaction[]
  totalAmount: number
  totalPayments: number
  outstandingBalance: number
}

export default function BillingSystemUI() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoice, setInvoice] = useState<Invoice | null>(null)

  const [newCustomer, setNewCustomer] = useState({ name: "", contact: "", accountId: "" })
  const [newTransaction, setNewTransaction] = useState({ accountId: "", item: "", quantity: "", price: "" })
  const [newPayment, setNewPayment] = useState({ accountId: "", amount: "" })
  const [invoiceAccountId, setInvoiceAccountId] = useState<string>("")


  // Fetch initial data
  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))

    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(error => {
        console.error('Error fetching transactions:', error)
        alert('Failed to fetch transactions')
      })

    fetch('/api/payments')
      .then(res => res.json())
      .then(data => setPayments(data))
  }, [])

  // Handlers for adding data
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      })
      if (!res.ok) throw new Error('Failed to add customer')
      const customer = await res.json()
      setCustomers([...customers, customer])
      setNewCustomer({ name: "", contact: "", accountId: "" })
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to add transaction')
      }
      const transaction = await res.json()
      setTransactions([...transactions, transaction])
      setNewTransaction({ accountId: "", item: "", quantity: "", price: "" })
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to add payment')
      }
      const payment = await res.json()
      setPayments([...payments, payment])
      setNewPayment({ accountId: "", amount: "" })
    } catch (error: any) {
      alert(error.message)
    }
  }

  const generateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // console.log('Received GET request for accountId:', invoiceAccountId)
      const res = await fetch(`/api/invoices/${encodeURIComponent(invoiceAccountId.trim())}`)
      console.log('Received GET request for accountId: aya')
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to generate invoice')
      }
      const data: Invoice = await res.json()
      setInvoice(data)
    } catch (error: any) {
      alert(error.message)
      setInvoice(null)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Billing System</h1>
      <Tabs defaultValue="customers">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        {/* Customers Tab */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Add Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={newCustomer.contact}
                    onChange={e => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountId">Account ID</Label>
                  <Input
                    id="accountId"
                    value={newCustomer.accountId}
                    onChange={e => setNewCustomer({ ...newCustomer, accountId: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Add Customer</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Account ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.contact}</TableCell>
                      <TableCell>{customer.accountId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <Label htmlFor="transactionAccountId">Account ID</Label>
                  <Input
                    id="transactionAccountId"
                    value={newTransaction.accountId}
                    onChange={e => setNewTransaction({ ...newTransaction, accountId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="item">Item</Label>
                  <Input
                    id="item"
                    value={newTransaction.item}
                    onChange={e => setNewTransaction({ ...newTransaction, item: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newTransaction.quantity}
                    onChange={e => setNewTransaction({ ...newTransaction, quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newTransaction.price}
                    onChange={e => setNewTransaction({ ...newTransaction, price: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Add Transaction</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Transaction List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.customer ? transaction.customer.name : 'Unknown Customer'}
                      </TableCell>
                      <TableCell>{transaction.item}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>${transaction.price.toFixed(2)}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Add Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <Label htmlFor="paymentAccountId">Account ID</Label>
                  <Input
                    id="paymentAccountId"
                    value={newPayment.accountId}
                    onChange={e => setNewPayment({ ...newPayment, accountId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Add Payment</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Payment List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.customer.name}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Generate Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={generateInvoice} className="space-y-4">
                <div>
                  <Label htmlFor="invoiceAccountId">Account ID</Label>
                  <Input
                    id="invoiceAccountId"
                    placeholder="Enter Account ID"
                    value={invoiceAccountId}
                    onChange={e => setInvoiceAccountId(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">Generate Invoice</Button>
              </form>
              
              {invoice && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Invoice for {invoice.customer.name}</CardTitle>
                    <CardDescription>Account ID: {invoice.customer.accountId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoice.transactions.map(t => (
                          <TableRow key={t.id}>
                            <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                            <TableCell>{t.item}</TableCell>
                            <TableCell>{t.quantity}</TableCell>
                            <TableCell>${t.price.toFixed(2)}</TableCell>
                            <TableCell>${(t.quantity * t.price).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div>Total Amount: ${invoice.totalAmount.toFixed(2)}</div>
                    <div>Total Payments: ${invoice.totalPayments.toFixed(2)}</div>
                    <div>Outstanding Balance: ${invoice.outstandingBalance.toFixed(2)}</div>
                  </CardFooter>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
