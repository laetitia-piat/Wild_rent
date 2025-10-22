import { test, expect } from "@playwright/test";
import axios from "axios";
import "dotenv/config";

const baseUrl = "http://localhost:7000/";

const API_KEY = process.env.TEST_MAIL_API_KEY;
const namespace = process.env.TEST_MAIL_NAMESPACE;

test("register and login", async ({ page }) => {
  // Enregistre l'utilisateur avec l'adresse du compte testmail
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Connexion" }).click();
  await page.getByRole("link", { name: "Inscrivez-vous ici" }).click();
  await page.getByRole("textbox", { name: "Prénom" }).click();
  await page.getByRole("textbox", { name: "Prénom" }).fill("Test");
  await page.getByRole("textbox", { name: "Nom de famille" }).click();
  await page.getByRole("textbox", { name: "Nom de famille" }).fill("Test");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(`${namespace}.test@inbox.testmail.app`);
  await page.getByRole("textbox", { name: "Numéro de téléphone" }).click();
  await page
    .getByRole("textbox", { name: "Numéro de téléphone" })
    .fill("066666666");
  await page.getByRole("textbox", { name: "Mot de passe" }).click();
  await page.getByRole("textbox", { name: "Mot de passe" }).fill("password");
  await page.getByRole("button", { name: "S'inscrire" }).click();

  await expect(page.getByText("Consultez vos emails afin de")).toBeVisible();

  // Retrouve le dernier email envoyé à l'adresse testmail
  let link = "";
  const res = await axios.get("https://api.testmail.app/api/json", {
    params: {
      apikey: API_KEY,
      namespace: namespace,
      livequery: "true",
      timestamp_from: Date.now(),
    },
  });

  // Permet de retrouver l'URL de confirmation dans la réponse de l'objet
  if (res.data.emails && res.data.emails.length > 0) {
    const email = res.data.emails[0];
    link = email.text.split("\n")[2];
  }

  // Navigue jusqu'à l'URL et clique sur le bouton de création de compte
  await page.goto(link);
  await page.getByRole("button", { name: "Créer votre compte" }).click();

  await expect(page.getByText("Votre compte a été créé avec")).toBeVisible();

  // Connecte l'utilisateur avec les données renseignées auparavant
  await page.getByRole("link", { name: "Connexion" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(`${namespace}.test@inbox.testmail.app`);
  await page.getByRole("textbox", { name: "Mot de passe" }).click();
  await page.getByRole("textbox", { name: "Mot de passe" }).fill("password");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(
    page.getByRole("link", { name: "Mon compte" })
  ).toBeVisible();
});
