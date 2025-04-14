// File types
export interface File {
    id: number;
    original_filename: string;
    file_type: 'DWG' | 'DXF';
    upload_date: string;
    file_size: number;
  }
  
  export interface FilesResponse {
    success: boolean;
    files: File[];
  }
  
  export interface FileResponse {
    success: boolean;
    file: File;
  }
  
  export interface UploadFileResponse {
    success: boolean;
    fileId?: number;
    message: string;
    blocksProcessed?: number;
  }

  export interface Coordinates {
      points: Point[];
      bounds?: {
        min: Point;
        max: Point;
      };
      center?: Point;
  }
  
  // Block types
  export interface Block {
    id: number;
    file_id: number;
    block_name: string;
    block_type?: string;
    created_at: string;
  }
  
  export interface BlockDetail extends Block {
    coordinates:{
      bounds: {
          max: { x: number, y: number },
          min: { x: number, y: number }
      },
      center: {
          x: number,
          y: number
      }
  }
    properties?: Record<string, any>;
  }
  
  export interface BlocksResponse {
    success: boolean;
    blocks: Block[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export interface BlockResponse {
    success: boolean;
    block: BlockDetail;
  }
  
  // Utility types
  export interface Point {
    x: number;
    y: number;
    z?: number;
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
  }
  
  export interface BlocksQueryParams extends PaginationParams {
    search?: string;
    file_id?: number;
    block_type?: string;
  }
  
  export interface SearchFormValues {
    search: string;
    blockType: string;
  }
  
  export interface ErrorResponse {
    success: boolean;
    message: string;
    error?: string;
  }