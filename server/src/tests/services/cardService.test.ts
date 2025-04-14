import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CardService from '../../services/CardService.js';
import { File } from '../../models/File.js';
import { Block } from '../../models/Block.js';
import fs from "fs"

// Mock dependencies
// vi.mock('fs', () => ({
//   readFileSync: vi.fn(() => `
//     0
//     SECTION
//     2
//     BLOCKS
//     0
//     BLOCK
//     8
//     0
//     2
//     BlockA
//     70
//     0
//     10
//     0.0
//     20
//     0.0
//     30
//     0.0
//     0
//     LINE
//     8
//     0
//     10
//     0.0
//     20
//     0.0
//     30
//     0.0
//     11
//     10.0
//     21
//     10.0
//     31
//     0.0
//     0
//     ENDBLK
//     0
//     BLOCK
//     8
//     0
//     2
//     BlockB
//     70
//     0
//     10
//     0.0
//     20
//     0.0
//     30
//     0.0
//     0
//     CIRCLE
//     8
//     0
//     10
//     5.0
//     20
//     5.0
//     30
//     0.0
//     40
//     2.5
//     0
//     ENDBLK
//     0
//     ENDSEC
//   `)
// }));

vi.mock('../../models/File.js', () => ({

  File: {
    create: vi.fn().mockResolvedValue({ id: 1 })
  }
}));

vi.mock('../../models/Block.js', () => ({
  Block: {
    bulkCreate: vi.fn().mockResolvedValue([])
  }
}));

// Mock the DXF parser
vi.mock('dxf-parser', () => {
  return {
    default: class MockDxfParser {
      parseSync() {
        return {
          blocks: {
            BlockA: {
              name: 'BlockA',
              entities: [
                { 
                  type: 'LINE',
                  start: { x: 0, y: 0, z: 0 },
                  end: { x: 10, y: 10, z: 0 }
                }
              ],
              layer: 'Layer1'
            },
            BlockB: {
              name: 'BlockB',
              entities: [
                {
                  type: 'CIRCLE',
                  center: { x: 5, y: 5, z: 0 },
                  radius: 2.5
                }
              ],
              layer: 'Layer2'
            }
          }
        };
      }
    }
  };
});

describe('CAD Service', () => {
  const mockFile = {
    filename: 'test-file.dxf',
    originalname: 'original-test-file.dxf',
    size: 1024,
    path: '/path/to/test-file.dxf'
  } as Express.Multer.File;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process a DXF file and extract blocks', async () => {
    const result = await CardService.processDxfFile(mockFile);
    
    // Check result
    expect(result.success).toBe(true);
    expect(result.fileId).toBe(1);
    expect(result.blocksProcessed).toBeDefined();
    
    // Verify that File.create was called with correct params
    expect(File.create).toHaveBeenCalledWith({
      filename: mockFile.filename,
      original_filename: mockFile.originalname,
      file_size: mockFile.size,
      file_type: 'DXF',
      file_path: expect.any(String)
    });
    
    // Verify that Block.bulkCreate was called
    expect(Block.bulkCreate).toHaveBeenCalled();
    
    // Verify that blocks were extracted correctly
    const blockCreateCall = vi.mocked(Block.bulkCreate).mock.calls[0][0];
    expect(blockCreateCall).toHaveLength(2); // Two blocks in our mock data
    
    // Verify first block data
    expect(blockCreateCall[0].file_id).toBe(1);
    expect(blockCreateCall[0].block_name).toBe('BlockA');
    expect(blockCreateCall[0].block_type).toBe('linear');
    
    // Verify second block data
    expect(blockCreateCall[1].file_id).toBe(1);
    expect(blockCreateCall[1].block_name).toBe('BlockB');
    expect(blockCreateCall[1].block_type).toBe('curved');
  });

  it('should handle errors during file processing', async () => {
    // Force an error by making File.create reject
    vi.mocked(File.create).mockRejectedValueOnce(new Error('Database error'));
    
    // Expect the service to throw an error
    await expect(CardService.processDxfFile(mockFile)).rejects.toThrow('Failed to process DXF file');
  });
});





