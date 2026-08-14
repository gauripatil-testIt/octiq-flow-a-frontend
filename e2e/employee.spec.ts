import { test, expect } from '@playwright/test'

test.describe('Employee E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/employees')
  })

  test('list page loads', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Employees' })).toBeVisible()
  })

  test('create link is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /new employee/i })).toBeVisible()
  })

  test('navigates to create form', async ({ page }) => {
    await page.getByRole('link', { name: /new employee/i }).click()
    await expect(page).toHaveURL(/\/employees\/create/)
    await expect(page.getByRole('heading', { name: /new employee/i })).toBeVisible()
  })

  test('back link returns to list', async ({ page }) => {
    await page.goto('/employees/create')
    await page.getByRole('link', { name: /cancel|back/i }).click()
    await expect(page).toHaveURL(/\/employees$/)
  })
})
