// Dashboard layout
import { DashboardLayout } from '@/components/adil/citizenDashboard/DashboardLayout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock user data - in real app, get from auth context
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: null,
  };

  return (
    <DashboardLayout
      user={mockUser}
      unreadNotifications={3}
      progressBadge={true}
      onLogout={() => {
        // Handle logout
        console.log('Logout clicked');
      }}
    >
      {children}
    </DashboardLayout>
  );
}
