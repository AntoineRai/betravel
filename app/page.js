import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen bg-primary flex-col items-center justify-center">
      <div>
        <h1 className="text-white font-bold text-3xl mb-12">
          Be{" "}
          <span className="bg-white text-primary px-2 py-4 rounded-md">Travel</span>
        </h1>
        <Link href="/travel" className="flex flex-col items-center justify-center text-white font-bold text-md border-2 border-white rounded-lg p-2 hover:bg-white hover:text-primary transition-all duration-300 ease-in-out">
          <h2>Accéder au site</h2>
        </Link>
      </div>
    </main>
  );
}
