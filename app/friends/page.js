import Sidebar from "@/components/Sidebar";

export default function Home() {
    return (
      <main className="flex min-h-screen min-w-screen">
        <Sidebar />
        <div className="w-5/6">
          {/* Header */}
          <div className="h-1/6 bg-secondary flex flex-col items-center justify-center text-white text-2xl font-bold">
            Amis
          </div>
          {/* Contenu */}
          <div></div>
        </div>
      </main>
    );
  }
  