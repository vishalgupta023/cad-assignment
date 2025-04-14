// File-related types
export interface FileAttributes {
    id?: number;
    filename: string;
    original_filename: string;
    file_size: number;
    file_type: 'DWG' | 'DXF';
    upload_date?: Date;
    file_path: string;
  }
  
  // Block-related types
  export interface BlockAttributes {
    id?: number;
    file_id: number;
    block_name: string;
    block_type?: string;
    coordinates: Record<string, any>;
    properties?: Record<string, any>;
    created_at?: Date;
  }
  
  // API request/response types
  export interface PaginationParams {
    page?: number;
    limit?: number;
  }
  
  export interface BlocksQueryParams extends PaginationParams {
    search?: string;
    file_id?: number;
    block_type?: string;
  }
  
  export interface UploadFileResponse {
    success: boolean;
    fileId?: number;
    message: string;
    blocksProcessed?: number;
  }
  
  // CAD-specific types
  export interface Point {
    x: number;
    y: number;
    z?: number;
  }
  
  export interface CadBlock {
    name: string;
    type?: string;
    entities: any[];
    layer?: string;
    position?: Point;
    properties?: Record<string, any>;
  }
  
  // Error response type
  export interface ErrorResponse {
    success: boolean;
    message: string;
    error?: any;
  }