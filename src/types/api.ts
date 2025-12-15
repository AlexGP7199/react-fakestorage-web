// Tipos base de respuesta del backend

export enum ErrorCode {
  None = 0,
  NotFound = 1,
  ValidationError = 2,
  BadRequest = 3,
  InternalServerError = 4,
  Conflict = 5,
  ServiceUnavailable = 6,
  GatewayTimeout = 7,
}

export interface ValidationFailure {
  propertyName: string;
  errorMessage: string;
  attemptedValue?: unknown;
  errorCode?: string;
}

export interface BaseResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
  errores?: ValidationFailure[];
  errorCode: ErrorCode;
}

// BaseResponseList en C# extiende BaseResponse<IEnumerable<T>>
// Por lo tanto data es T[], no anidado
export interface BaseResponseList<T> {
  isSuccess: boolean;
  data?: T[];
  message?: string;
  errores?: ValidationFailure[];
  errorCode: ErrorCode;
  totalRecords: number;
}

// DTOs de Producto
export interface ProductDto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface UpdateProductDto {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
