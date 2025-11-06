# API Contracts

This directory contains API contract definitions for the authentication module packages.

## Contract Types

### 1. TypeScript Interfaces (`interfaces.ts`)
Core TypeScript type definitions for all auth package APIs. These serve as the contract between packages and consuming applications.

### 2. Zod Validation Schemas (`schemas.ts`)
Runtime validation schemas that enforce the TypeScript contracts at package boundaries.

### 3. Package Exports (`exports.md`)
Documentation of what each `@auth/*` package exports and guarantees to consumers.

## Contract Principles

1. **Backward Compatibility**: Breaking changes require major version bumps
2. **Runtime Validation**: All inputs validated with Zod at package boundaries
3. **Type Safety**: TypeScript types inferred from Zod schemas (single source of truth)
4. **Clear Errors**: Validation failures include actionable error messages
5. **Platform Agnostic**: Core contracts work on both web and React Native

## Contract Testing

All contracts are validated with contract tests in each package's `__tests__/contract/` directory.

See `api-contract.test.ts` examples in package test suites.
