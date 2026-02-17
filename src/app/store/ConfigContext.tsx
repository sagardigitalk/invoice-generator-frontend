import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

export interface InvoiceFieldConfig {
  khataName: { enabled: boolean; label: string };
  priceType: { enabled: boolean; label: string };
  cut: { enabled: boolean; label: string };
  nos: { enabled: boolean; label: string };
  weight: { enabled: boolean; label: string };
  price: { enabled: boolean; label: string };
  total: { enabled: boolean; label: string };
}

export interface BusinessConfig {
  name: string;
  address: string;
  gst: string;
  pan: string;
  mobile: string;
  email: string;
}

export interface BankConfig {
  bankName: string;
  branch: string;
  accountNumber: string;
  ifsc: string;
}

export interface InvoiceDefaultsConfig {
  invoicePrefix: string;
  defaultNotes: string;
  defaultPlaceOfSupply: string;
}

export interface InvoiceConfig {
  fields: InvoiceFieldConfig;
  defaultTemplate:
    | 'classic'
    | 'modern'
    | 'minimal'
    | 'professional'
    | 'elegant'
    | 'gst';
  business: BusinessConfig;
  bank: BankConfig;
  invoiceDefaults: InvoiceDefaultsConfig;
}

interface ConfigContextType {
  config: InvoiceConfig;
  loading: boolean;
  error: string | null;
  updateFieldConfig: (
    field: keyof InvoiceFieldConfig,
    enabled: boolean,
    label?: string
  ) => Promise<void>;
  setDefaultTemplate: (
    template:
      | 'classic'
      | 'modern'
      | 'minimal'
      | 'professional'
      | 'elegant'
      | 'gst'
  ) => Promise<void>;
  updateBusiness: (changes: Partial<BusinessConfig>) => Promise<void>;
  updateBank: (changes: Partial<BankConfig>) => Promise<void>;
  updateInvoiceDefaults: (
    changes: Partial<InvoiceDefaultsConfig>
  ) => Promise<void>;
  resetToDefault: () => Promise<void>;
}

const defaultConfig: InvoiceConfig = {
  fields: {
    khataName: { enabled: true, label: 'Khata Name' },
    priceType: { enabled: true, label: 'Price Type' },
    cut: { enabled: true, label: 'Cut' },
    nos: { enabled: true, label: 'Nos' },
    weight: { enabled: true, label: 'Weight' },
    price: { enabled: true, label: 'Price' },
    total: { enabled: true, label: 'Total' },
  },
  defaultTemplate: 'classic',
  business: {
    name: 'MANOJ BHAI KAVAD',
    address:
      'Plot No. 40/41, 3rd Floor, Vithal Nagar Soc., Motiyawadi, Varachha Road, Surat',
    gst: '',
    pan: 'FHRPK3434H',
    mobile: '',
    email: '',
  },
  bank: {
    bankName: 'The Varachha Co. Bank Ltd',
    branch: 'Pune Gram Canal Road',
    accountNumber: '00710120471024',
    ifsc: 'VARA0289007',
  },
  invoiceDefaults: {
    invoicePrefix: 'INV-',
    defaultNotes:
      'Goods sold and Delivered at Hand To Hand\nSubject to Surat Jurisdiction',
    defaultPlaceOfSupply: 'Gujarat',
  },
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [config, setConfig] = useState<InvoiceConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setConfig(defaultConfig);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await api.get<{ settings?: Partial<InvoiceConfig> }>(
          '/settings',
          token
        );
        setConfig({
          ...defaultConfig,
          ...(data.settings || {}),
        });
      } catch {
        setError('Failed to load settings');
        setConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const save = async (next: InvoiceConfig) => {
    setConfig(next);

    if (!token) {
      return;
    }

    try {
      await api.put<unknown>('/settings', next, token);
    } catch {
      setError('Failed to save settings');
    }
  };

  const updateFieldConfig = async (
    field: keyof InvoiceFieldConfig,
    enabled: boolean,
    label?: string
  ) => {
    const next: InvoiceConfig = {
      ...config,
      fields: {
        ...config.fields,
        [field]: {
          enabled,
          label: label || config.fields[field].label,
        },
      },
    };
    await save(next);
  };

  const setDefaultTemplate = async (
    template:
      | 'classic'
      | 'modern'
      | 'minimal'
      | 'professional'
      | 'elegant'
      | 'gst'
  ) => {
    const next: InvoiceConfig = { ...config, defaultTemplate: template };
    await save(next);
  };

  const updateBusiness = async (changes: Partial<BusinessConfig>) => {
    const next: InvoiceConfig = {
      ...config,
      business: {
        ...config.business,
        ...changes,
      },
    };
    await save(next);
  };

  const updateBank = async (changes: Partial<BankConfig>) => {
    const next: InvoiceConfig = {
      ...config,
      bank: {
        ...config.bank,
        ...changes,
      },
    };
    await save(next);
  };

  const updateInvoiceDefaults = async (
    changes: Partial<InvoiceDefaultsConfig>
  ) => {
    const next: InvoiceConfig = {
      ...config,
      invoiceDefaults: {
        ...config.invoiceDefaults,
        ...changes,
      },
    };
    await save(next);
  };

  const resetToDefault = async () => {
    await save(defaultConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        loading,
        error,
        updateFieldConfig,
        setDefaultTemplate,
        updateBusiness,
        updateBank,
        updateInvoiceDefaults,
        resetToDefault,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
