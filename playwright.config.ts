import { defineConfig, devices } from '@playwright/test';

/**
 * Lee las variables de entorno desde el archivo .env si es necesario.
 * require('dotenv').config();
 */

export default defineConfig({
  testDir: './tests-e2e', // Apunta a la carpeta que elegimos para los tests E2E
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  /* Fallar si dejamos un test.only en el código por accidente en CI */
  forbidOnly: Boolean(process.env.CI),
  /* Reintentar en CI solamente */
  retries: process.env.CI ? 2 : 0,
  /* Optar por no usar workers paralelos en CI si es necesario */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter para usar en HTML */
  reporter: 'html',

  /* Configuración compartida para todos los proyectos */
  use: {
    /* URL base para usar en los tests (ej: await page.goto('/')) */
    baseURL: 'http://127.0.0.1:3000',

    /* Recolectar trazas cuando falla un test (muy útil para depurar) */
    trace: 'on-first-retry',
  },

  /* Configuración de proyectos para navegadores principales */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Puedes agregar Mobile Chrome, Safari, etc. aquí si lo necesitas */
  ],

  /* Ejecutar tu servidor de desarrollo local antes de iniciar los tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Esperar hasta 2 mins a que arranque (útil en primera carga)
  },
});
