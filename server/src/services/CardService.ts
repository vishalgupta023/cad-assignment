import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import DxfParserImport from 'dxf-parser';
import { CadBlock, FileAttributes, Point, UploadFileResponse } from '../types/index.js';
import { Block } from '../models/Block.js';
import { File } from '../models/File.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CadService {
  /**
   * Process a DXF file and extract block information
   * @param fileData - Information about the uploaded file
   * @returns Processing result with file ID and blocks count
   */
  async processDxfFile(fileData: Express.Multer.File): Promise<UploadFileResponse> {
    try {
      const DxfParser = DxfParserImport as any;
      const parser = new  DxfParser();
      const filePath = path.join(__dirname, '../../uploads', fileData.filename);
      
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf8');
      

      const dxf = parser.parse(fileContent);
      
      // Create file record in database
      const fileRecord = await File.create({
        filename: fileData.filename,
        original_filename: fileData.originalname,
        file_size: fileData.size,
        file_type: 'DXF',
        file_path: filePath
      });
      
      // Extract blocks from DXF
      const blocks = dxf?.blocks || {};
      let blockRecords = [] as any;
      
      // // Process each block
      for (const [blockName, blockData]  of Object.entries(blocks)) {
        let data : any = blockData
        const blockInfo = {
          file_id: fileRecord.id,
          block_name: blockName,
          block_type: this._determineBlockType(blockData),
          coordinates: this._extractCoordinates(blockData),
          properties: this._extractProperties(blockData)
        };
        
        blockRecords.push(blockInfo);
      }
      
      // Bulk create block records
      if (blockRecords.length > 0) {
        await Block.bulkCreate(blockRecords);
      }
      
      return {
        success: true,
        fileId: fileRecord.id,
        message: 'File processed successfully',
        blocksProcessed: blockRecords.length
      };
    } catch (error) {
      console.error('Error processing DXF file:', error);
      throw new Error(`Failed to process DXF file: ${(error as Error).message}`);
    }
  }
  
  /**
   * Determine the type of block based on its entities
   * @param blockData - Block data from DXF file
   * @returns Block type as string
   */
  private _determineBlockType(blockData: any): string {
    if (!blockData || !blockData.entities) return 'unknown';
    
    // Analyze entities to determine block type
    const entityTypes = blockData.entities.map((e: any) => e.type);
    
    if (entityTypes.includes('INSERT')) return 'nested';
    if (entityTypes.includes('CIRCLE') || entityTypes.includes('ARC')) return 'curved';
    if (entityTypes.includes('LINE') || entityTypes.includes('POLYLINE')) return 'linear';
    
    return 'basic';
  }
  
  /**
   * Extract coordinates from block data
   * @param blockData - Block data from DXF file
   * @returns Coordinates as JSON object
   */
  private _extractCoordinates(blockData: any): Record<string, any> {
    if (!blockData || !blockData.entities) return { points: [] };
    
    const points: Point[] = [];
    const bounds = {
      min: { x: Infinity, y: Infinity },
      max: { x: -Infinity, y: -Infinity }
    };
    
    // Process each entity to extract coordinates
    blockData.entities.forEach((entity: any) => {
      switch (entity.type) {
        case 'LINE':
          if (entity.vertices) {
            entity.vertices.forEach((vertex: any) => {
              this._updateBounds(bounds, vertex);
              points.push({ x: vertex.x, y: vertex.y, z: vertex.z || 0 });
            });
          } else if (entity.start && entity.end) {
            this._updateBounds(bounds, entity.start);
            this._updateBounds(bounds, entity.end);
            points.push(
              { x: entity.start.x, y: entity.start.y, z: entity.start.z || 0 },
              { x: entity.end.x, y: entity.end.y, z: entity.end.z || 0 }
            );
          }
          break;
          
        case 'CIRCLE':
          if (entity.center) {
            this._updateBounds(bounds, {
              x: entity.center.x + entity.radius,
              y: entity.center.y + entity.radius
            });
            this._updateBounds(bounds, {
              x: entity.center.x - entity.radius,
              y: entity.center.y - entity.radius
            });
            points.push({ x: entity.center.x, y: entity.center.y, z: entity.center.z || 0 });
          }
          break;
          
        case 'POLYLINE':
        case 'LWPOLYLINE':
          if (entity.vertices) {
            entity.vertices.forEach((vertex: any) => {
              this._updateBounds(bounds, vertex);
              points.push({ x: vertex.x, y: vertex.y, z: vertex.z || 0 });
            });
          }
          break;
          
        case 'POINT':
          if (entity.position) {
            this._updateBounds(bounds, entity.position);
            points.push({
              x: entity.position.x,
              y: entity.position.y,
              z: entity.position.z || 0
            });
          }
          break;
      }
    });
    
    return {
      points,
      bounds: bounds.min.x !== Infinity ? bounds : null,
      center: bounds.min.x !== Infinity ? {
        x: (bounds.min.x + bounds.max.x) / 2,
        y: (bounds.min.y + bounds.max.y) / 2
      } : null
    };
  }
  
  /**
   * Extract additional properties from block data
   * @param blockData - Block data from DXF file
   * @returns Properties as JSON object
   */
  private _extractProperties(blockData: any): Record<string, any> {
    if (!blockData) return {};
    
    const properties: Record<string, any> = {};
    
    // Extract basic properties
    if (blockData.name) properties.name = blockData.name;
    if (blockData.layer) properties.layer = blockData.layer;
    if (blockData.handle) properties.handle = blockData.handle;
    
    // Extract entity count by type
    if (blockData.entities) {
      const entityCounts: Record<string, number> = {};
      blockData.entities.forEach((entity: any) => {
        if (entity.type) {
          entityCounts[entity.type] = (entityCounts[entity.type] || 0) + 1;
        }
      });
      properties.entityCounts = entityCounts;
      properties.totalEntities = blockData.entities.length;
    }
    
    return properties;
  }
  
  /**
   * Update bounding box with a new point
   * @param bounds - Current bounds object
   * @param point - New point to include in bounds
   */
  private _updateBounds(bounds: any, point: any): void {
    if (!point) return;
    
    bounds.min.x = Math.min(bounds.min.x, point.x);
    bounds.min.y = Math.min(bounds.min.y, point.y);
    bounds.max.x = Math.max(bounds.max.x, point.x);
    bounds.max.y = Math.max(bounds.max.y, point.y);
  }
}

export default new CadService();