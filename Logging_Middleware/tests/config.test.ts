import { LOG_API_URL, SECRET } from '../src/config';

describe('Config module', () => {
  describe('LOG_API_URL', () => {
    it('should be defined and be a string', () => {
      expect(LOG_API_URL).toBeDefined();
      expect(typeof LOG_API_URL).toBe('string');
    });

    it('should be a valid URL format', () => {
      expect(LOG_API_URL).toMatch(/^https?:\/\/.+/);
    });

    it('should point to the correct evaluation service endpoint', () => {
      expect(LOG_API_URL).toContain('evaluation-service/logs');
    });
  });

  describe('SECRET', () => {
    it('should be defined and be a string', () => {
      expect(SECRET).toBeDefined();
      expect(typeof SECRET).toBe('string');
    });

    it('should not be empty', () => {
      expect(SECRET.length).toBeGreaterThan(0);
    });

    it('should appear to be a JWT token format', () => {
      // JWT tokens have 3 parts separated by dots
      const parts = SECRET.split('.');
      expect(parts).toHaveLength(3);
      
      // Each part should be base64-like (alphanumeric + some special chars)
      parts.forEach(part => {
        expect(part).toMatch(/^[A-Za-z0-9_-]+$/);
      });
    });
  });
});
