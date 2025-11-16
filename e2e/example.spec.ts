import { expect, test } from "@playwright/test";

test("homepage has correct title and content", async ({ page }) => {
  await page.goto("/");

  // Check page title
  await expect(page).toHaveTitle(/Timeline Studio AI/);

  // Check main content is visible
  const main = page.locator("main");
  await expect(main).toBeVisible();

  // Check for Next.js logo
  const logo = page.getByAltText("Next.js logo");
  await expect(logo).toBeVisible();
});

test("greet button interaction", async ({ page }) => {
  await page.goto("/");

  // Find and click the greet button
  const greetButton = page.getByRole("button", {
    name: /Call "greet" from Rust/i,
  });
  await expect(greetButton).toBeVisible();

  await greetButton.click();

  // Wait for response from Rust
  await expect(page.getByText(/Hello world from Rust/i)).toBeVisible({
    timeout: 5000,
  });
});

test("navigation links are present", async ({ page }) => {
  await page.goto("/");

  // Check footer links
  await expect(page.getByRole("link", { name: /Learn/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Examples/i })).toBeVisible();
});
