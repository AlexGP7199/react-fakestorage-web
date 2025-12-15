import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex flex-col items-center gap-8 p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            FakeStore Manager
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema de gestión de productos
          </p>
        </div>
        
        <Link
          href="/products"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Ver Productos
        </Link>
      </main>
    </div>
  );
}
