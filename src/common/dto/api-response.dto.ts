import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty({ required: false, type: [String] })
  errors?: string[];

  @ApiProperty({ example: '2024-01-01 12:00:00' })
  timestamp: string;

  private constructor(
    success: boolean,
    status: number,
    message: string,
    data?: T,
    errors?: string[],
  ) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  static success<T>(data: T, message = 'Operation successful'): ApiResponse<T> {
    return new ApiResponse<T>(true, 200, message, data);
  }

  static created<T>(data: T, message = 'Created successfully'): ApiResponse<T> {
    return new ApiResponse<T>(true, 201, message, data);
  }

  static updated<T>(data: T, message = 'Updated successfully'): ApiResponse<T> {
    return new ApiResponse<T>(true, 200, message, data);
  }

  static deleted(message = 'Deleted successfully'): ApiResponse<void> {
    return new ApiResponse<void>(true, 200, message);
  }

  static error<T = any>(
    status: number,
    message: string,
    errors?: string[],
    data?: T,
  ): ApiResponse<T> {
    return new ApiResponse<T>(false, status, message, data, errors);
  }
}
