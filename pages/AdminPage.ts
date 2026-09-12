import { Locator, Page, expect } from "@playwright/test";

export class AdminPage {
  readonly page: Page;

  readonly adminMenu: Locator;
  readonly usernameSearch: Locator;
  readonly searchButton: Locator;
  readonly tableBody: Locator;

  readonly saveButton: Locator;
  readonly userRoleDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly editUsernameInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.adminMenu = page.getByRole("link", { name: "Admin" });

    // Search form
    this.usernameSearch = page.locator("form input").first();
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.tableBody = page.locator(".oxd-table-body");

    // Edit form
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.userRoleDropdown = page.locator(".oxd-select-text").first();
    this.statusDropdown = page.locator(".oxd-select-text").nth(1);

    this.editUsernameInput = page.locator(
      'xpath=//label[normalize-space()="Username"]/ancestor::div[contains(@class,"oxd-input-group")]//input'
    );
  }

  // Open Admin module
async goToAdmin() {
  await this.adminMenu.click();

  // Wait until Admin page is fully loaded
  await expect(
    this.page.getByRole("heading", { name: "System Users" })
  ).toBeVisible({ timeout: 15000 });

  // Wait for first search input instead of fragile XPath
  await expect(this.page.locator("form input").first()).toBeVisible();
}

  // Search user
  async searchUser(username: string) {
    await this.usernameSearch.fill(username);
    await this.searchButton.click();

    await expect(this.tableBody).toBeVisible();
  }

  // Verify searched user exists
  async verifyUserFound(username: string) {
    const userRow = this.page
      .locator(".oxd-table-body .oxd-table-row")
      .filter({
        has: this.page.getByRole("cell", {
          name: username,
          exact: true,
        }),
      })
      .first();

    await expect(userRow).toBeVisible({ timeout: 10000 });
  }

  // Open Edit page of searched user
  async openEditPage(username: string) {
    const userRow = this.page
      .locator(".oxd-table-body .oxd-table-row")
      .filter({
        has: this.page.getByRole("cell", {
          name: username,
          exact: true,
        }),
      })
      .first();

    await userRow.locator("button").last().click();

    await expect(this.saveButton).toBeVisible();

    await expect(this.editUsernameInput).toHaveValue(username, {
      timeout: 10000,
    });
  }

  // Read current status
  async getCurrentStatus(): Promise<string> {
    await expect(this.statusDropdown).toBeVisible();

    await expect(this.statusDropdown).not.toHaveText("-- Select --", {
      timeout: 10000,
    });

    return (await this.statusDropdown.textContent())?.trim() || "";
  }

  // Toggle status
  async toggleStatus(): Promise<string> {
    const currentStatus = await this.getCurrentStatus();

    const newStatus =
      currentStatus === "Enabled" ? "Disabled" : "Enabled";

    await this.statusDropdown.click();

    await this.page
      .getByRole("option", {
        name: newStatus,
        exact: true,
      })
      .click();

    await expect(this.statusDropdown).toHaveText(newStatus);

    return newStatus;
  }

  // Save changes
  async saveChanges() {
    await this.saveButton.click();

    await expect(this.page.locator(".oxd-toast")).toBeVisible({
      timeout: 10000,
    });
  }
}