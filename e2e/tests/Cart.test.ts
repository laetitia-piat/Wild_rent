import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:7000";

export const formatDateForTest = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();

  return `${weekday}, ${month} ${day}th,`;
};

test("Panier : ajout produit, sélection dates, modification quantité, suppression", async ({
  page,
}) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // current month (0-indexed)

  const startDate = new Date(year, month, 15);
  const endDate = new Date(year, month, 18);

  const startLabel = formatDateForTest(startDate);
  const endLabel = formatDateForTest(endDate);

  await page.goto(`${baseUrl}/produit/1`);
  await page
    .getByRole("button", { name: "Début de la location Fin de" })
    .click();
  await page.getByRole("button", { name: startLabel }).click();
  await page.getByRole("button", { name: "Sélectionnez une date" }).click();
  await page.getByRole("button", { name: endLabel }).click();
  await page.getByRole("button", { name: "datebutton" }).click();

  await page
    .getByLabel("Sélecteur d'options")
    .selectOption('{"id":1,"size":"150 cm"}');

  await page.getByRole("button", { name: "Ajouter au panier" }).click();

  await page.getByRole("link", { name: "Mon panier" }).click();

  await expect(page.getByText("Total: 45€")).toBeVisible();

  await page.getByRole("button", { name: "+" }).click();
  await expect(page.getByLabel("quantity")).toHaveText("2");

  await expect(page.getByText("Total: 90€")).toBeVisible();

  // Diminue la quantité
  await page.getByRole("button", { name: "-" }).click();
  await expect(page.getByLabel("quantity")).toHaveText("1");

  // Supprime le produit
  await page.getByRole("button", { name: "corbeille" }).click();

  // Vérifie que le panier est vide
  await expect(page.getByText("Votre panier est vide")).toBeVisible();
});
