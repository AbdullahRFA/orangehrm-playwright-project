
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PIMPage } from '../pages/PIMPage';
import { generateEmployee } from '../utils/testData';

test.setTimeout(90000);

test('Q2 - Add a new employee and verify from Employee List', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pimPage = new PIMPage(page);

  // Generate random employee data
  const employee = generateEmployee();
  const fullName = `${employee.firstName} ${employee.lastName}`;

  // Login
  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');

  // Navigate to PIM
  await pimPage.goToPIM();

  // Add Employee
  await pimPage.addEmployee(
    employee.firstName,
    employee.lastName,
    employee.employeeId
  );

  // Go to Employee List
  await pimPage.openEmployeeList();

  // Search Employee
  await pimPage.searchEmployee(employee.employeeId);


  // Verify Employee
  await pimPage.verifyEmployeeExists(employee.employeeId);

  // Logout
  await loginPage.logout();
});