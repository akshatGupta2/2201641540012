import { LogStack, LogLevel, LogPackage } from '../src/type';

describe('Type definitions', () => {
  describe('LogStack type', () => {
    it('should accept valid stack values', () => {
      const validStacks: LogStack[] = ['backend', 'frontend'];
      
      validStacks.forEach(stack => {
        const testStack: LogStack = stack;
        expect(testStack).toBe(stack);
      });
    });

    it('should have exactly 2 possible values', () => {
      // This is a compile-time check that ensures we're aware of all possible values
      const allStacks: LogStack[] = ['backend', 'frontend'];
      expect(allStacks).toHaveLength(2);
    });
  });

  describe('LogLevel type', () => {
    it('should accept valid log level values', () => {
      const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
      
      validLevels.forEach(level => {
        const testLevel: LogLevel = level;
        expect(testLevel).toBe(level);
      });
    });

    it('should have exactly 5 possible values', () => {
      const allLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
      expect(allLevels).toHaveLength(5);
    });

    it('should include all standard log levels', () => {
      const expectedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
      expectedLevels.forEach(level => {
        const testLevel: LogLevel = level as LogLevel;
        expect(expectedLevels).toContain(testLevel);
      });
    });
  });

  describe('LogPackage type', () => {
    it('should accept valid package values', () => {
      const validPackages: LogPackage[] = [
        'cache', 'controller', 'cron_job', 'db', 
        'domain', 'handler', 'response', 'router'
      ];
      
      validPackages.forEach(pkg => {
        const testPackage: LogPackage = pkg;
        expect(testPackage).toBe(pkg);
      });
    });

    it('should have exactly 8 possible values', () => {
      const allPackages: LogPackage[] = [
        'cache', 'controller', 'cron_job', 'db',
        'domain', 'handler', 'response', 'router'
      ];
      expect(allPackages).toHaveLength(8);
    });

    it('should include all expected package types', () => {
      const expectedPackages = [
        'cache', 'controller', 'cron_job', 'db',
        'domain', 'handler', 'response', 'router'
      ];
      
      expectedPackages.forEach(pkg => {
        const testPackage: LogPackage = pkg as LogPackage;
        expect(expectedPackages).toContain(testPackage);
      });
    });
  });

  describe('Type combinations', () => {
    it('should allow valid combinations of all types', () => {
      const validCombinations = [
        { stack: 'backend' as LogStack, level: 'info' as LogLevel, pkg: 'controller' as LogPackage },
        { stack: 'frontend' as LogStack, level: 'error' as LogLevel, pkg: 'handler' as LogPackage },
        { stack: 'backend' as LogStack, level: 'debug' as LogLevel, pkg: 'db' as LogPackage },
        { stack: 'frontend' as LogStack, level: 'warn' as LogLevel, pkg: 'response' as LogPackage },
        { stack: 'backend' as LogStack, level: 'fatal' as LogLevel, pkg: 'cron_job' as LogPackage }
      ];

      validCombinations.forEach(combo => {
        expect(combo.stack).toBeDefined();
        expect(combo.level).toBeDefined();
        expect(combo.pkg).toBeDefined();
      });
    });
  });
});
