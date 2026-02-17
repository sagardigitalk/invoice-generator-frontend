import React, { useMemo, useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useCustomers } from '../store/CustomerContext';

export function Customers() {
  const {
    customers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    gst: '',
    pan: '',
    mobile: '',
    email: '',
  });

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        const term = search.toLowerCase();
        return (
          customer.name.toLowerCase().includes(term) ||
          customer.mobile.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term)
        );
      }),
    [customers, search]
  );

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      address: '',
      gst: '',
      pan: '',
      mobile: '',
      email: '',
    });
  };

  const startCreate = () => {
    resetForm();
  };

  const startEdit = (id: string) => {
    const existing = customers.find((customer) => customer.id === id);
    if (!existing) return;
    setEditingId(id);
    setForm({
      name: existing.name,
      address: existing.address,
      gst: existing.gst,
      pan: existing.pan,
      mobile: existing.mobile,
      email: existing.email,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await updateCustomer(editingId, form);
    } else {
      await createCustomer(form);
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
            <p className="text-gray-600">
              Manage your customer database
            </p>
          </div>
          <Button onClick={startCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Customer' : 'Add Customer'}
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <Input
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({ ...form, mobile: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST
                  </label>
                  <Input
                    value={form.gst}
                    onChange={(e) =>
                      setForm({ ...form, gst: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PAN
                  </label>
                  <Input
                    value={form.pan}
                    onChange={(e) =>
                      setForm({ ...form, pan: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {editingId ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Customer List
              </h2>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, mobile or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No customers found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Name</th>
                      <th className="text-left py-2 px-3">Mobile</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">GST</th>
                      <th className="text-left py-2 px-3">PAN</th>
                      <th className="text-right py-2 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-2 px-3">{customer.name}</td>
                        <td className="py-2 px-3">{customer.mobile}</td>
                        <td className="py-2 px-3">{customer.email}</td>
                        <td className="py-2 px-3">{customer.gst}</td>
                        <td className="py-2 px-3">{customer.pan}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            className="inline-flex items-center p-1 text-blue-600 hover:bg-blue-50 rounded mr-1"
                            onClick={() => startEdit(customer.id)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="inline-flex items-center p-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => handleDelete(customer.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
