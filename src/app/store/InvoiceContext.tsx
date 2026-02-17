import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

export interface InvoiceItem {
  id: string;
  khataName: string;
  priceType: string;
  cut: string;
  nos: string;
  weight: string;
  price: string;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  placeOfSupply: string;
  businessName: string;
  businessAddress: string;
  businessGST: string;
  businessPAN: string;
  businessMobile: string;
  customerName: string;
  customerAddress: string;
  customerGST: string;
  customerPAN: string;
  items: InvoiceItem[];
  subtotal: number;
  grandTotal: number;
  bankName: string;
  bankBranch: string;
  bankAccount: string;
  bankIFSC: string;
  notes: string;
  status: 'Paid' | 'Pending' | 'Draft';
}

interface InvoiceContextType {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Invoice) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNo: '113/2026',
    date: '2026-01-18',
    placeOfSupply: 'Gujarat',
    businessName: 'MANOJ KAVAD',
    businessAddress: 'Plot No. 40/41, 3rd Floor, Vithal Nagar Soc., Motiyawadi, Varachha Road, Surat',
    businessGST: '',
    businessPAN: 'FHRPK3434H',
    businessMobile: '',
    customerName: 'Krishna Diamond',
    customerAddress: '1st and 2nd Floor, Plot No 69 to 71, Mohan Nagar, Varachha Road, Near Rajhans Heights, Varachha, Surat, Gujarat, 395006',
    customerGST: '',
    customerPAN: '',
    items: [
      {
        id: '1',
        khataName: 'Lab Grown Diamonds Job work',
        priceType: '',
        cut: '',
        nos: '185',
        weight: '121.7',
        price: '350',
        total: 42595
      }
    ],
    subtotal: 42595,
    grandTotal: 42595,
    bankName: 'The Varachha Co.Bank Ltd',
    bankBranch: 'Puna Gam Canal Road',
    bankAccount: '00710120471024',
    bankIFSC: 'VARA0289007',
    notes: 'Goods sold and Delivered at Hand To Hand\nSubject to Surat Jurisdiction',
    status: 'Paid'
  },
  {
    id: '2',
    invoiceNo: '106/26',
    date: '2026-01-10',
    placeOfSupply: 'Gujarat',
    businessName: 'MANOJ BHAI KAVAD',
    businessAddress: 'Plot No. 40/41, 3rd Floor, Vithal Nagar Soc., Motiyawadi, Varachha Road, Surat',
    businessGST: '',
    businessPAN: 'FHRPK3434H',
    businessMobile: '',
    customerName: 'SHREE MAHANT GEMS',
    customerAddress: 'PLOT NO 157, DIAMOND MENSION, 4TH FLOOR HALL NO 401, NANDU DOSHI NI WADI, GOTALAWADI KATARGAM, SURAT - 395004',
    customerGST: '24AEBFS9465G1ZS',
    customerPAN: '',
    items: [
      {
        id: '1',
        khataName: '18+ MANOJ BHAI KAVAD',
        priceType: 'PER CRT',
        cut: '0.18-0.99(PN/MQ/OV)',
        nos: '502',
        weight: '229.878',
        price: '800',
        total: 183902.4
      }
    ],
    subtotal: 183902.4,
    grandTotal: 183902.4,
    bankName: 'The Varachha Co. Bank Ltd',
    bankBranch: 'Pune Gram Canal Road',
    bankAccount: '00710120471024',
    bankIFSC: 'VARA0289007',
    notes: 'Goods sold and Delivered at Hand To Hand\nSubject to Surat Jurisdiction',
    status: 'Pending'
  },
  {
    id: '3',
    invoiceNo: '107/26',
    date: '2026-02-02',
    placeOfSupply: 'Gujarat',
    businessName: 'MANOJ BHAI KAVAD',
    businessAddress: 'Plot No. 40/41, 3rd Floor, Vithal Nagar Soc., Motiya wadi, Varachha Road, Surat',
    businessGST: '',
    businessPAN: 'FHRPK3434H',
    businessMobile: '',
    customerName: 'SHREE MAHANT GEMS',
    customerAddress: 'PLOT NO 157, DIAMOND MENSION, 4TH FLOOR HALL NO 401, NANDU DOSHI NI WADI, GOTALAWADI KATARGAM, SURAT - 395004',
    customerGST: '24AEBFS9465G1ZS',
    customerPAN: '',
    items: [
      {
        id: '1',
        khataName: '18+ MANOJ BHAI KAVAD',
        priceType: '',
        cut: '0.17-0.249',
        nos: '12',
        weight: '2.79',
        price: '190',
        total: 2280
      },
      {
        id: '2',
        khataName: '',
        priceType: '',
        cut: '0.76-1.259',
        nos: '27',
        weight: '23.55',
        price: '700',
        total: 16485
      },
      {
        id: '3',
        khataName: '',
        priceType: '',
        cut: '0.25-0.759',
        nos: '362',
        weight: '147.88',
        price: '800',
        total: 118304
      }
    ],
    subtotal: 137069,
    grandTotal: 137069,
    bankName: 'The Varachha Co. Bank Ltd',
    bankBranch: 'Pune Gram Canal Road',
    bankAccount: '00710120471024',
    bankIFSC: 'VARA0289007',
    notes: 'Goods sold and Delivered at Hand To Hand\nSubject to Surat Jurisdiction',
    status: 'Pending'
  }
];

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!token) {
      setInvoices([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.get<{ invoices: Invoice[] }>(
        '/invoices',
        token
      );
      setInvoices(data.invoices || []);
    } catch {
      setError('Failed to load invoices');
      setInvoices(sampleInvoices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refresh();
    } else {
      setInvoices([]);
    }
  }, [token]);

  const addInvoice = async (invoice: Invoice) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const data = await api.post<{ invoice: Invoice }>(
      '/invoices',
      invoice,
      token
    );
    const created: Invoice = data.invoice;
    setInvoices((current) => [...current, created]);
    return created;
  };

  const updateInvoice = async (id: string, updatedInvoice: Invoice) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const data = await api.put<{ invoice: Invoice }>(
      `/invoices/${id}`,
      updatedInvoice,
      token
    );
    const saved: Invoice = data.invoice;
    setInvoices((current) =>
      current.map((inv) => (inv.id === id ? saved : inv))
    );
    return saved;
  };

  const deleteInvoice = async (id: string) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    await api.delete<unknown>(`/invoices/${id}`, token);

    setInvoices((current) => current.filter((inv) => inv.id !== id));
  };

  const getInvoice = (id: string) => {
    return invoices.find(inv => inv.id === id);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        loading,
        error,
        refresh,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}
