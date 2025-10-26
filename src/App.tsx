import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './routes/auth/Login.tsx'
import Register from './routes/auth/Register.tsx'
import Reports from './pages/Report/Reports.tsx'
import AddReport from './pages/Report/AddReport.tsx'
import ViewReport from './pages/Report/ViewReport.tsx'
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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App