import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.setTimeout(60000);

test("Q1 - Invalid login should display error message", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("wrongAdmin", "wrongPassword");
  await loginPage.verifyInvalidCredentials();
});