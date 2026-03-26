import { test, expect } from "@playwright/test";

test.describe("認証フロー", () => {
  test("未ログインで /dashboard にアクセスすると /login にリダイレクトされる", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("ログインページに Google と GitHub のボタンが表示される", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Google でログイン")).toBeVisible();
    await expect(page.getByText("GitHub でログイン")).toBeVisible();
  });

  test("404 ページが表示される", async ({ page }) => {
    await page.goto("/存在しないページ");
    await expect(page.getByText("404")).toBeVisible();
  });
});
