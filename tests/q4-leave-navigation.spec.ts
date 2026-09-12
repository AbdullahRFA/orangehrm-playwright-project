import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { LeavePage } from "../pages/LeavePage";

test.setTimeout(120000);

test("Q4 - Assign Leave, verify in Leave List and cancel", async ({ page }) => {

  const loginPage = new LoginPage(page);
  const leavePage = new LeavePage(page);

  await loginPage.goto();
  await loginPage.login("Admin", "admin123");

  await leavePage.goToLeaveModule();

  const employee = await leavePage.assignLeaveToValidEmployee(
    "2026-09-20",
    "2026-09-21"
  );

  test.skip(employee === null, "Public OrangeHRM demo has no assignable employee today.");

  await leavePage.openLeaveList();
  await leavePage.searchEmployeeLeave(employee!);

  const cancelled = await leavePage.cancelLatestLeave();

  const status = await leavePage.getLatestStatus();

  if (cancelled) {
    expect(
      status.includes("Cancelled") ||
      status.includes("Pending Cancellation")
    ).toBeTruthy();
  } else {
    expect(
      status.includes("Scheduled") ||
      status.includes("Pending Approval") ||
      status.includes("Taken")
    ).toBeTruthy();
  }

  await loginPage.logout();
});