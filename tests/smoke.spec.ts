import { expect, test } from "@playwright/test";

test("opens a guided visual lesson and adapts after a comprehension check", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Visually/);
  await expect(page.getByRole("heading", { name: /Don’t just tell me/i })).toBeVisible();

  await page.getByRole("button", { name: "Factor a quadratic" }).click();
  await expect(page.getByText("Today’s board")).toBeVisible();
  await expect(page.getByText("Choose the split that preserves −7x")).toBeVisible();

  const marker = page.locator(".drawing-cursor");
  await expect(marker).toBeVisible();
  const firstPosition = await marker.boundingBox();
  await page.waitForTimeout(450);
  const secondPosition = await marker.boundingBox();
  expect(firstPosition).not.toBeNull();
  expect(secondPosition).not.toBeNull();
  expect(secondPosition?.x).not.toBe(firstPosition?.x);

  await page.getByRole("button", { name: /−6x − x/ }).click();
  await expect(page.getByText("Nice. The board has the next move.")).toBeVisible();

  await page.getByLabel("Ask about anything on the board").fill("Why can we factor by grouping?");
  await page.getByRole("button", { name: "Ask follow-up" }).click();
  await expect(page.getByLabel("Ask about anything on the board")).toHaveValue("");
});
