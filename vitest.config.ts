import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,ts,jsx,tsx}'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
