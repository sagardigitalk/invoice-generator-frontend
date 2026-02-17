import React from 'react';
import { Invoice } from '../../store/InvoiceContext';
import { InvoiceFieldConfig } from '../../store/ConfigContext';
import { toWords } from 'number-to-words';

interface Props {
  invoice: Invoice;
  fieldConfig: InvoiceFieldConfig;
}

export function ElegantTemplate({ invoice, fieldConfig }: Props) {
  const amountInWords =
    invoice.grandTotal > 0
      ? toWords(Math.floor(invoice.grandTotal))
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : 'Zero';

  const enabledFields = Object.entries(fieldConfig).filter(
    ([, config]) => config.enabled
  );

  return (
    <div className="invoice-page minimal-template">
      <div className="border-b border-gray-300 pb-4 mb-4 flex justify-between items-start">
        <div>
          <p className="text-xs tracking-widest text-gray-500 mb-1">
            INVOICE
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {invoice.businessName}
          </h1>
          <p className="text-xs text-gray-600 mt-1">{invoice.businessAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Invoice No</p>
          <p className="text-sm font-semibold text-gray-900">
            {invoice.invoiceNo}
          </p>
          <p className="text-xs text-gray-500 mt-2">Date</p>
          <p className="text-sm text-gray-900">
            {invoice.date}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">
            BILL TO
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {invoice.customerName}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {invoice.customerAddress}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">
            PLACE OF SUPPLY
          </p>
          <p className="text-sm text-gray-900">
            {invoice.placeOfSupply}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {enabledFields.map(([key, config]) => (
                <th
                  key={key}
                  className={`px-3 py-2 text-xs font-semibold text-gray-500 ${
                    key === 'khataName'
                      ? 'text-left'
                      : key === 'total'
                      ? 'text-right'
                      : 'text-center'
                  }`}
                >
                  {config.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                {enabledFields.map(([key]) => (
                  <td
                    key={key}
                    className={`px-3 py-2 text-xs text-gray-800 ${
                      key === 'khataName'
                        ? 'text-left'
                        : key === 'total'
                        ? 'text-right'
                        : 'text-center'
                    }`}
                  >
                    {key === 'total'
                      ? item[key as keyof typeof item].toFixed(2)
                      : item[key as keyof typeof item]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500">
            AMOUNT IN WORDS
          </p>
          <p className="text-xs text-gray-800">
            {amountInWords} Rupees Only
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs font-semibold text-gray-500">
            GRAND TOTAL
          </p>
          <p className="text-lg font-semibold text-gray-900">
            ₹
            {invoice.grandTotal.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

