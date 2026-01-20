import ProtectedRoute from './ProtectedRoute';
import MainLayout from './layout/MainLayout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
