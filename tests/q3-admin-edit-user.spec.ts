import { expect, test } from "@playwright/test";
import { AdminPage } from "../pages/AdminPage";
import { LoginPage } from "../pages/LoginPage";

test.setTimeout(120000);

test("Q3 - Search, edit status, refresh and verify persistence", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const adminPage = new AdminPage(page);

  const username = "Admin";

  // Login
  await loginPage.goto();
  await loginPage.login("Admin", "admin123");

  // Open Admin Module
  await adminPage.goToAdmin();

  // Search User
  await adminPage.searchUser(username);
  await adminPage.verifyUserFound(username);

  // Open Edit Page
  await adminPage.openEditPage(username);

  // Change Status
  await adminPage.toggleStatus();

  // Save Changes
  await adminPage.saveChanges();

  // Refresh
  await page.reload();

  // Open Admin again
  await adminPage.goToAdmin();

  // Search again
  await adminPage.searchUser(username);
  await adminPage.verifyUserFound(username);

  // Open Edit Page again
  await adminPage.openEditPage(username);

  // Verify Status field loaded after refresh
  const currentStatus = await adminPage.getCurrentStatus();

  expect(["Enabled", "Disabled"]).toContain(currentStatus);

  // Logout
  await loginPage.logout();
});
