import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

export interface Customer {
  id: string;
  name: string;
  address: string;
  gst: string;
  pan: string;
  mobile: string;
  email: string;
}

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createCustomer: (data: Omit<Customer, 'id'>) => Promise<Customer>;
  updateCustomer: (id: string, data: Omit<Customer, 'id'>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!token) {
      setCustomers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.get<{ customers: Customer[] }>(
        '/customers',
        token
      );
      setCustomers(data.customers || []);
    } catch {
      setError('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refresh();
    } else {
      setCustomers([]);
    }
  }, [token]);

  const createCustomer = async (data: Omit<Customer, 'id'>) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const json = await api.post<{ customer: Customer }>(
      '/customers',
      data,
      token
    );
    const created: Customer = json.customer;
    setCustomers((current) => [...current, created]);
    return created;
  };

  const updateCustomer = async (id: string, data: Omit<Customer, 'id'>) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const json = await api.put<{ customer: Customer }>(
      `/customers/${id}`,
      data,
      token
    );
    const saved: Customer = json.customer;
    setCustomers((current) =>
      current.map((customer) => (customer.id === id ? saved : customer))
    );
    return saved;
  };

  const deleteCustomer = async (id: string) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    await api.delete<unknown>(`/customers/${id}`, token);

    setCustomers((current) => current.filter((customer) => customer.id !== id));
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        error,
        refresh,
        createCustomer,
        updateCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}
