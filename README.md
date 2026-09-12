# OrangeHRM QA Automation Project

A comprehensive QA Automation project for the **OrangeHRM Open Source Demo** application developed using **Playwright with Page Object Model (POM)**. The project covers UI Automation, Manual Testing, GitHub Workflow, and API Automation as required by the assessment.

## Project Overview

This repository contains solutions for a **100-mark QA Assessment** consisting of:

| Part   | Description                       | Marks |
| ------ | --------------------------------- | ----: |
| Part A | UI Automation (Playwright + POM)  |    50 |
| Part B | Manual Testing                    |    20 |
| Part C | GitHub Workflow                   |    10 |
| Part D | API Automation (Postman + Newman) |    20 |

**Target Application**

* **UI:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
* **API:** https://jsonplaceholder.typicode.com/users

---

## Tech Stack

| Technology               | Purpose                    |
| ------------------------ | -------------------------- |
| Playwright               | UI Automation              |
| TypeScript               | Test Development           |
| Page Object Model        | Test Design Pattern        |
| Playwright HTML Reporter | UI Report                  |
| Allure Reporter          | Advanced Test Reporting    |
| Postman                  | API Automation             |
| Newman                   | Command-line API Execution |
| Git & GitHub             | Version Control            |
| Excel                    | Manual Test Cases          |

---

## Project Structure

```text
orangehrm-playwright-project/
│
├── pages/
│   ├── LoginPage.ts
│   ├── PIMPage.ts
│   ├── AdminPage.ts
│   └── LeavePage.ts
│
├── tests/
│   ├── q1-invalid-login.spec.ts
│   ├── q2-add-employee.spec.ts
│   ├── q3-admin-edit-user.spec.ts
│   └── q4-leave-navigation.spec.ts
│
├── API_Automation/
│   ├── OrangeHRM_API_Assignment.postman_collection.json
│   └── OrangeHRM_API_Environment.postman_environment.json
│
├── manual-tests/
│   ├── OrangeHRM_Manual_Test_Cases.xlsx
│   └── Bug_Report.pdf
│
├── reports/
│   └── newman-report.html
│
├── playwright-report/
├── allure-results/
├── allure-report/
│
├── package.json
├── playwright.config.ts
└── README.md
```

---

# Part A – UI Automation

The automation framework follows the **Page Object Model (POM)** design pattern.

## Implemented Test Scenarios

### Q1 – Invalid Login

**Scenario**

* Open login page
* Enter invalid username and password
* Verify error message appears

**Run**

```bash
npx playwright test tests/q1-invalid-login.spec.ts --project=chromium --headed --workers=1
```

---

### Q2 – Add Employee

**Scenario**

* Login with Admin
* Navigate to PIM
* Create employee using random data
* Search employee
* Verify employee exists
* Logout

**Run**

```bash
npx playwright test tests/q2-add-employee.spec.ts --project=chromium --headed --workers=1
```

---

### Q3 – Admin User Edit

**Scenario**

* Login
* Navigate to Admin
* Search user
* Edit user role/status
* Save
* Refresh page
* Verify changes persist

**Run**

```bash
npx playwright test tests/q3-admin-edit-user.spec.ts --project=chromium --headed --workers=1
```

---

### Q4 – Leave Module Navigation

**Scenario**

* Login
* Navigate to Leave
* Attempt leave assignment
* Verify Leave List
* Cancel leave (when available)
* Verify status update

> **Note:** The OrangeHRM demo environment changes dynamically (employee leave balances vary), so the implementation uses resilient locators and adaptive validation where applicable.

**Run**

```bash
npx playwright test tests/q4-leave-navigation.spec.ts --project=chromium --headed --workers=1
```

---

## Run the Entire UI Suite

Execute every UI test sequentially.

```bash
npx playwright test --project=chromium --workers=1
```

Using `--workers=1` ensures sequential execution, matching assignment requirements.

---

# Test Reports

## Playwright HTML Report

After execution:

```bash
npx playwright show-report
```

The report includes:

* Passed tests
* Failed tests
* Execution time
* Screenshots (on failure)
* Trace information

---

## Allure Report

Generate Allure report:

```bash
npx allure generate allure-results --clean -o allure-report
```

Open report:

```bash
npx allure open allure-report
```

Allure provides:

* Test timeline
* Categories
* Execution history
* Detailed steps
* Attachments

---

# Part B – Manual Testing

The repository includes a complete manual testing package.

## Included Deliverables

* **10+ Manual Test Cases**
* Positive scenarios
* Negative scenarios
* Boundary cases
* Traceability Matrix
* Bug Report
* Screenshots

### Coverage

