import React from 'react';
import { Invoice } from '../../store/InvoiceContext';
import { InvoiceFieldConfig } from '../../store/ConfigContext';
import { toWords } from 'number-to-words';

interface Props {
  invoice: Invoice;
  fieldConfig: InvoiceFieldConfig;
}

export function ClassicTemplate({ invoice, fieldConfig }: Props) {
  const amountInWords = invoice.grandTotal > 0 
    ? toWords(Math.floor(invoice.grandTotal))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Zero';

  const enabledFields = Object.entries(fieldConfig).filter(([_, config]) => config.enabled);

  return (
    <div className="invoice-page classic-template">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-3xl font-bold mb-2">{invoice.businessName}</h1>
        <p className="text-sm">{invoice.businessAddress}</p>
        {invoice.businessMobile && <p className="text-sm mt-1">Mobile: {invoice.businessMobile}</p>}
        <h2 className="text-2xl font-bold mt-3">INVOICE</h2>
      </div>

      {/* Customer and Invoice Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Left - Customer Details */}
        <div className="border border-black p-3">
          <p className="font-bold mb-2">TO:</p>
          <p className="font-medium">{invoice.customerName}</p>
          <p className="text-sm mt-1">{invoice.customerAddress}</p>
          {invoice.customerGST && (
            <p className="text-sm mt-2">
              <span className="font-bold">GST NO:</span> {invoice.customerGST}
            </p>
          )}
          {invoice.customerPAN && (
            <p className="text-sm">
              <span className="font-bold">PAN NO:</span> {invoice.customerPAN}
            </p>
          )}
        </div>

        {/* Right - Invoice Details */}
        <div className="border border-black p-3">
          <p className="text-sm mb-1">
            <span className="font-bold">Date:</span> {new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
          <p className="text-sm mb-1">
            <span className="font-bold">Bill No:</span> {invoice.invoiceNo}
          </p>
          <p className="text-sm">
            <span className="font-bold">POS:</span> {invoice.placeOfSupply}
          </p>
          {invoice.businessGST && (
            <p className="text-sm mt-2">
              <span className="font-bold">GST:</span> {invoice.businessGST}
            </p>
          )}
          {invoice.businessPAN && (
            <p className="text-sm">
              <span className="font-bold">PAN:</span> {invoice.businessPAN}
            </p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-4">
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              {enabledFields.map(([key, config]) => (
                <th
                  key={key}
                  className={`border border-black px-2 py-2 text-sm font-bold ${
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
              <tr key={index}>
                {enabledFields.map(([key]) => (
                  <td
                    key={key}
                    className={`border border-black px-2 py-2 text-sm ${
                      key === 'khataName' ? 'text-left' : key === 'total' ? 'text-right' : 'text-center'
                    }`}
                  >
                    {key === 'total' ? item[key as keyof typeof item].toFixed(2) : item[key as keyof typeof item]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={enabledFields.length - 1} className="border border-black px-2 py-2 text-sm font-bold text-right">
                TOTAL
              </td>
              <td className="border border-black px-2 py-2 text-sm font-bold text-right">
                {invoice.grandTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Left - Amount in Words */}
        <div className="border border-black p-3">
          <p className="text-sm">
            <span className="font-bold">Amount in Words:</span><br />
            {amountInWords} Rupees Only
          </p>
        </div>

        {/* Right - Bank Details */}
        <div className="border border-black p-3">
          <p className="font-bold text-sm mb-2">Bank Details:</p>
          <p className="text-sm">Bank: {invoice.bankName}</p>
          <p className="text-sm">Branch: {invoice.bankBranch}</p>
          <p className="text-sm">A/c No: {invoice.bankAccount}</p>
          <p className="text-sm">IFSC: {invoice.bankIFSC}</p>
        </div>
      </div>

      {/* Footer Notes */}
      {invoice.notes && (
        <div className="border-t border-black pt-3">
          <div className="text-sm whitespace-pre-line">{invoice.notes}</div>
        </div>
      )}

      {/* Signature */}
      <div className="flex justify-between items-end mt-8">
        <div>
          <p className="text-sm font-bold">Customer Signature</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold mb-8">For {invoice.businessName}</p>
          <p className="text-sm">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
}
