import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./routes/auth/Login.tsx";
import Register from "./routes/auth/Register.tsx";
import Home from "./routes/home/index.tsx";
import Reports from "./pages/Report/Reports.tsx";
import AddReport from "./pages/Report/AddReport.tsx";
import ViewReport from "./pages/Report/ViewReport.tsx";
import AccountManagement from "./pages/AccountManagement/AccountManagement.tsx";
import AddAccount from "./pages/AccountManagement/AddAccount.tsx";
import ViewAccount from "./pages/AccountManagement/ViewAccount.tsx";
import EditAccount from "./pages/AccountManagement/EditAccount.tsx";
import AgencyManagement from "./pages/AgencyManagement/AgencyManagement.tsx";
import AddAgency from "./pages/AgencyManagement/AddAgency.tsx";
import ViewAgency from "./pages/AgencyManagement/ViewAgency.tsx";
import EditAgency from "./pages/AgencyManagement/EditAgency.tsx";
import ProductManagement from './pages/ProductManagement/ProductManagement.tsx'
import AddProduct from './pages/ProductManagement/AddProduct.tsx'
import ViewProduct from './pages/ProductManagement/ViewProduct.tsx'
import EditProduct from './pages/ProductManagement/EditProduct.tsx'
import Regulations from "./pages/Regulations/Regulations.tsx";
import ViewRegulation from "./pages/Regulations/ViewRegulation.tsx";
import EditRegulation from "./pages/Regulations/EditRegulation.tsx";
import DeliveryManagement from './pages/DeliveryManagement/DeliveryManagement.tsx';
import AddDriver from './pages/DeliveryManagement/AddDriver.tsx';
import ViewDriver from './pages/DeliveryManagement/ViewDriver.tsx';
import EditDriver from './pages/DeliveryManagement/EditDriver.tsx';
import InventoryOverview from './pages/InventoryOverview/InventoryOverview.tsx'
import SupplierManagement from "./pages/SupplierManagement/SupplierManagement.tsx";
import AddSupplier from "./pages/SupplierManagement/AddSupplier.tsx";
import ViewSupplier from "./pages/SupplierManagement/ViewSupplier.tsx";
import EditSupplier from "./pages/SupplierManagement/EditSupplier.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import NotFound from "./routes/NotFound/NotFound.tsx";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          }
        />
        <Route
          path="/add-report"
          element={
            <MainLayout>
              <AddReport />
            </MainLayout>
          }
        />
        <Route
          path="/view-report/:reportId"
          element={
            <MainLayout>
              <ViewReport />
            </MainLayout>
          }
        />
        <Route
          path="/account-management"
          element={
            <MainLayout>
              <AccountManagement />
            </MainLayout>
          }
        />
        <Route
          path="/add-account"
          element={
            <MainLayout>
              <AddAccount />
            </MainLayout>
          }
        />
        <Route
          path="/view-account/:id"
          element={
            <MainLayout>
              <ViewAccount />
            </MainLayout>
          }
        />
        <Route
          path="/edit-account/:id"
          element={
            <MainLayout>
              <EditAccount />
            </MainLayout>
          }
        />
        <Route
          path="/agency-management"
          element={
            <MainLayout>
              <AgencyManagement />
            </MainLayout>
          }
        />
        <Route
          path="/add-agency"
          element={
            <MainLayout>
              <AddAgency />
            </MainLayout>
          }
        />
        <Route
          path="/view-agency/:id"
          element={
            <MainLayout>
              <ViewAgency />
            </MainLayout>
          }
        />
        <Route
          path="/edit-agency/:id"
          element={
            <MainLayout>
              <EditAgency />
            </MainLayout>
          }
        />
        <Route path="/product-management" element={<MainLayout><ProductManagement /></MainLayout>} />
        <Route path="/add-product" element={<MainLayout><AddProduct /></MainLayout>} />
        <Route path="/view-product/:id" element={<MainLayout><ViewProduct /></MainLayout>} />
        <Route path="/edit-product/:id" element={<MainLayout><EditProduct /></MainLayout>} />
        <Route
          path="/regulations"
          element={
            <MainLayout>
              <Regulations />
            </MainLayout>
          }
        />
        <Route
          path="/view-regulation/:id"
          element={
            <MainLayout>
              <ViewRegulation />
            </MainLayout>
          }
        />
        <Route
          path="/edit-regulation/:id"
          element={
            <MainLayout>
              <EditRegulation />
            </MainLayout>
          }
        />
        <Route
          path="/supplier-management"
          element={
            <MainLayout>
              <SupplierManagement />
            </MainLayout>
          }
        />
        <Route
          path="/add-supplier"
          element={
            <MainLayout>
              <AddSupplier />
            </MainLayout>
          }
        />
        <Route
          path="/view-supplier/:id"
          element={
            <MainLayout>
              <ViewSupplier />
            </MainLayout>
          }
        />
        <Route
          path="/edit-supplier/:id"
          element={
            <MainLayout>
              <EditSupplier />
            </MainLayout>
          }
        />
        <Route path="/delivery-management" element={<MainLayout><DeliveryManagement /></MainLayout>} />
        <Route path="/add-driver" element={<MainLayout><AddDriver /></MainLayout>} />
        <Route path="/view-driver/:id" element={<MainLayout><ViewDriver /></MainLayout>} />
        <Route path="/edit-driver/:id" element={<MainLayout><EditDriver /></MainLayout>} />
        <Route path="/inventory-overview" element={<MainLayout><InventoryOverview /></MainLayout>} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
