import React from 'react';
import { Invoice } from '../../store/InvoiceContext';
import { InvoiceFieldConfig } from '../../store/ConfigContext';
import { toWords } from 'number-to-words';

interface Props {
  invoice: Invoice;
  fieldConfig: InvoiceFieldConfig;
}

export function ModernTemplate({ invoice, fieldConfig }: Props) {
  const amountInWords = invoice.grandTotal > 0 
    ? toWords(Math.floor(invoice.grandTotal))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Zero';

  const enabledFields = Object.entries(fieldConfig).filter(([_, config]) => config.enabled);

  return (
    <div className="invoice-page modern-template">
      {/* Modern Header with Blue Accent */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 -m-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{invoice.businessName}</h1>
            <p className="text-sm opacity-90">{invoice.businessAddress}</p>
            {invoice.businessMobile && <p className="text-sm opacity-90 mt-1">Tel: {invoice.businessMobile}</p>}
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-sm mt-1">#{invoice.invoiceNo}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Bill To */}
        <div>
          <div className="bg-gray-100 px-3 py-2 font-bold text-sm mb-2">BILL TO</div>
          <div className="px-3">
            <p className="font-bold text-lg">{invoice.customerName}</p>
            <p className="text-sm text-gray-600 mt-1">{invoice.customerAddress}</p>
            {invoice.customerGST && (
              <p className="text-sm mt-2">
                <span className="font-semibold">GST:</span> {invoice.customerGST}
              </p>
            )}
            {invoice.customerPAN && (
              <p className="text-sm">
                <span className="font-semibold">PAN:</span> {invoice.customerPAN}
              </p>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div>
          <div className="bg-gray-100 px-3 py-2 font-bold text-sm mb-2">INVOICE DETAILS</div>
          <div className="px-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Date:</span>
              <span>{new Date(invoice.date).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Invoice No:</span>
              <span>{invoice.invoiceNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Place of Supply:</span>
              <span>{invoice.placeOfSupply}</span>
            </div>
            {invoice.businessGST && (
              <div className="flex justify-between text-sm">
                <span className="font-semibold">GST:</span>
                <span>{invoice.businessGST}</span>
              </div>
            )}
            {invoice.businessPAN && (
              <div className="flex justify-between text-sm">
                <span className="font-semibold">PAN:</span>
                <span>{invoice.businessPAN}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              {enabledFields.map(([key, config]) => (
                <th
                  key={key}
                  className={`px-3 py-3 text-sm font-bold ${
                    key === 'khataName' ? 'text-left' : key === 'total' ? 'text-right' : 'text-center'
                  }`}
                >
                  {config.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {enabledFields.map(([key]) => (
                  <td
                    key={key}
                    className={`px-3 py-3 text-sm border-b border-gray-200 ${
                      key === 'khataName' ? 'text-left' : key === 'total' ? 'text-right font-medium' : 'text-center'
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

      {/* Total Section */}
      <div className="flex justify-end mb-6">
        <div className="w-80">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-300">
              <span className="font-semibold">Subtotal:</span>
              <span>₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>TOTAL:</span>
              <span className="text-blue-600">₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="font-semibold">Amount in Words:</span>
            <p className="text-gray-700 mt-1">{amountInWords} Rupees Only</p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="font-bold text-sm mb-2 text-blue-900">BANK DETAILS</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          <div><span className="font-semibold">Bank:</span> {invoice.bankName}</div>
          <div><span className="font-semibold">Branch:</span> {invoice.bankBranch}</div>
          <div><span className="font-semibold">Account No:</span> {invoice.bankAccount}</div>
          <div><span className="font-semibold">IFSC Code:</span> {invoice.bankIFSC}</div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="font-bold text-sm mb-2">NOTES</p>
          <div className="text-sm text-gray-700 whitespace-pre-line">{invoice.notes}</div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-end mt-8 pt-4 border-t-2 border-gray-200">
        <div className="text-sm text-gray-600">
          Thank you for your business!
        </div>
        <div className="text-right">
          <p className="text-sm font-bold mb-8">For {invoice.businessName}</p>
          <p className="text-sm text-gray-600">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
}
