# Logging Middleware

A TypeScript-based logging middleware that sends structured log messages to a remote API endpoint.

## Features

- Type-safe logging with predefined log levels, stacks, and packages
- HTTP-based log transmission to remote API
- Comprehensive error handling
- Full test coverage with Jest

## Installation

```bash
npm install
```

## Usage

```typescript
import { Log } from './src/logger';

// Log a message
await Log('backend', 'info', 'controller', 'User authentication successful');
await Log('frontend', 'error', 'handler', 'Failed to load user data');
```

### Available Types

- **LogStack**: `'backend' | 'frontend'`
- **LogLevel**: `'debug' | 'info' | 'warn' | 'error' | 'fatal'`
- **LogPackage**: `'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'response' | 'router'`

## Testing

Run the complete test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- `tests/logger.test.ts` - Unit tests for the main Log function
- `tests/config.test.ts` - Tests for configuration values
- `tests/types.test.ts` - Type definition validation tests
- `tests/integration.test.ts` - End-to-end integration tests
- `tests/setup.ts` - Global test setup and utilities

### Test Coverage

The test suite covers:

- ✅ Successful API responses
- ✅ HTTP error responses (4xx, 5xx)
- ✅ Network connection failures
- ✅ Request formatting and headers
- ✅ All log levels, stacks, and packages
- ✅ Edge cases (empty messages, special characters)
- ✅ Concurrent logging scenarios
- ✅ Type safety validation

## Configuration

Update `src/config.ts` with your API endpoint and authentication token:

```typescript
export const LOG_API_URL: string = 'your-api-endpoint';
export const SECRET: string = 'your-jwt-token';
```

## Development

```bash
# Install dependencies
npm install

# Run TypeScript compiler
npx tsc

# Run tests
npm test
```