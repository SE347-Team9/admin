import { Route } from "react-router-dom";
import RoleBasedRoute from "../components/RoleBasedRoute";
import ProtectedLayout from "../components/ProtectedLayout";

// Admin pages (existing)
import Home from "../routes/home/index";
import Reports from "../pages/Report/Reports";
import AddReport from "../pages/Report/AddReport";
import ViewReport from "../pages/Report/ViewReport";
import AccountManagement from "../pages/AccountManagement/AccountManagement";
import AddAccount from "../pages/AccountManagement/AddAccount";
import ViewAccount from "../pages/AccountManagement/ViewAccount";
import EditAccount from "../pages/AccountManagement/EditAccount";
import AgencyManagement from "../pages/AgencyManagement/AgencyManagement";
import AddAgency from "../pages/AgencyManagement/AddAgency";
import ViewAgency from "../pages/AgencyManagement/ViewAgency";
import EditAgency from "../pages/AgencyManagement/EditAgency";
import AgencyEvaluation from "../pages/AgencyManagement/AgencyEvaluation";
import ProductSupplierManagement from "../pages/ProductSupplierManagement/ProductSupplierManagement";
import AddSupplierForProduct from "../pages/ProductSupplierManagement/AddSupplier";
import ViewSupplierForProduct from "../pages/ProductSupplierManagement/ViewSupplier";
import EditSupplierForProduct from "../pages/ProductSupplierManagement/EditSupplier";
import Regulations from "../pages/Regulations/Regulations";
import ViewRegulation from "../pages/Regulations/ViewRegulation";
import EditRegulation from "../pages/Regulations/EditRegulation";
import InventoryOverview from "../pages/InventoryOverview/InventoryOverview";

export const AdminRoutes = () => (
  <>
    <Route
      path="/admin/home"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <Home />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/reports"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <Reports />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/add-report"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <AddReport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/view-report/:reportId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <ViewReport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/account-management"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <AccountManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/add-account"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <AddAccount />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/view-account/:accountId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <ViewAccount />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/edit-account/:accountId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <EditAccount />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/agency-management"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <AgencyManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/add-agency"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <AddAgency />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/view-agency/:agencyId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <ViewAgency />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/edit-agency/:agencyId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <EditAgency />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/agency-evaluation"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <AgencyEvaluation />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/product-supplier-management"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <ProductSupplierManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/add-supplier"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <AddSupplierForProduct />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/view-supplier/:supplierId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <ViewSupplierForProduct />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/edit-supplier/:supplierId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <EditSupplierForProduct />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/regulations"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <Regulations />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/view-regulation/:regulationId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <ViewRegulation />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/edit-regulation/:regulationId"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <EditRegulation />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/inventory-overview"
      element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ProtectedLayout>
            <InventoryOverview />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
  </>
);
