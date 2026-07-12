import AppSidebar from './AppSidebar';
import AppTopBar from './AppTopBar';
import { ToastProvider } from './ui/Toast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AppTopBar />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
