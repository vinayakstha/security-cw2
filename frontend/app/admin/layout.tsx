import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-screen overflow-hidden">
      {/* Header: spans full width, stays on top */}
      <Header />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: fixed width, non-scrollable */}
        <Sidebar />

        {/* Main content: scrollable */}
        <main className="flex-1 p-2 bg-white overflow-y-auto mt-2">
          {children}
        </main>
      </div>
    </section>
  );
}