| Module | Covered |
| ------ | ------- |
| Login  | ✓       |
| PIM    | ✓       |
| Admin  | ✓       |
| Leave  | ✓       |

The manual test cases complement the automated scenarios instead of duplicating them.

---

# Part C – GitHub Workflow

This repository follows a structured Git workflow.

## Features

* Public repository
* Incremental commits
* Organized folder structure
* Documentation
* Reports included

### Recommended Commit History

```text
Initial project setup
Add Login Page Object
Implement Q1 Invalid Login
Implement PIM employee creation
Implement Admin module automation
Implement Leave module automation
Add API automation
Add manual testing documents
Update README
```

---

# Part D – API Automation

API testing is implemented using **Postman** and executed via **Newman**.

## API

```text
https://jsonplaceholder.typicode.com/users
```

## Implemented Flow

### Request 1 – GET Users

Validations

* Status code = 200
* Response contains users
* Every user has:

  * id
  * name
  * email

The first user's `id` is stored as a collection variable.

---

### Request 2 – PUT User

Dynamic endpoint:

```text
/users/{{userId}}
```

Dynamic updates:

* name
* email
* company.name

Validations

* Status code = 200
* Returned `id` equals stored variable
* `phone` is not empty

---

## Run API Automation

Execute from project root.

```bash
npx newman run API_Automation/OrangeHRM_API_Assignment.postman_collection.json \
-e API_Automation/OrangeHRM_API_Environment.postman_environment.json \
-r cli,html \
--reporter-html-export reports/newman-report.html
```

This generates:

* CLI report
* HTML report

Output location:

```text
reports/newman-report.html
```

---

# Setup Instructions

## Prerequisites

Install:

* Node.js (18+ recommended)
* Git
* VS Code
* Google Chrome
* Playwright
* Newman (or use `npx newman`)
* Allure CLI

---

## Clone Repository

```bash
git clone https://github.com/AbdullahRFA/orangehrm-playwright-project.git

cd orangehrm-playwright-project
```

---

## Install Dependencies

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

# Useful Commands

| Purpose                     | Command                                                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install dependencies        | `npm install`                                                                                                                                                                                                       |
| Install Playwright browsers | `npx playwright install`                                                                                                                                                                                            |
| Run Q1                      | `npx playwright test tests/q1-invalid-login.spec.ts --project=chromium --headed --workers=1`                                                                                                                        |
| Run Q2                      | `npx playwright test tests/q2-add-employee.spec.ts --project=chromium --headed --workers=1`                                                                                                                         |
| Run Q3                      | `npx playwright test tests/q3-admin-edit-user.spec.ts --project=chromium --headed --workers=1`                                                                                                                      |
| Run Q4                      | `npx playwright test tests/q4-leave-navigation.spec.ts --project=chromium --headed --workers=1`                                                                                                                     |
| Run all UI tests            | `npx playwright test --project=chromium --workers=1`                                                                                                                                                                |
| Open HTML report            | `npx playwright show-report`                                                                                                                                                                                        |
| Generate Allure             | `npx allure generate allure-results --clean -o allure-report`                                                                                                                                                       |
| Open Allure                 | `npx allure open allure-report`                                                                                                                                                                                     |
| Run API suite               | `npx newman run API_Automation/OrangeHRM_API_Assignment.postman_collection.json -e API_Automation/OrangeHRM_API_Environment.postman_environment.json -r cli,html --reporter-html-export reports/newman-report.html` |

---

# Assignment Requirement Mapping

| Requirement                 | Status |
| --------------------------- | ------ |
| Playwright with POM         | ✓      |
| Independent test execution  | ✓      |
| Sequential suite execution  | ✓      |
| HTML report                 | ✓      |
| Allure report               | ✓      |
| Manual test cases           | ✓      |
| Bug report                  | ✓      |
| Public GitHub structure     | ✓      |
| API automation (Postman)    | ✓      |
| Newman execution            | ✓      |
| README with execution guide | ✓      |

---

# Deliverables Included

* UI Automation Code (Playwright + TypeScript)
* Page Object Model Framework
* Manual Test Cases (Excel)
* Traceability Matrix
* Bug Report
* API Postman Collection
* Postman Environment
* Newman HTML Report
* Playwright HTML Report
* Allure Report
* Complete Documentation (README)

---

# Notes

* Tests are configured to run independently.
* The complete UI suite runs sequentially using `--workers=1`.
* Dynamic test data is used where appropriate (e.g., employee creation).
* The OrangeHRM demo environment changes frequently; resilient locators and adaptive validations are used where possible.
* API tests use collection variables to dynamically reuse the user ID extracted from the GET response.

---

**Author**

**Abdullah Nazmus-Sakib**

QA Automation Project – OrangeHRM Assessment
