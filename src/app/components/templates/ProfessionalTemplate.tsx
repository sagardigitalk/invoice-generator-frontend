import React from 'react';
import { Invoice } from '../../store/InvoiceContext';
import { InvoiceFieldConfig } from '../../store/ConfigContext';
import { toWords } from 'number-to-words';

interface Props {
  invoice: Invoice;
  fieldConfig: InvoiceFieldConfig;
}

export function ProfessionalTemplate({ invoice, fieldConfig }: Props) {
  const amountInWords = invoice.grandTotal > 0 
    ? toWords(Math.floor(invoice.grandTotal))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Zero';

  const enabledFields = Object.entries(fieldConfig).filter(([_, config]) => config.enabled);

  return (
    <div className="invoice-page professional-template border-4 border-gray-800">
      {/* Professional Header with Logo Area */}
      <div className="border-b-4 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="w-2/3">
            <div className="bg-gray-800 text-white px-4 py-2 inline-block mb-3">
              <h1 className="text-2xl font-bold">{invoice.businessName}</h1>
            </div>
            <p className="text-sm text-gray-700 ml-1">{invoice.businessAddress}</p>
            {invoice.businessMobile && (
              <p className="text-sm text-gray-700 ml-1 mt-1">
                <span className="font-semibold">Phone:</span> {invoice.businessMobile}
              </p>
            )}
            <div className="flex gap-4 ml-1 mt-2 text-xs">
              {invoice.businessGST && (
                <span><span className="font-semibold">GST:</span> {invoice.businessGST}</span>
              )}
              {invoice.businessPAN && (
                <span><span className="font-semibold">PAN:</span> {invoice.businessPAN}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gray-800 text-white px-6 py-3">
              <h2 className="text-2xl font-bold">TAX INVOICE</h2>
            </div>
            <div className="mt-3 text-sm">
              <p className="font-bold text-lg">#{invoice.invoiceNo}</p>
              <p className="text-gray-600 mt-1">{new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Info Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border-2 border-gray-300 p-4">
          <div className="bg-gray-800 text-white px-3 py-1 -mt-4 -ml-4 -mr-4 mb-3">
            <p className="text-xs font-bold uppercase">Bill To</p>
          </div>
          <p className="font-bold text-lg mb-1">{invoice.customerName}</p>
          <p className="text-sm text-gray-700">{invoice.customerAddress}</p>
          <div className="mt-3 text-xs space-y-1">
            {invoice.customerGST && (
              <p><span className="font-semibold">GST No:</span> {invoice.customerGST}</p>
            )}
            {invoice.customerPAN && (
              <p><span className="font-semibold">PAN No:</span> {invoice.customerPAN}</p>
            )}
          </div>
        </div>
        <div className="border-2 border-gray-300 p-4">
          <div className="bg-gray-800 text-white px-3 py-1 -mt-4 -ml-4 -mr-4 mb-3">
            <p className="text-xs font-bold uppercase">Invoice Information</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Invoice Number:</span>
              <span className="font-bold">{invoice.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Invoice Date:</span>
              <span>{new Date(invoice.date).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Place of Supply:</span>
              <span>{invoice.placeOfSupply}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 border-2 border-gray-300">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              {enabledFields.map(([key, config]) => (
                <th
                  key={key}
                  className={`px-3 py-3 text-xs font-bold uppercase ${
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
              <tr key={index} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                {enabledFields.map(([key]) => (
                  <td
                    key={key}
                    className={`px-3 py-3 text-sm ${
                      key === 'khataName' ? 'text-left font-medium' : key === 'total' ? 'text-right font-bold' : 'text-center'
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

      {/* Summary Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border-2 border-gray-300 p-4">
          <div className="bg-gray-800 text-white px-3 py-1 -mt-4 -ml-4 -mr-4 mb-3">
            <p className="text-xs font-bold uppercase">Payment Details</p>
          </div>
          <div className="text-sm space-y-1">
            <p><span className="font-semibold">Bank Name:</span> {invoice.bankName}</p>
            <p><span className="font-semibold">Branch:</span> {invoice.bankBranch}</p>
            <p><span className="font-semibold">Account No:</span> {invoice.bankAccount}</p>
            <p><span className="font-semibold">IFSC Code:</span> {invoice.bankIFSC}</p>
          </div>
        </div>
        <div>
          <div className="border-2 border-gray-300 p-4 mb-3">
            <div className="flex justify-between mb-2 pb-2 border-b border-gray-300">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-bold">₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-bold">TOTAL AMOUNT:</span>
              <span className="text-xl font-bold">₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-gray-100 border-2 border-gray-300 p-3">
            <p className="text-xs font-semibold uppercase mb-1">Amount in Words</p>
            <p className="text-sm font-medium">{amountInWords} Rupees Only</p>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      {invoice.notes && (
        <div className="border-2 border-gray-300 p-4 mb-6">
          <div className="bg-gray-800 text-white px-3 py-1 -mt-4 -ml-4 -mr-4 mb-3">
            <p className="text-xs font-bold uppercase">Terms & Conditions</p>
          </div>
          <div className="text-xs text-gray-700 whitespace-pre-line">{invoice.notes}</div>
        </div>
      )}

      {/* Footer with Signature */}
      <div className="flex justify-between items-end pt-6 border-t-2 border-gray-800">
        <div className="text-sm text-gray-600">
          <p className="font-semibold">Thank you for your business!</p>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-800 pt-2 w-48">
            <p className="text-sm font-bold">{invoice.businessName}</p>
            <p className="text-xs text-gray-600 mt-1">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
