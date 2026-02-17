import React from 'react';
import { Invoice } from '../../store/InvoiceContext';
import { InvoiceFieldConfig } from '../../store/ConfigContext';
import { toWords } from 'number-to-words';

interface Props {
  invoice: Invoice;
  fieldConfig: InvoiceFieldConfig;
}

export function MinimalTemplate({ invoice, fieldConfig }: Props) {
  const amountInWords = invoice.grandTotal > 0 
    ? toWords(Math.floor(invoice.grandTotal))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Zero';

  const enabledFields = Object.entries(fieldConfig).filter(([_, config]) => config.enabled);

  return (
    <div className="invoice-page minimal-template">
      {/* Minimal Header */}
      <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-4xl font-light mb-2">{invoice.businessName}</h1>
          <p className="text-sm text-gray-600">{invoice.businessAddress}</p>
          {invoice.businessMobile && <p className="text-sm text-gray-600">{invoice.businessMobile}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-light text-gray-400">INVOICE</h2>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Bill To</p>
          <p className="font-medium">{invoice.customerName}</p>
          <p className="text-sm text-gray-600 mt-1">{invoice.customerAddress}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Invoice Details</p>
          <p className="text-sm"><span className="text-gray-600">Number:</span> {invoice.invoiceNo}</p>
          <p className="text-sm"><span className="text-gray-600">Date:</span> {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
          <p className="text-sm"><span className="text-gray-600">Place:</span> {invoice.placeOfSupply}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Tax Information</p>
          {invoice.customerGST && <p className="text-sm"><span className="text-gray-600">GST:</span> {invoice.customerGST}</p>}
          {invoice.customerPAN && <p className="text-sm"><span className="text-gray-600">PAN:</span> {invoice.customerPAN}</p>}
        </div>
      </div>

      {/* Items Table - Minimal Style */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-900">
              {enabledFields.map(([key, config]) => (
                <th
                  key={key}
                  className={`pb-3 text-xs uppercase tracking-wider text-gray-600 font-medium ${
                    key === 'khataName' ? 'text-left' : key === 'total' ? 'text-right' : 'text-center'
                  }`}
                >
                  {config.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                {enabledFields.map(([key]) => (
                  <td
                    key={key}
                    className={`py-4 text-sm ${
                      key === 'khataName' ? 'text-left font-medium' : key === 'total' ? 'text-right font-medium' : 'text-center text-gray-600'
                    }`}
                  >
                    {key === 'total' ? item[key as keyof typeof item].toFixed(2) : item[key as keyof typeof item]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Section - Right Aligned */}
      <div className="flex justify-end mb-8">
        <div className="w-96">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-900">
              <span className="text-lg font-medium">Total</span>
              <span className="text-2xl font-bold">₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
            <div className="pt-2 text-sm text-gray-600">
              {amountInWords} Rupees Only
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details - Minimal */}
      <div className="bg-gray-50 -mx-6 px-6 py-4 mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Payment Details</p>
        <div className="grid grid-cols-2 gap-x-8 text-sm">
          <p><span className="text-gray-600">Bank:</span> {invoice.bankName}</p>
          <p><span className="text-gray-600">Account:</span> {invoice.bankAccount}</p>
          <p><span className="text-gray-600">Branch:</span> {invoice.bankBranch}</p>
          <p><span className="text-gray-600">IFSC:</span> {invoice.bankIFSC}</p>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Terms & Conditions</p>
          <div className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end mt-12 pt-8 border-t border-gray-200">
        <div className="text-right">
          <div className="border-t border-gray-400 pt-2 mt-12 w-48">
            <p className="text-sm text-gray-600">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
