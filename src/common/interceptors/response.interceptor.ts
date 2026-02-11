import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Jika data sudah dalam format ApiResponse, return langsung
        if (data instanceof ApiResponse) {
          return data;
        }

        // Tentukan message dan gunakan static method berdasarkan status code
        if (statusCode === 201) {
          return ApiResponse.created(data);
        } else if (statusCode === 204) {
          return ApiResponse.deleted();
        }

        return ApiResponse.success(data);
      }),
    );
  }
}
