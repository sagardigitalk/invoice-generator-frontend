import React from 'react';
import { useNavigate } from 'react-router';
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useInvoices } from '../store/InvoiceContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { invoices } = useInvoices();

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);
  const pendingAmount = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const stats = [
    {
      title: 'Total Invoices',
      value: totalInvoices,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Paid Invoices',
      value: paidInvoices,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Amount',
      value: `₹${pendingAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your invoice management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/invoices/create')}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create New Invoice
          </Button>
          <Button
            onClick={() => navigate('/invoices')}
            variant="outline"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            View All Invoices
          </Button>
          <Button
            onClick={() => navigate('/customers')}
            variant="outline"
            className="w-full"
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Customers
          </Button>
        </div>
      </Card>

      {/* Recent Invoices */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
          <Button variant="link" onClick={() => navigate('/invoices')}>
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Invoice No</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{invoice.invoiceNo}</td>
                  <td className="py-3 px-4">{invoice.customerName}</td>
                  <td className="py-3 px-4">{new Date(invoice.date).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-4">₹{invoice.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : invoice.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
