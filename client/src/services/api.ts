// src/services/api.ts
import axios from 'axios';
import { File, Block, BlocksQueryParams, BlockDetail } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Files API
export const getFiles = async (): Promise<{success : boolean , files: File[]}> => {
  const response = await api.get('/files');
  return response.data;
};

export const getFileById = async (id: number): Promise<{success : boolean ,file :File , message :string}> => {
  const response = await api.get(`/files/${id}`);
  return response.data;
};

export const uploadFile = async (file: any): Promise<{success :boolean ,message :string , error ? :string , fileId?:number}> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Blocks API
export const getBlocks = async (
  fileId: number,
  params: BlocksQueryParams
): Promise<{
  success: boolean;
  message: string;
  blocks?: BlockDetail[];
  error?: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const query = new URLSearchParams();

  query.append("page", String(params.page ?? 1));
  query.append("limit", String(params.limit ?? 10));
  query.append("file_id", String(fileId));

  if (params.block_type) query.append("block_type", params.block_type);
  if (params.search) query.append("search", params.search);

  const response = await api.get(`/blocks?${query.toString()}`);
  return response.data;
};


export const getBlockById = async (id: string): Promise<Block> => {
  const response = await api.get(`/blocks/${id}`);
  return response.data;
};

export const getBlocksByFileId = async (fileId: string): Promise<Block[]> => {
  const response = await api.get(`/blocks/file/${fileId}`);
  return response.data;
};

export default api;