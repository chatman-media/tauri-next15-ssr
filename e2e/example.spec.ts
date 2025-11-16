import { expect, test } from "@playwright/test";

test("homepage renders main content", async ({ page }) => {
  await page.goto("/");

  // Check main content is visible
  const main = page.locator("main");
  await expect(main).toBeVisible();

  // Check initial text is visible
  await expect(
    page.getByText("Click the button to call the Rust function"),
  ).toBeVisible();
});

test("greet button is visible and clickable", async ({ page }) => {
  await page.goto("/");

  // Find the greet button
  const greetButton = page.getByRole("button", {
    name: /Call "greet" from Rust/i,
  });
  await expect(greetButton).toBeVisible();

  // Button should be clickable
  await expect(greetButton).toBeEnabled();
});
