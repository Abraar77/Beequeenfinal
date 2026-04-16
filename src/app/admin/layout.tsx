import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
