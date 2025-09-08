// Global test setup file
// This file runs before all tests

// Mock fetch globally for all tests
Object.defineProperty(global, 'fetch', {
  value: jest.fn(),
  writable: true
});

// Set up default environment variables for testing
process.env.NODE_ENV = 'test';

// Global test utilities
export const createMockResponse = (options: {
  ok?: boolean;
  status?: number;
  data?: any;
  error?: string;
}) => {
  const { ok = true, status = 200, data, error } = options;
  
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(error || JSON.stringify(data)),
  };
};

export const resetAllMocks = () => {
  jest.clearAllMocks();
};
