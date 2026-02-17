import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Printer, Edit, ArrowLeft, Palette, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useInvoices } from '../store/InvoiceContext';
import { useConfig } from '../store/ConfigContext';
import { useAuth } from '../store/AuthContext';
import { API_BASE_URL } from '../services/api';
import { ClassicTemplate } from '../components/templates/ClassicTemplate';
import { ModernTemplate } from '../components/templates/ModernTemplate';
import { MinimalTemplate } from '../components/templates/MinimalTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { ElegantTemplate } from '../components/templates/ElegantTemplate';
import { GstTemplate } from '../components/templates/GstTemplate';

export function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice } = useInvoices();
  const { config } = useConfig();
  const { token } = useAuth();
  
  const invoice = id ? getInvoice(id) : null;
  const printRef = useRef<HTMLDivElement | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<
    'classic' | 'modern' | 'minimal' | 'professional' | 'elegant' | 'gst'
  >(config.defaultTemplate);

  if (!invoice) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
          <Button onClick={() => navigate('/invoices')}>Back to Invoices</Button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!id || !token || !invoice) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/invoices/${id}/pdf?template=${selectedTemplate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.invoiceNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF', error);
    }
  };

  const templateOptions = [
    { value: 'classic', label: 'Classic' },
    { value: 'modern', label: 'Modern' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'professional', label: 'Professional' },
    { value: 'elegant', label: 'Elegant' },
    { value: 'gst', label: 'GST Form' },
  ] as const;

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate invoice={invoice} fieldConfig={config.fields} />;
      case 'minimal':
        return <MinimalTemplate invoice={invoice} fieldConfig={config.fields} />;
      case 'professional':
        return <ProfessionalTemplate invoice={invoice} fieldConfig={config.fields} />;
      case 'elegant':
        return <ElegantTemplate invoice={invoice} fieldConfig={config.fields} />;
      case 'gst':
        return <GstTemplate invoice={invoice} />;
      case 'classic':
      default:
        return <ClassicTemplate invoice={invoice} fieldConfig={config.fields} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Buttons - Hidden in Print */}
      <div className="print:hidden bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-3">
            {/* Template Selector */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <Palette className="w-4 h-4 text-gray-600" />
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer"
              >
                {templateOptions.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" onClick={() => navigate(`/invoices/edit/${id}`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleDownloadPdf}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center p-8 print:p-0 invoice-print-area">
        <div
          ref={printRef}
          className="invoice-container bg-white shadow-lg print:shadow-none"
        >
          {renderTemplate()}
        </div>
      </div>

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          body * {
            visibility: hidden;
          }

          .invoice-print-area,
          .invoice-print-area * {
            visibility: visible;
          }

          .invoice-print-area {
            position: absolute;
            inset: 0;
          }

          .invoice-container {
            width: 210mm;
            margin: 0 auto;
            box-shadow: none !important;
          }

          .invoice-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            margin: 0;
            box-sizing: border-box;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }

        @media screen {
          .invoice-container {
            width: 210mm;
          }

          .invoice-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
          }
        }
      `}</style>
    </div>
  );
}
