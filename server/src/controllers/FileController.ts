import { Request, Response } from 'express';
import { UploadFileResponse } from '../types/index.js';
import CardService from '../services/CardService.js';
import { File } from '../models/File.js';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    
    // Validate file type
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'dxf' && fileExtension !== 'dwg') {
      return res.status(400).json({
        success: false,
        message: 'Only DXF and DWG files are supported'
      });
    }
    
    let result: UploadFileResponse;
    
    // Process file based on type
    if (fileExtension === 'dxf') {
      result = await CardService.processDxfFile(file);
    } else {
      // Currently we only support DXF files
      return res.status(400).json({
        success: false,
        message: 'DWG files are not currently supported. Please upload a DXF file.'
      });
    }
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error in file upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing file',
      error: (error as Error).message
    });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    const files = await File.findAll({
      attributes: ['id', 'original_filename', 'file_type', 'upload_date', 'file_size'],
      order: [['upload_date', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      files
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching files',
      error: (error as Error).message
    });
  }
};

export const getFileById = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id);
    
    if (isNaN(fileId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file ID'
      });
    }
    
    const file = await File.findByPk(fileId, {
      attributes: ['id', 'original_filename', 'file_type', 'upload_date', 'file_size']
    });
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message : "success",
      file
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching file',
      error: (error as Error).message
    });
  }
};