import { Log } from '../src/logger';
import { LOG_API_URL, SECRET } from '../src/config';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid cluttering test output
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('Log function', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore console methods after all tests
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('successful logging', () => {
    it('should log message successfully when API responds with ok status', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue('Success')
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await Log('backend', 'info', 'controller', 'Test message');

      // Assert
      expect(fetch).toHaveBeenCalledWith(LOG_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SECRET}`
        },
        body: JSON.stringify({
          stack: 'backend',
          level: 'info',
          pkg: 'controller',
          message: 'Test message'
        })
      });
      expect(mockConsoleLog).toHaveBeenCalledWith('Message logged successfully');
    });

    it('should handle different log levels correctly', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const logLevels = ['debug', 'info', 'warn', 'error', 'fatal'] as const;
      
      for (const level of logLevels) {
        await Log('frontend', level, 'handler', `Test ${level} message`);
        
        expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
          body: JSON.stringify({
            stack: 'frontend',
            level: level,
            pkg: 'handler',
            message: `Test ${level} message`
          })
        }));
      }
    });

    it('should handle different stack types correctly', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const stacks = ['backend', 'frontend'] as const;
      
      for (const stack of stacks) {
        await Log(stack, 'info', 'db', `Test ${stack} message`);
        
        expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
          body: JSON.stringify({
            stack: stack,
            level: 'info',
            pkg: 'db',
            message: `Test ${stack} message`
          })
        }));
      }
    });

    it('should handle different package types correctly', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const packages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'response', 'router'] as const;
      
      for (const pkg of packages) {
        await Log('backend', 'info', pkg, `Test ${pkg} message`);
        
        expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
          body: JSON.stringify({
            stack: 'backend',
            level: 'info',
            pkg: pkg,
            message: `Test ${pkg} message`
          })
        }));
      }
    });
  });

  describe('failed logging', () => {
    it('should handle API error responses', async () => {
      // Arrange
      const errorMessage = 'Invalid request format';
      const mockResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue(errorMessage)
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await Log('backend', 'error', 'controller', 'Test error message');

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockResponse.text).toHaveBeenCalled();
      expect(mockConsoleLog).toHaveBeenCalledWith(`Failed: ${errorMessage}`);
    });

    it('should handle different HTTP error status codes', async () => {
      const errorCodes = [400, 401, 403, 404, 500, 502, 503];
      
      for (const statusCode of errorCodes) {
        const mockResponse = {
          ok: false,
          status: statusCode,
          text: jest.fn().mockResolvedValue(`Error ${statusCode}`)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        await Log('backend', 'error', 'controller', `Test ${statusCode} error`);
        
        expect(mockConsoleLog).toHaveBeenCalledWith(`Failed: Error ${statusCode}`);
      }
    });
  });

  describe('network errors', () => {
    it('should handle network connection errors', async () => {
      // Arrange
      const networkError = new Error('Network connection failed');
      (fetch as jest.Mock).mockRejectedValue(networkError);

      // Act
      await Log('backend', 'error', 'controller', 'Test network error');

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockConsoleError).toHaveBeenCalledWith('Error logging message:', networkError);
    });

    it('should handle timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Request timeout');
      (fetch as jest.Mock).mockRejectedValue(timeoutError);

      // Act
      await Log('frontend', 'warn', 'handler', 'Test timeout');

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith('Error logging message:', timeoutError);
    });
  });

  describe('edge cases', () => {
    it('should handle empty message strings', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await Log('backend', 'info', 'controller', '');

      expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
        body: JSON.stringify({
          stack: 'backend',
          level: 'info',
          pkg: 'controller',
          message: ''
        })
      }));
    });

    it('should handle very long message strings', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const longMessage = 'A'.repeat(10000);
      await Log('backend', 'info', 'controller', longMessage);

      expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
        body: JSON.stringify({
          stack: 'backend',
          level: 'info',
          pkg: 'controller',
          message: longMessage
        })
      }));
    });

    it('should handle special characters in messages', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const specialMessage = 'Test with special chars: 🚀 ñáéíóú "quotes" \'apostrophes\' & symbols';
      await Log('frontend', 'debug', 'response', specialMessage);

      expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
        body: JSON.stringify({
          stack: 'frontend',
          level: 'debug',
          pkg: 'response',
          message: specialMessage
        })
      }));
    });
  });

  describe('request headers and format', () => {
    it('should include correct Content-Type header', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await Log('backend', 'info', 'controller', 'Test message');

      expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      }));
    });

    it('should include correct Authorization header', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await Log('backend', 'info', 'controller', 'Test message');

      expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${SECRET}`
        })
      }));
    });

    it('should use POST method', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await Log('backend', 'info', 'controller', 'Test message');

      expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
        method: 'POST'
      }));
    });

    it('should send properly formatted JSON body', async () => {
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await Log('backend', 'warn', 'domain', 'JSON test message');

      const expectedBody = JSON.stringify({
        stack: 'backend',
        level: 'warn',
        pkg: 'domain',
        message: 'JSON test message'
      });

      expect(fetch).toHaveBeenCalledWith(LOG_API_URL, expect.objectContaining({
        body: expectedBody
      }));
    });
  });
});
