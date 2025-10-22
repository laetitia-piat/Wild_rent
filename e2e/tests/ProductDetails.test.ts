import { test, expect } from "@playwright/test";

export const formatDateForTest = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();

  return `${weekday}, ${month} ${day}th,`;
};

test("test click article and add cart", async ({ page }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // current month (0-indexed)

  const startDate = new Date(year, month, 15);
  const endDate = new Date(year, month, 18);

  const startLabel = formatDateForTest(startDate);
  const endLabel = formatDateForTest(endDate);

  await page.goto("http://localhost:7000/produit/1");
  await page
    .getByRole("button", { name: "Début de la location Fin de" })
    .click();
  await page.getByRole("button", { name: startLabel }).click();
  await page.getByRole("button", { name: "Sélectionnez une date" }).click();
  await page.getByRole("button", { name: endLabel }).click();
  await page.getByRole("button", { name: "datebutton" }).click();
  await page.getByText("15€ / jour");
  await page
    .getByLabel("Sélecteur d'options")
    .selectOption('{"id":1,"size":"150 cm"}');
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  await page.goto("http://localhost:7000/");
  await expect(page.getByText("Mon panier")).toBeVisible();
});
