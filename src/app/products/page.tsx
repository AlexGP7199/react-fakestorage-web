import Link from 'next/link';
import { productsService } from '@/services/products.service';
import ProductsTable from '@/components/ProductsTable';

// Desactivar cache para esta página
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductsPage() {
  const response = await productsService.getAllProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Productos</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Agregar Producto
        </Link>
      </div>

      {!response.isSuccess && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">⚠️ {response.message || 'Error al cargar productos'}</p>
          {response.errorCode && (
            <p className="text-sm mt-1">Código de error: {response.errorCode}</p>
          )}
        </div>
      )}

      {response.isSuccess && response.data && response.data.length > 0 ? (
        <ProductsTable initialProducts={response.data} />
      ) : response.isSuccess && response.data && response.data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No hay productos disponibles</p>
          <Link
            href="/products/new"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 underline"
          >
            Crear el primer producto
          </Link>
        </div>
      ) : null}
    </div>
  );
}
