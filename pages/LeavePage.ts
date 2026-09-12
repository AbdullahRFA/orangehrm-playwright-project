import { Locator, Page, expect } from "@playwright/test";

export class LeavePage {
  readonly page: Page;

  readonly leaveMenu: Locator;
  readonly assignLeaveTab: Locator;
  readonly leaveListTab: Locator;

  readonly employeeInput: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;

  readonly assignButton: Locator;
  readonly searchButton: Locator;

  readonly toast: Locator;
  readonly tableBody: Locator;
  readonly confirmButton: Locator;
  readonly statusRow: Locator;

  constructor(page: Page) {
    this.page = page;

    this.leaveMenu = page.getByRole("link", { name: "Leave" });
    this.assignLeaveTab = page.getByRole("link", { name: "Assign Leave" });
    this.leaveListTab = page.getByRole("link", { name: "Leave List" });

    this.employeeInput = page.getByPlaceholder("Type for hints...");
    this.leaveTypeDropdown = page.locator(".oxd-select-text").first();

    this.fromDateInput = page.locator(
      'xpath=//label[normalize-space()="From Date"]/ancestor::div[contains(@class,"oxd-input-group")]//input'
    );

    this.toDateInput = page.locator(
      'xpath=//label[normalize-space()="To Date"]/ancestor::div[contains(@class,"oxd-input-group")]//input'
    );

    this.assignButton = page.getByRole("button", { name: "Assign" });
    this.searchButton = page.getByRole("button", { name: "Search" });

    this.toast = page.locator(".oxd-toast");
    this.tableBody = page.locator(".oxd-table-body");

    this.confirmButton = page.getByRole("button", {
      name: /Yes, Confirm|Confirm/,
    });

    this.statusRow = page.locator(".oxd-table-body .oxd-table-row").first();
  }

  async goToLeaveModule() {
    await this.leaveMenu.click();
    await expect(this.assignLeaveTab).toBeVisible({ timeout: 15000 });
  }

  async openAssignLeave() {
    await this.assignLeaveTab.click();

    await expect(
      this.page.getByRole("heading", { name: "Assign Leave" })
    ).toBeVisible({ timeout: 15000 });

    await this.page
      .locator(".oxd-form-loader")
      .waitFor({ state: "hidden" })
      .catch(() => {});

    await expect(this.employeeInput).toBeVisible({ timeout: 15000 });
  }

async assignLeaveToValidEmployee(
  fromDate: string,
  toDate: string
): Promise<string | null> {

  const employees = [
    "Linda Anderson",
    "Charles Carter",
    "Karen Cook",
    "Kevin Ryan",
    "Paul Collings",
  ];

  for (const employee of employees) {

    await this.openAssignLeave();

    await this.employeeInput.fill(employee);

    const suggestion = this.page.getByRole("option").first();

    if (!(await suggestion.isVisible({ timeout: 3000 }).catch(() => false))) {
      continue;
    }

    await suggestion.click();

    await this.page.waitForTimeout(800);

    const invalid = await this.page
      .getByText("Invalid Leave Type")
      .isVisible()
      .catch(() => false);

    if (invalid) continue;

    // Open dropdown
    await this.leaveTypeDropdown.click();

    const leaveOption = this.page
      .getByRole("option")
      .filter({ hasNotText: "-- Select --" })
      .first();

    const optionVisible = await leaveOption
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (!optionVisible) {
      continue;
    }

    await leaveOption.click();

    const insufficient = await this.page
      .getByText(/Balance not sufficient|Required Leave Balance/)
      .isVisible()
      .catch(() => false);

    if (insufficient) continue;

    await this.fromDateInput.fill(fromDate);
    await this.toDateInput.fill(toDate);

    await this.assignButton.click();

    if (await this.confirmButton.isVisible().catch(() => false)) {
      await this.confirmButton.click();
    }

    const success = await this.toast
      .isVisible({ timeout: 6000 })
      .catch(() => false);

    if (success) {
      return employee;
    }
  }

  return null;
}
  async openLeaveList() {
    await this.leaveListTab.click();

    await expect(this.searchButton).toBeVisible({ timeout: 15000 });
  }

  async searchEmployeeLeave(employeeName: string) {
    await this.employeeInput.fill(employeeName);

    const option = this.page.getByRole("option").first();

    if (await option.isVisible().catch(() => false)) {
      await option.click();
    }

    await this.searchButton.click();

    await expect(this.tableBody).toBeVisible({ timeout: 15000 });
  }

async cancelLatestLeave(): Promise<boolean> {

  const cancelButton = this.page
    .locator(".oxd-table-body button")
    .filter({ has: this.page.locator("i.bi-x-circle-fill") })
    .first();

  if (!(await cancelButton.isVisible({ timeout: 3000 }).catch(() => false))) {
    return false;
  }

  await cancelButton.click();

  if (await this.confirmButton.isVisible().catch(() => false)) {
    await this.confirmButton.click();
  }

  await expect(this.toast).toBeVisible({ timeout: 10000 });

  return true;
}

  async getLatestStatus() {
    return (await this.statusRow.textContent()) ?? "";
  }
}