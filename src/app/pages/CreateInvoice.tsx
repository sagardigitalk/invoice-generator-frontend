import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Plus, Trash2, Save, Printer, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useInvoices, Invoice, InvoiceItem } from '../store/InvoiceContext';
import { useConfig } from '../store/ConfigContext';
import { toWords } from 'number-to-words';

export function CreateInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addInvoice, updateInvoice, getInvoice, invoices } = useInvoices();
  const { config } = useConfig();
  
  const isEdit = !!id;
  const existingInvoice = isEdit ? getInvoice(id) : null;

  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'subtotal' | 'grandTotal'>>({
    invoiceNo: existingInvoice?.invoiceNo || `${invoices.length + 1}/2026`,
    date: existingInvoice?.date || new Date().toISOString().split('T')[0],
    placeOfSupply:
      existingInvoice?.placeOfSupply || config.invoiceDefaults.defaultPlaceOfSupply,
    businessName: existingInvoice?.businessName || config.business.name,
    businessAddress: existingInvoice?.businessAddress || config.business.address,
    businessGST: existingInvoice?.businessGST || config.business.gst,
    businessPAN: existingInvoice?.businessPAN || config.business.pan,
    businessMobile: existingInvoice?.businessMobile || config.business.mobile,
    customerName: existingInvoice?.customerName || '',
    customerAddress: existingInvoice?.customerAddress || '',
    customerGST: existingInvoice?.customerGST || '',
    customerPAN: existingInvoice?.customerPAN || '',
    items: existingInvoice?.items || [],
    bankName: existingInvoice?.bankName || config.bank.bankName,
    bankBranch: existingInvoice?.bankBranch || config.bank.branch,
    bankAccount: existingInvoice?.bankAccount || config.bank.accountNumber,
    bankIFSC: existingInvoice?.bankIFSC || config.bank.ifsc,
    notes:
      existingInvoice?.notes || config.invoiceDefaults.defaultNotes,
    status: existingInvoice?.status || 'Draft',
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    existingInvoice?.items || [
      {
        id: '1',
        khataName: '',
        priceType: '',
        cut: '',
        nos: '',
        weight: '',
        price: '',
        total: 0,
      },
    ]
  );

  useEffect(() => {
    if (existingInvoice) {
      setItems(existingInvoice.items);
    }
  }, [existingInvoice]);

  const calculateItemTotal = (item: InvoiceItem): number => {
    const weight = parseFloat(item.weight) || 0;
    const price = parseFloat(item.price) || 0;
    return weight * price;
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    return {
      subtotal,
      grandTotal: subtotal,
    };
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate total when weight or price changes
    if (field === 'weight' || field === 'price') {
      newItems[index].total = calculateItemTotal(newItems[index]);
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        khataName: '',
        priceType: '',
        cut: '',
        nos: '',
        weight: '',
        price: '',
        total: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async (status: 'Draft' | 'Paid' | 'Pending' = 'Draft') => {
    const { subtotal, grandTotal } = calculateTotals();
    
    const invoice: Invoice = {
      id: isEdit ? id : Date.now().toString(),
      ...formData,
      items,
      subtotal,
      grandTotal,
      status,
    };

    if (isEdit && id) {
      await updateInvoice(id, invoice);
    } else {
      await addInvoice(invoice);
    }

    navigate('/invoices');
  };

  const handleSaveAndPrint = async () => {
    const { subtotal, grandTotal } = calculateTotals();
    
    const invoice: Invoice = {
      id: isEdit ? id : Date.now().toString(),
      ...formData,
      items,
      subtotal,
      grandTotal,
      status: 'Pending',
    };

    if (isEdit && id) {
      await updateInvoice(id, invoice);
    } else {
      const created = await addInvoice(invoice);
      invoice.id = created.id;
    }

    navigate(`/invoices/view/${invoice.id}`);
  };

  const { subtotal, grandTotal } = calculateTotals();
  
  const amountInWords = grandTotal > 0 
    ? toWords(Math.floor(grandTotal))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Zero';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
        </h1>
        <p className="text-gray-600">Fill in the details below to {isEdit ? 'update' : 'create'} an invoice</p>
      </div>

      <div className="space-y-6">
        {/* Business Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="businessMobile">Mobile No</Label>
              <Input
                id="businessMobile"
                value={formData.businessMobile}
                onChange={(e) => handleInputChange('businessMobile', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="businessAddress">Address</Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="businessGST">GST No</Label>
              <Input
                id="businessGST"
                value={formData.businessGST}
                onChange={(e) => handleInputChange('businessGST', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="businessPAN">PAN No</Label>
              <Input
                id="businessPAN"
                value={formData.businessPAN}
                onChange={(e) => handleInputChange('businessPAN', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Customer Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="customerAddress">Address</Label>
              <Textarea
                id="customerAddress"
                value={formData.customerAddress}
                onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="customerGST">GST No</Label>
              <Input
                id="customerGST"
                value={formData.customerGST}
                onChange={(e) => handleInputChange('customerGST', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customerPAN">PAN No</Label>
              <Input
                id="customerPAN"
                value={formData.customerPAN}
                onChange={(e) => handleInputChange('customerPAN', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Invoice Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invoice Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNo">Invoice No</Label>
              <Input
                id="invoiceNo"
                value={formData.invoiceNo}
                onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="placeOfSupply">Place of Supply</Label>
              <Input
                id="placeOfSupply"
                value={formData.placeOfSupply}
                onChange={(e) => handleInputChange('placeOfSupply', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Items Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Items</h2>
            <Button onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {config.fields.khataName.enabled && (
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-600">
                      {config.fields.khataName.label}
                    </th>
                  )}
                  {config.fields.priceType.enabled && (
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-600">
                      {config.fields.priceType.label}
                    </th>
                  )}
                  {config.fields.cut.enabled && (
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-600">
                      {config.fields.cut.label}
                    </th>
                  )}
                  {config.fields.nos.enabled && (
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-600">
                      {config.fields.nos.label}
                    </th>
                  )}
                  {config.fields.weight.enabled && (
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-600">
                      {config.fields.weight.label}
                    </th>
                  )}
                  {config.fields.price.enabled && (
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-600">
                      {config.fields.price.label}
                    </th>
                  )}
                  {config.fields.total.enabled && (
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-600">
                      {config.fields.total.label}
                    </th>
                  )}
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    {config.fields.khataName.enabled && (
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={item.khataName}
                          onChange={(e) => handleItemChange(index, 'khataName', e.target.value)}
                          className="min-w-[150px]"
                          placeholder={config.fields.khataName.label}
                        />
                      </td>
                    )}
                    {config.fields.priceType.enabled && (
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={item.priceType}
                          onChange={(e) => handleItemChange(index, 'priceType', e.target.value)}
                          className="min-w-[120px]"
                          placeholder={config.fields.priceType.label}
                        />
                      </td>
                    )}
                    {config.fields.cut.enabled && (
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={item.cut}
                          onChange={(e) => handleItemChange(index, 'cut', e.target.value)}
                          className="min-w-[120px]"
                          placeholder={config.fields.cut.label}
                        />
                      </td>
                    )}
                    {config.fields.nos.enabled && (
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={item.nos}
                          onChange={(e) => handleItemChange(index, 'nos', e.target.value)}
                          className="min-w-[80px]"
                          placeholder={config.fields.nos.label}
                        />
                      </td>
                    )}
                    {config.fields.weight.enabled && (
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.weight}
                          onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                          className="min-w-[100px]"
                          placeholder={config.fields.weight.label}
                        />
                      </td>
                    )}
                    {config.fields.price.enabled && (
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          className="min-w-[100px]"
                          placeholder={config.fields.price.label}
                        />
                      </td>
                    )}
                    {config.fields.total.enabled && (
                      <td className="border border-gray-300 p-2 text-right font-medium">
                        {item.total.toFixed(2)}
                      </td>
                    )}
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-full md:w-1/3 space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span className="font-bold text-gray-900">
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-900">
                <span className="font-bold text-gray-900">Grand Total:</span>
                <span className="font-bold text-gray-900 text-xl">
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600">Amount in Words:</p>
                <p className="font-medium text-gray-900">{amountInWords} Rupees Only</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Bank Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bankBranch">Branch</Label>
              <Input
                id="bankBranch"
                value={formData.bankBranch}
                onChange={(e) => handleInputChange('bankBranch', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bankAccount">Account No</Label>
              <Input
                id="bankAccount"
                value={formData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bankIFSC">IFSC Code</Label>
              <Input
                id="bankIFSC"
                value={formData.bankIFSC}
                onChange={(e) => handleInputChange('bankIFSC', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            placeholder="Add any additional notes or terms..."
          />
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pb-8">
          <Button variant="outline" onClick={() => navigate('/invoices')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave('Draft')}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSaveAndPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Save & Print
          </Button>
        </div>
      </div>
    </div>
  );
}
