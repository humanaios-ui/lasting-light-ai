```markdown
# lasting-light-ai Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `lasting-light-ai` JavaScript codebase. You'll learn how to structure files, write imports/exports, follow commit message conventions, and understand the project's testing patterns. This guide is ideal for contributors aiming for consistency and maintainability in a non-framework JavaScript project.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.
  - Example:  
    ```
    user-profile.js
    data-fetcher.test.js
    ```

### Import Style
- Always use **relative imports**.
  - Example:
    ```javascript
    import { fetchData } from './data-fetcher.js';
    ```

### Export Style
- Use **named exports** exclusively.
  - Example:
    ```javascript
    // In data-fetcher.js
    export function fetchData() { ... }
    ```
    ```javascript
    // In another file
    import { fetchData } from './data-fetcher.js';
    ```

### Commit Messages
- Follow **Conventional Commits** with the `fix` prefix.
- Keep commit messages concise (average ~48 characters).
  - Example:
    ```
    fix: handle null values in response parser
    ```

## Workflows

### Making a Code Change
**Trigger:** When you need to fix a bug or update logic  
**Command:** `/code-change`

1. Create or update files using kebab-case naming.
2. Use relative imports and named exports in your modules.
3. Write or update tests in files matching `*.test.*`.
4. Commit your changes using the `fix:` prefix and a short, descriptive message.
    - Example: `fix: correct typo in user-profile validation`
5. Push your branch and open a pull request.

### Writing a Test
**Trigger:** When adding or updating functionality  
**Command:** `/write-test`

1. Create a test file named with the pattern `*.test.js` (e.g., `user-profile.test.js`).
2. Write your tests using the project's chosen (unknown) framework.
3. Ensure tests cover both typical and edge cases.
4. Run tests locally to verify correctness.

## Testing Patterns

- **Test File Naming:**  
  Test files use the `*.test.*` pattern, e.g., `feature-name.test.js`.
- **Framework:**  
  The specific testing framework is not detected; follow existing patterns in the repo.
- **Placement:**  
  Place test files alongside or near the modules they test.

## Commands
| Command        | Purpose                                         |
|----------------|-------------------------------------------------|
| /code-change   | Guide for making a code change                  |
| /write-test    | Steps for writing and placing a new test        |
```