import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { BlocksQueryParams } from '../types/index.js';
import { Block } from '../models/Block.js';

export const getBlocks = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, file_id, block_type } = req.query as unknown as BlocksQueryParams;
    
    // Build query conditions
    const whereClause: any = {};

    
    if (file_id) {
      whereClause.file_id = file_id;
    }
    
    if (block_type) {
      whereClause.block_type = block_type;
    }
    
    if (search) {
      whereClause.block_name = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Execute query
    const {count ,rows} = await Block.findAndCountAll({
      where: whereClause,
      limit,
      offset: offset,
      order: [['block_name', 'ASC']],
      attributes: ['id', 'file_id', 'block_name', 'block_type', 'created_at' , 'coordinates' , 'block_name']
    });

    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      success: true,
      blocks: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blocks',
      error: (error as Error).message
    });
  }
};

export const getBlocksByFileId = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId);
    const { page = 1, limit = 10, search, block_type } = req.query as unknown as BlocksQueryParams;
    
    if (isNaN(fileId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file ID'
      });
    }
    
    // Build query conditions
    const whereClause: any = {
      file_id: fileId
    };
    
    if (block_type) {
      whereClause.block_type = block_type;
    }
    
    if (search) {
      whereClause.block_name = {
        [Op.iLike]: `%${search}%`
      };
    }

    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Execute query
    const { count, rows } = await Block.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['block_name', 'ASC']],
      attributes: ['id', 'file_id', 'block_name', 'block_type', 'created_at']
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      success: true,
      blocks: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching blocks by file ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blocks',
      error: (error as Error).message
    });
  }
};

export const getBlockById = async (req: Request, res: Response) => {
  try {
    const blockId = parseInt(req.params.id);
    
    if (isNaN(blockId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid block ID'
      });
    }
    
    const block = await Block.findByPk(blockId);
    
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Block not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      block
    });
  } catch (error) {
    console.error('Error fetching block:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching block',
      error: (error as Error).message
    });
  }
};