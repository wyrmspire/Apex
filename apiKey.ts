/**
 * @fileoverview Centralized API key configuration.
 *
 * To facilitate local development, you can temporarily replace `process.env.API_KEY`
 * with your actual API key string in this file.
 *
 * For example:
 * export const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
 *
 * IMPORTANT: In a real-world scenario with a version control system (like Git),
 * this file should be added to .gitignore to prevent accidentally committing your
 * secret API key.
 */
export const GEMINI_API_KEY = process.env.API_KEY;
