import { Route } from "react-router-dom";
import RoleBasedRoute from "../components/RoleBasedRoute";
import ProtectedLayout from "../components/ProtectedLayout";

// Staff pages
import StaffHome from "../routes/home/index";
import StaffReports from "../pages/Staff/Report/Reports";
import StaffAddReport from "../pages/Staff/Report/AddReport";
import StaffViewReport from "../pages/Staff/Report/ViewReport";
import StaffAgencyManagement from "../pages/Staff/AgencyManagement/AgencyManagement";
import StaffAddAgency from "../pages/Staff/AgencyManagement/AddAgency";
import StaffViewAgency from "../pages/Staff/AgencyManagement/ViewAgency";
import StaffEditAgency from "../pages/Staff/AgencyManagement/EditAgency";
import ExportManagement from "../pages/Staff/ExportManagement/ExportManagement";
import CreateExport from "../pages/Staff/ExportManagement/CreateExport";
import ViewExport from "../pages/Staff/ExportManagement/ViewExport";
import EditExport from "../pages/Staff/ExportManagement/EditExport";
import ReceiveGoods from "../pages/Staff/ReceiveGoods/ReceiveGoods";
import CreateReceipt from "../pages/Staff/ReceiveGoods/CreateReceipt";
import ViewReceipt from "../pages/Staff/ReceiveGoods/ViewReceipt";
import EditReceipt from "../pages/Staff/ReceiveGoods/EditReceipt";
import CreateReceiveOrder from "../pages/Staff/ReceiveGoods/CreateReceiveOrder";
import ViewImport from "../pages/Staff/ReceiveGoods/ViewImport";
import EditImport from "../pages/Staff/ReceiveGoods/EditImport";
import ReceiveManagement from "../pages/Staff/ReceiveManagement/ReceiveManagement";
import ViewReceiveOrder from "../pages/Staff/ReceiveManagement/ViewReceiveOrder";
import EditReceiveOrder from "../pages/Staff/ReceiveManagement/EditReceiveOrder";
import WarehouseManagement from "../pages/Staff/WarehouseManagement/WarehouseManagement";
import PaymentManagement from "../pages/Staff/PaymentManagement/PaymentManagement";
import CreateReceiptVoucher from "../pages/Staff/PaymentManagement/CreateReceiptVoucher";
import EditPayment from "../pages/Staff/PaymentManagement/EditPayment";
import StaffRegulations from "../pages/Staff/Regulations/Regulations";
import StaffViewRegulation from "../pages/Staff/Regulations/ViewRegulation";

export const StaffRoutes = () => (
  <>
    <Route
      path="/staff/home"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffHome />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/reports"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffReports />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/add-report"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffAddReport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/view-report/:reportId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffViewReport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/agency-management"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffAgencyManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/add-agency"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffAddAgency />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/view-agency/:agencyId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffViewAgency />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/edit-agency/:agencyId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffEditAgency />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/export-management"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <ExportManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/create-export"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <CreateExport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/view-export/:exportId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <ViewExport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/edit-export/:exportId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <EditExport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/receive-goods"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <ReceiveGoods />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/create-receipt"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <CreateReceipt />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/view-receipt/:receiptId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <ViewReceipt />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/edit-receipt/:receiptId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <EditReceipt />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/create-receive-order"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <CreateReceiveOrder />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/view-import/:importId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <ViewImport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/edit-import/:importId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <EditImport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/receive-management"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <ReceiveManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/view-receive-order/:orderId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <ViewReceiveOrder />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/edit-receive-order/:orderId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <EditReceiveOrder />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/warehouse-management"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <WarehouseManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/payment-management"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <PaymentManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/create-receipt-voucher"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <CreateReceiptVoucher />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/edit-payment/:paymentId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <EditPayment />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/regulations"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffRegulations />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/staff/view-regulation/:regulationId"
      element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ProtectedLayout>
            <StaffViewRegulation />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
  </>
);
