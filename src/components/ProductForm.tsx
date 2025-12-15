'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreateProductDto, ValidationFailure, ProductDto } from '@/types/api';
import { productsService } from '@/services/products.service';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: number;
  initialData?: ProductDto;
}

export default function ProductForm({ mode, productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = mode === 'edit';

  const [formData, setFormData] = useState<CreateProductDto>({
    title: initialData?.title || '',
    price: initialData?.price || 0,
    description: initialData?.description || '',
    category: initialData?.category || '',
    image: initialData?.image || '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && productId && !initialData) {
      loadProduct(productId);
    }
  }, [productId, isEditMode, initialData]);

  const loadProduct = async (id: number) => {
    try {
      setLoadingProduct(true);
      const response = await productsService.getProductById(id);

      if (response.isSuccess && response.data) {
        setFormData({
          title: response.data.title,
          price: response.data.price,
          description: response.data.description,
          category: response.data.category,
          image: response.data.image,
        });
      } else {
        setServerError(response.message || 'Error al cargar el producto');
      }
    } catch (err) {
      setServerError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoadingProduct(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El nombre es requerido';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'La URL de la imagen es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = isEditMode && productId
        ? await productsService.updateProduct(productId, formData)
        : await productsService.createProduct(formData);

      if (response.isSuccess) {
        alert(response.message || 'Operación exitosa');
        router.push('/products');
      } else {
        // Manejar errores de validación del backend
        if (response.errores && response.errores.length > 0) {
          const backendErrors: Record<string, string> = {};
          response.errores.forEach((error: ValidationFailure) => {
            const fieldName = error.propertyName.charAt(0).toLowerCase() + 
                             error.propertyName.slice(1);
            backendErrors[fieldName] = error.errorMessage;
          });
          setErrors(backendErrors);
        }
        setServerError(response.message || 'Error en la operación');
      }
    } catch (err) {
      setServerError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Permitir solo números y un punto decimal
      const sanitized = value.replace(/[^0-9.]/g, '');
      // Limitar a máximo 2 decimales
      const parts = sanitized.split('.');
      const formattedValue = parts.length > 1 
        ? `${parts[0]}.${parts[1].slice(0, 2)}`
        : sanitized;
      
      setFormData((prev) => ({
        ...prev,
        price: parseFloat(formattedValue) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Cargando producto...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Nombre *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
              errors.title
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ingrese el nombre del producto"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
            Precio *
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
              errors.price
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Categoría *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
              errors.category
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ingrese la categoría"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Descripción *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
              errors.description
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ingrese la descripción del producto"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            URL de la Imagen *
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
              errors.image
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
          
          {/* Previsualización de imagen */}
          {formData.image && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Previsualización:</p>
              <div className="border rounded-lg p-4 bg-gray-50 flex justify-center">
                <Image
                  src={formData.image}
                  alt="Previsualización"
                  width={200}
                  height={200}
                  className="object-contain max-h-48"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
