import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');

    // Stable locator
    this.errorMessage = page.getByText("Invalid credentials", { exact: true });

    this.userDropdown = page.locator(".oxd-userdropdown-tab");
    this.logoutButton = page.getByRole("menuitem", { name: "Logout" });
  }

  async goto() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      },
    );

    await expect(this.usernameInput).toBeVisible({ timeout: 30000 });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    await Promise.all([
      this.page.waitForLoadState("networkidle").catch(() => {}),
      this.loginButton.click(),
    ]);
  }

  // async verifyInvalidCredentials() {
  //   // Wait until redirected back to login page
  //   await this.page.waitForURL(/\/auth\/login$/, { timeout: 15000 });

  //   // Verify error message
  //   await expect(this.errorMessage).toBeVisible({ timeout: 15000 });
  //   await expect(this.errorMessage).toHaveText("Invalid credentials");
  // }

  async verifyInvalidCredentials() {
    await this.page.waitForURL(/\/auth\/login$/, { timeout: 15000 });

    await expect(this.page.locator(".oxd-alert-content")).toContainText(
      "Invalid credentials",
      { timeout: 15000 },
    );
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutButton.click();

    await expect(this.loginButton).toBeVisible({ timeout: 15000 });
  }
}
