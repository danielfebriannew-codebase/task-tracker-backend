# API Response Wrapper

API Response wrapper untuk memberikan format response yang konsisten di seluruh aplikasi.

## Format Response

Semua API response akan mengikuti format berikut:

```json
{
  "status": 200,
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "timestamp": "2024-01-01 12:00:00"
}
```

### Success Response
```json
{
  "status": 200,
  "success": true,
  "message": "Data retrieved successfully",
  "data": {...},
  "timestamp": "2024-01-01 12:00:00"
}
```

### Error Response
```json
{
  "status": 400,
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Amount must be a positive number"
  ],
  "timestamp": "2024-01-01 12:00:00"
}
```

## Cara Menggunakan

### 1. Menggunakan Static Methods (Recommended)

```typescript
import { ApiResponse } from '../../common/dto/api-response.dto';

@Controller('example')
export class ExampleController {

  // GET - Success Response
  @Get()
  async findAll(): Promise<ApiResponse<Item[]>> {
    const items = await this.service.findAll();
    return ApiResponse.success(items, 'Items retrieved successfully');
  }

  // POST - Created Response
  @Post()
  async create(@Body() dto: CreateDto): Promise<ApiResponse<Item>> {
    const item = await this.service.create(dto);
    return ApiResponse.created(item);
  }

  // PUT - Updated Response
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDto): Promise<ApiResponse<Item>> {
    const item = await this.service.update(id, dto);
    return ApiResponse.updated(item);
  }

  // DELETE - Deleted Response
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.service.delete(id);
    return ApiResponse.deleted();
  }
}
```

### 2. Custom Message

```typescript
// Success dengan custom message
return ApiResponse.success(data, 'User logged in successfully');

// Created dengan custom message
return ApiResponse.created(data, 'Account created successfully');

// Updated dengan custom message
return ApiResponse.updated(data, 'Profile updated successfully');

// Deleted dengan custom message
return ApiResponse.deleted('Account deleted successfully');
```

### 3. Error Response (Biasanya di Service/Exception)

```typescript
// Di service atau exception handler
throw new BadRequestException('Invalid input data');
// Akan otomatis di-wrap oleh HttpExceptionFilter menjadi format ApiResponse
```

## Response Interceptor

Response interceptor akan otomatis membungkus semua response yang belum menggunakan ApiResponse wrapper.

Jika Anda tidak menggunakan ApiResponse di controller, interceptor akan otomatis membungkusnya:

```typescript
// Tanpa wrapper (akan otomatis di-wrap oleh interceptor)
@Get()
async findAll(): Promise<Item[]> {
  return this.service.findAll();
}

// Response akan menjadi:
{
  "status": 200,
  "success": true,
  "message": "Operation successful",
  "data": [...],
  "timestamp": "2024-01-01 12:00:00"
}
```

## Available Static Methods

- `ApiResponse.success<T>(data: T, message?: string)` - Status 200
- `ApiResponse.created<T>(data: T, message?: string)` - Status 201
- `ApiResponse.updated<T>(data: T, message?: string)` - Status 200
- `ApiResponse.deleted(message?: string)` - Status 200, no data
- `ApiResponse.error<T>(status: number, message: string, errors?: string[], data?: T)` - Error response

## Best Practices

1. **Gunakan static methods di controller** untuk kontrol penuh atas message
2. **Biarkan interceptor handle response** untuk endpoint sederhana
3. **Exception akan otomatis di-format** oleh HttpExceptionFilter
4. **Gunakan custom message** yang deskriptif untuk user experience yang lebih baik
