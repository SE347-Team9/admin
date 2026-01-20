import { Route } from "react-router-dom";
import RoleBasedRoute from "../components/RoleBasedRoute";
import ProtectedLayout from "../components/ProtectedLayout";

// Agency pages
import AgencyDashboard from "../pages/Agency/AgencyDashboard/AgencyDashboard";
import AgencyManagement from "../pages/Agency/AgencyManagement/AgencyManagement";
import DistributionRequest from "../pages/Agency/Distribution/DistributionRequest";
import PaymentManagement from "../pages/Agency/Payment/PaymentManagement";
import ReceiveGoods from "../pages/Agency/ReceiveGood/ReceiveGoods";
import ViewReceive from "../pages/Agency/ReceiveGood/ViewReceive";
import ViewImport from "../pages/Agency/ReceiveGood/ViewImport";

export const AgencyRoutes = () => (
  <>
    <Route
      path="/agency/dashboard"
      element={
        <RoleBasedRoute allowedRoles={['agency']}>
          <ProtectedLayout>
            <AgencyDashboard />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/agency/agency-management"
      element={
        <RoleBasedRoute allowedRoles={['agency']}>
          <ProtectedLayout>
            <AgencyManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/agency/distribution-request"
      element={
        <RoleBasedRoute allowedRoles={['agency']}>
          <ProtectedLayout>
            <DistributionRequest />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/agency/payment-management"
      element={
        <RoleBasedRoute allowedRoles={['agency']}>
          <ProtectedLayout>
            <PaymentManagement />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/agency/receive-goods"
      element={
        <RoleBasedRoute allowedRoles={['agency']}>
          <ProtectedLayout>
            <ReceiveGoods />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/agency/view-receive/:receiveId"
      element={
        <RoleBasedRoute allowedRoles={['agency']}>
          <ProtectedLayout>
            <ViewReceive />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/agency/view-import/:importId"
      element={
        <RoleBasedRoute allowedRoles={['agency']}>
          <ProtectedLayout>
            <ViewImport />
          </ProtectedLayout>
        </RoleBasedRoute>
      }
    />
  </>
);
