import React from 'react';
import { Invoice } from '../../store/InvoiceContext';
import { toWords } from 'number-to-words';

interface Props {
  invoice: Invoice;
}

export function GstTemplate({ invoice }: Props) {
  const amountInWords =
    invoice.grandTotal > 0
      ? toWords(Math.floor(invoice.grandTotal))
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : 'Zero';

  return (
    <div className="invoice-page classic-template">
      <div className="border-b border-black pb-2 mb-2 flex justify-between items-start">
        <div>
          <p className="text-[10px]">PAN: {invoice.businessPAN || '________________'}</p>
          <p className="text-[10px]">GSTIN: {invoice.businessGST || '________________'}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs font-semibold tracking-wide mb-1">TAX INVOICE</p>
          <h1 className="text-2xl font-bold leading-tight">{invoice.businessName}</h1>
          <p className="text-[11px] mt-1">{invoice.businessAddress}</p>
        </div>
        <div className="w-32" />
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
        <div className="border border-black p-2">
          <p className="font-semibold">Details of Receiver (Billed to)</p>
          <p className="mt-1">Name: {invoice.customerName}</p>
          <p className="mt-1 leading-snug">
            Address: {invoice.customerAddress || '______________________________'}
          </p>
          <p className="mt-1">GSTIN: {invoice.customerGST || '________________'}</p>
          <p className="mt-1">PAN/AADHAR No: {invoice.customerPAN || '________________'}</p>
        </div>
        <div className="border border-black p-2">
          <p className="font-semibold">Invoice Details</p>
          <p className="mt-1">Invoice No: {invoice.invoiceNo}</p>
          <p className="mt-1">
            Invoice Date:{' '}
            {new Date(invoice.date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
          <p className="mt-1">Place of Supply: {invoice.placeOfSupply}</p>
        </div>
      </div>

      <table className="w-full border-collapse text-[10px] mb-2">
        <thead>
          <tr>
            <th className="border border-black px-1 py-1 w-8">S. No.</th>
            <th className="border border-black px-1 py-1 w-40 text-left">
              Description of Goods
            </th>
            <th className="border border-black px-1 py-1 w-20">Cut</th>
            <th className="border border-black px-1 py-1 w-16">Qty</th>
            <th className="border border-black px-1 py-1 w-16">Weight</th>
            <th className="border border-black px-1 py-1 w-20">Rate</th>
            <th className="border border-black px-1 py-1 w-24 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.id || index}>
              <td className="border border-black px-1 py-1 text-center">
                {index + 1}
              </td>
              <td className="border border-black px-1 py-1 text-left">
                {item.khataName}
              </td>
              <td className="border border-black px-1 py-1 text-center">
                {item.cut}
              </td>
              <td className="border border-black px-1 py-1 text-center">
                {item.nos}
              </td>
              <td className="border border-black px-1 py-1 text-center">
                {item.weight}
              </td>
              <td className="border border-black px-1 py-1 text-center">
                {item.price}
              </td>
              <td className="border border-black px-1 py-1 text-right">
                {item.total.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td
              className="border border-black px-1 py-1 text-right font-semibold"
              colSpan={6}
            >
              Total
            </td>
            <td className="border border-black px-1 py-1 text-right font-semibold">
              {invoice.grandTotal.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="border border-black p-2 text-[10px] mb-2">
        <p>
          Invoice Value (In Words): {amountInWords} Rupees Only
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="border border-black p-2">
          <p>Bank: {invoice.bankName}</p>
          <p>Branch: {invoice.bankBranch}</p>
          <p>Account No: {invoice.bankAccount}</p>
          <p>IFSC: {invoice.bankIFSC}</p>
        </div>
        <div className="border border-black p-2 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-right">For {invoice.businessName}</p>
          </div>
          <p className="mt-6 text-right">Authorised Signatory</p>
        </div>
      </div>

      {invoice.notes && (
        <div className="border-t border-black mt-3 pt-2 text-[9px] whitespace-pre-line">
          {invoice.notes}
        </div>
      )}
    </div>
  );
}

