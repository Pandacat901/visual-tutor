import { expect, test } from "@playwright/test";

test("opens a guided visual lesson and adapts after a comprehension check", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Visually/);
  await expect(page.getByRole("heading", { name: /Don’t just tell me/i })).toBeVisible();

  await page.getByRole("button", { name: "Factor a quadratic" }).click();
  await expect(page.getByText("Today’s board")).toBeVisible();
  await expect(page.getByText("Choose the split that preserves −7x")).toBeVisible();

  await page.getByRole("button", { name: /−6x − x/ }).click();
  await expect(page.getByText("Nice. The board has the next move.")).toBeVisible();

  await page.getByLabel("Ask about anything on the board").fill("Why can we factor by grouping?");
  await page.getByRole("button", { name: "Ask follow-up" }).click();
  await expect(page.getByText(/Why can we factor by grouping/)).toBeVisible({ timeout: 5_000 });
});
