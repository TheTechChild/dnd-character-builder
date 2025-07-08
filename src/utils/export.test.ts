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
    
    const originalCreateElement = document.createElement;
    document.createElement = jest.fn((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as unknown as HTMLAnchorElement;
      }
      return originalCreateElement.call(document, tagName);
    });
    document.body.appendChild = jest.fn() as unknown as typeof document.body.appendChild;
    document.body.removeChild = jest.fn() as unknown as typeof document.body.removeChild;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should export character with proper filename', () => {
    const character = createEmptyCharacter();
    character.name = 'Gandalf';
    character.id = '12345678-1234-1234-1234-123456789012';
    
    exportCharacter(character);
    
    expect((document.createElement as jest.Mock)).toHaveBeenCalledWith('a');
    const createCalls = (document.createElement as jest.Mock).mock.calls;
    const aTagCall = createCalls.find(call => call[0] === 'a');
    expect(aTagCall).toBeDefined();
  });

  it('should use default filename for unnamed character', () => {
    const character = createEmptyCharacter();
    character.name = '';
    character.id = '87654321-4321-4321-4321-210987654321';
    
    exportCharacter(character);
    
    expect((document.createElement as jest.Mock)).toHaveBeenCalledWith('a');
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
    
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });
});