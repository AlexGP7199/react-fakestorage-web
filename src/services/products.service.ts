import {
  BaseResponse,
  BaseResponseList,
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
  ErrorCode,
} from '@/types/api';

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5127/api';

class ProductsService {
  private baseUrl = `${API_BASE_URL}/products`;

  async getAllProducts(): Promise<BaseResponseList<ProductDto>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // El controller siempre retorna un BaseResponseList, incluso en error
      return data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      // Error de red o JSON inválido
      return {
        isSuccess: false,
        data: [],
        message: 'Error de conexión con el servidor',
        errorCode: ErrorCode.ServiceUnavailable,
        totalRecords: 0,
      };
    }
  }

  async getProductById(id: number): Promise<BaseResponse<ProductDto>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // El controller retorna BaseResponse en todos los casos
      return data;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      return {
        isSuccess: false,
        message: 'Error de conexión con el servidor',
        errorCode: ErrorCode.ServiceUnavailable,
      };
    }
  }

  async createProduct(
    product: CreateProductDto
  ): Promise<BaseResponse<ProductDto>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      return {
        isSuccess: false,
        message: 'Error de conexión con el servidor',
        errorCode: ErrorCode.ServiceUnavailable,
      };
    }
  }

  async updateProduct(
    id: number,
    product: UpdateProductDto
  ): Promise<BaseResponse<ProductDto>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      return {
        isSuccess: false,
        message: 'Error de conexión con el servidor',
        errorCode: ErrorCode.ServiceUnavailable,
      };
    }
  }

  async deleteProduct(id: number): Promise<BaseResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      return {
        isSuccess: false,
        data: false,
        message: 'Error de conexión con el servidor',
        errorCode: ErrorCode.ServiceUnavailable,
      };
    }
  }
}

export const productsService = new ProductsService();
