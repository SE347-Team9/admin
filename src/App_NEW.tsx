import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./routes/auth/Login";
import Register from "./routes/auth/Register";
import NotFound from "./routes/NotFound/NotFound";
import { authService } from "./api/endpoints/authService";
import socketService from "./services/socketService";
import { AdminRoutes } from "./routes/AdminRoutes";
import { StaffRoutes } from "./routes/StaffRoutes";
import { AgencyRoutes } from "./routes/AgencyRoutes";

function App() {
  // Initialize socket connection if user is already logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && !socketService.isConnected()) {
      socketService.connect(user.id, user.role);
    }
    
    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);
  
  // Root redirect based on user role
  const RootRedirect = () => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/home" replace />;
      case 'staff':
        return <Navigate to="/staff/home" replace />;
      case 'agency':
        return <Navigate to="/agency/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };
  
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
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Admin routes */}
        {AdminRoutes()}
        
        {/* Staff routes */}
        {StaffRoutes()}
        
        {/* Agency routes */}
        {AgencyRoutes()}
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
