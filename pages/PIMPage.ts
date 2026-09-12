import { Locator, Page, expect } from "@playwright/test";

export class PIMPage {
  readonly page: Page;

  readonly employeeIdSearch: Locator;

  readonly pimMenu: Locator;
  readonly addEmployeeButton: Locator;
  readonly employeeListMenu: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;

  readonly employeeNameSearch: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.employeeIdSearch = page.locator(
      'xpath=(//input[contains(@class,"oxd-input")])[2]',
    );

    this.pimMenu = page.getByRole("link", { name: "PIM" });
    this.addEmployeeButton = page.getByRole("link", { name: "Add Employee" });
    this.employeeListMenu = page.getByRole("link", { name: "Employee List" });

    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = this.page.locator(
      'xpath=//label[normalize-space()="Employee Id"]/ancestor::div[contains(@class,"oxd-input-group")]//input',
    );
    this.saveButton = page.getByRole("button", { name: "Save" });

    this.employeeIdSearch = page.locator(
  'xpath=//label[normalize-space()="Employee Id"]/ancestor::div[contains(@class,"oxd-input-group")]//input'
);
    this.searchButton = page.getByRole("button", { name: "Search" });
  }

  async goToPIM() {
    await this.pimMenu.click();
    await expect(this.addEmployeeButton).toBeVisible();
  }

  async addEmployee(firstName: string, lastName: string, employeeId: string) {
    await this.addEmployeeButton.click();

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);

    await expect(this.employeeIdInput).toBeVisible();

    await this.employeeIdInput.press("Meta+A");
    await this.employeeIdInput.fill(employeeId);

    await this.saveButton.click();

    // Wait until Personal Details page opens
    await expect(
      this.page.getByRole("heading", { name: "Personal Details" }),
    ).toBeVisible({ timeout: 15000 });
  }

  async openEmployeeList() {
    await this.employeeListMenu.click();
  }

  async searchEmployee(employeeId: string) {
    await this.employeeIdSearch.fill(employeeId);
    await this.searchButton.click();

    await expect(this.page.locator(".oxd-table-body")).toBeVisible();
  }

  async verifyEmployeeExists(employeeId: string) {
    await expect(this.page.getByRole("cell", { name: employeeId })).toBeVisible(
      {
        timeout: 10000,
      },
    );
  }
}
