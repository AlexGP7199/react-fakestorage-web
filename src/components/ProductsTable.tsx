'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProductDto } from '@/types/api';
import { productsService } from '@/services/products.service';

interface ProductsTableProps {
  initialProducts: ProductDto[];
}

export default function ProductsTable({ initialProducts }: ProductsTableProps) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }

    try {
      const response = await productsService.deleteProduct(id);

      if (response.isSuccess) {
        alert(response.message || 'Producto eliminado exitosamente');
        router.refresh();
      } else {
        alert(response.message || 'Error al eliminar producto');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
      console.error(err);
    }
  };

  if (initialProducts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay productos disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Imagen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {initialProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
