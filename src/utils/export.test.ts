import { describe, it, expect, jest } from '@jest/globals';
import { exportCharacter } from './export';
import { createEmptyCharacter } from './character';

describe('Export Utils', () => {
  beforeEach(() => {
    // Mock DOM methods
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    // Mock document.createElement and related methods
    const mockLink = {
      href: '',
      download: '',
      click: jest.fn(),
    };
    
    document.createElement = jest.fn(() => mockLink as any);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should export character with proper filename', () => {
    const character = createEmptyCharacter();
    character.name = 'Gandalf';
    character.id = '12345678-1234-1234-1234-123456789012';
    
    exportCharacter(character);
    
    const mockLink = (document.createElement as jest.Mock).mock.results[0].value;
    expect(mockLink.download).toBe('Gandalf-12345678.json');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should use default filename for unnamed character', () => {
    const character = createEmptyCharacter();
    character.name = '';
    character.id = '87654321-4321-4321-4321-210987654321';
    
    exportCharacter(character);
    
    const mockLink = (document.createElement as jest.Mock).mock.results[0].value;
    expect(mockLink.download).toBe('character-87654321.json');
  });

  it('should create and revoke blob URL', () => {
    const character = createEmptyCharacter();
    
    exportCharacter(character);
    
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should properly append and remove link from document', () => {
    const character = createEmptyCharacter();
    
    exportCharacter(character);
    
    const mockLink = (document.createElement as jest.Mock).mock.results[0].value;
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });
});