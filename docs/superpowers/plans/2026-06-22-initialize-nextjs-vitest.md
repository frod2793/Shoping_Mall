# Next.js and Vitest Initialization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Next.js project from scratch and establish a functional Vitest testing environment with alias support and a verified dummy test.

**Architecture:** Initialize Next.js in the root directory, install Vitest dependencies, configure Vitest using Allman-style bracing config, and test configuring TypeScript aliases.

**Tech Stack:** Next.js (v14.2.3), TypeScript, Vitest, React Testing Library, jsdom, git

---

### Task 1: Next.js Project Initialization

**Files:**
- Create: `/package.json` and standard Next.js directory structure (automatically generated)

- [ ] **Step 1: Run the create-next-app initializer**
  Run: `npx -y create-next-app@14.2.3 ./ --typescript --eslint --src-dir --app --import-alias "@/*" --use-npm`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Next.js project generated successfully with package.json and a src directory.

---

### Task 2: Install Vitest and Testing Dependencies

**Files:**
- Modify: `/package.json`

- [ ] **Step 1: Install testing npm packages**
  Run: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Packages installed successfully without critical peer dependency errors.

---

### Task 3: Configure Vitest

**Files:**
- Create: `/vitest.config.ts`

- [ ] **Step 1: Write Vitest configuration file**
  Create: `/vitest.config.ts` with Allman style braces and 4 spaces indentation.
  Code:
  ```typescript
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  import path from 'path';

  export default defineConfig(
  {
      plugins: [react()],
      test:
      {
          environment: 'jsdom',
          globals: true,
      },
      resolve:
      {
          alias:
          {
              '@': path.resolve(__dirname, './src'),
          },
      },
  });
  ```

---

### Task 4: Add Dummy Test for Verification

**Files:**
- Create: `/src/core/domains/__tests__/dummy.test.ts`

- [ ] **Step 1: Write failing/passing dummy test**
  Create: `/src/core/domains/__tests__/dummy.test.ts` using Allman style.
  Code:
  ```typescript
  import { describe, it, expect } from 'vitest';

  describe('Dummy Test', () =>
  {
      it('should pass', () =>
      {
          expect(1 + 1).toBe(2);
      });
  });
  ```

---

### Task 5: Execute Tests and Verify

**Files:**
- None

- [ ] **Step 1: Run Vitest runner**
  Run: `npx vitest run`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Test runs successfully, and "Dummy Test > should pass" output shows PASS.

---

### Task 6: Initialize Git and Commit

**Files:**
- Create/Modify: git files (.git, tracked files)

- [ ] **Step 1: Initialize repository and commit initial progress**
  Run: `git init && git add . && git commit -m "chore: initialize next.js and vitest testing environment"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful git repository initialization and the initial commit of all files.
