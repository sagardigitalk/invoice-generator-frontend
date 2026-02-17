import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { InvoiceList } from "./pages/InvoiceList";
import { CreateInvoice } from "./pages/CreateInvoice";
import { InvoiceView } from "./pages/InvoiceView";
import { Customers } from "./pages/Customers";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { useAuth } from "./store/AuthContext";

function ProtectedApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: ProtectedApp,
    children: [
      { index: true, Component: Dashboard },
      { path: "invoices", Component: InvoiceList },
      { path: "invoices/create", Component: CreateInvoice },
      { path: "invoices/edit/:id", Component: CreateInvoice },
      { path: "invoices/view/:id", Component: InvoiceView },
      { path: "customers", Component: Customers },
      { path: "settings", Component: Settings },
    ],
  },
]);
