// Dashboard layout removed to prevent duplicate navigation
// Navigation is handled by root layout.tsx with MainSidebar and TopBar
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simply pass through children without adding another layout
  // Root layout already provides MainSidebar + TopBar + MainContent wrapper
  return <>{children}</>;
}
