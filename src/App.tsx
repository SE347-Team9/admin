import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './routes/auth/Login.tsx'
import Register from './routes/auth/Register.tsx'
import Reports from './pages/Report/Reports.tsx'
import AddReport from './pages/Report/AddReport.tsx'
import ViewReport from './pages/Report/ViewReport.tsx'
import AccountManagement from './pages/AccountManagement/AccountManagement.tsx'
import AddAccount from './pages/AccountManagement/AddAccount.tsx'
import ViewAccount from './pages/AccountManagement/ViewAccount.tsx'
import EditAccount from './pages/AccountManagement/EditAccount.tsx'
import AgencyManagement from './pages/AgencyManagement/AgencyManagement.tsx'
import ViewAgency from './pages/AgencyManagement/ViewAgency.tsx'
import EditAgency from './pages/AgencyManagement/EditAgency.tsx'
import MainLayout from './components/layout/MainLayout.tsx'
import NotFound from './routes/NotFound/NotFound.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/add-report" element={<MainLayout><AddReport /></MainLayout>} />
        <Route path="/view-report/:reportId" element={<MainLayout><ViewReport /></MainLayout>} />
        <Route path="/account-management" element={<MainLayout><AccountManagement /></MainLayout>} />
        <Route path="/add-account" element={<MainLayout><AddAccount /></MainLayout>} />
        <Route path="/view-account/:id" element={<MainLayout><ViewAccount /></MainLayout>} />
        <Route path="/edit-account/:id" element={<MainLayout><EditAccount /></MainLayout>} />
        <Route path="/agency-management" element={<MainLayout><AgencyManagement /></MainLayout>} />
        <Route path="/view-agency/:id" element={<MainLayout><ViewAgency /></MainLayout>} />
        <Route path="/edit-agency/:id" element={<MainLayout><EditAgency /></MainLayout>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App