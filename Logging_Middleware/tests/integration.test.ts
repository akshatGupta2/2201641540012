import { Log } from '../src/logger';
import { LOG_API_URL } from '../src/config';

// Mock fetch for integration tests
global.fetch = jest.fn();

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('End-to-end logging workflow', () => {
    it('should complete full logging workflow for successful request', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ success: true })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await Log('backend', 'info', 'controller', 'Integration test message');

      // Assert - Verify the complete flow
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        LOG_API_URL,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringMatching(/^Bearer .+/)
          }),
          body: expect.stringContaining('Integration test message')
        })
      );
      expect(mockConsoleLog).toHaveBeenCalledWith('Message logged successfully');
    });

    it('should handle complete error workflow', async () => {
      // Arrange
      const errorMessage = 'Server temporarily unavailable';
      const mockResponse = {
        ok: false,
        status: 503,
        text: jest.fn().mockResolvedValue(errorMessage)
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await Log('frontend', 'error', 'handler', 'Error integration test');

      // Assert - Verify error handling flow
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockResponse.text).toHaveBeenCalled();
      expect(mockConsoleLog).toHaveBeenCalledWith(`Failed: ${errorMessage}`);
    });

    it('should handle network failure workflow', async () => {
      // Arrange
      const networkError = new Error('ECONNREFUSED');
      (fetch as jest.Mock).mockRejectedValue(networkError);

      // Act
      await Log('backend', 'fatal', 'db', 'Network failure test');

      // Assert - Verify exception handling flow
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockConsoleError).toHaveBeenCalledWith('Error logging message:', networkError);
    });
  });

  describe('Multiple concurrent requests', () => {
    it('should handle multiple simultaneous log requests', async () => {
      // Arrange
      const mockResponse = { ok: true, status: 200 };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const logPromises = [
        Log('backend', 'info', 'controller', 'Message 1'),
        Log('frontend', 'warn', 'handler', 'Message 2'),
        Log('backend', 'error', 'db', 'Message 3'),
        Log('frontend', 'debug', 'response', 'Message 4')
      ];

      // Act
      await Promise.all(logPromises);

      // Assert
      expect(fetch).toHaveBeenCalledTimes(4);
      expect(mockConsoleLog).toHaveBeenCalledTimes(4);
    });

    it('should handle mixed success and failure scenarios', async () => {
      // Arrange - Set up different responses for each call
      const responses = [
        { ok: true, status: 200 },
        { ok: false, status: 400, text: jest.fn().mockResolvedValue('Bad request') },
        { ok: true, status: 200 },
        new Error('Network error')
      ];

      (fetch as jest.Mock)
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2])
        .mockRejectedValueOnce(responses[3]);

      // Act
      await Promise.all([
        Log('backend', 'info', 'controller', 'Success 1'),
        Log('frontend', 'warn', 'handler', 'Failure 1'),
        Log('backend', 'info', 'db', 'Success 2'),
        Log('frontend', 'error', 'response', 'Network failure')
      ]);

      // Assert
      expect(fetch).toHaveBeenCalledTimes(4);
      expect(mockConsoleLog).toHaveBeenCalledWith('Message logged successfully');
      expect(mockConsoleLog).toHaveBeenCalledWith('Failed: Bad request');
      expect(mockConsoleError).toHaveBeenCalledWith('Error logging message:', responses[3]);
    });
  });
});
