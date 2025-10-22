import { test, expect } from "@playwright/test";

test("login", async ({ page }) => {
  await page.goto("http://localhost:7000/login");

  await page
    .getByRole("textbox", { name: "Email" })
    .fill("jonsnow@wild-rent.com");

  await page.getByRole("textbox", { name: "Mot de passe" }).fill("password");

  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(
    page.getByRole("link", { name: "Mon compte" })
  ).toBeVisible();
});
