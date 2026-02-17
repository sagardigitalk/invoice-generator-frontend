import { RouterProvider } from 'react-router';
import { router } from './routes';
import { InvoiceProvider } from './store/InvoiceContext';
import { ConfigProvider } from './store/ConfigContext';
import { AuthProvider } from './store/AuthContext';
import { CustomerProvider } from './store/CustomerContext';

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <InvoiceProvider>
          <CustomerProvider>
            <RouterProvider router={router} />
          </CustomerProvider>
        </InvoiceProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}
