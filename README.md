# dummyjson-api-tests

API test suite for **DummyJSON Products endpoints** using **Playwright** and **TypeScript**.

This project validates the DummyJSON REST API by covering core product-related endpoints and ensuring correct responses, schemas, and error handling.

---

## 🚀 Features

- 📦 API tests for DummyJSON **Products** endpoints
- ⚡ Built with **Playwright Test** and **TypeScript**
- 🧠 Reusable fixtures and helpers
- ✅ Response validation and negative test cases
- 🔧 Easy to extend for other endpoints (users, carts, etc.)

---

## 🧱 Tech Stack

- **TypeScript**
- **Playwright**
- **Node.js**
- **DummyJSON API**

---


## 🛠️ Step-by-Step Setup Instructions

Follow the steps below to set up and run the project locally.


### 1️⃣ Install Node.js

Make sure **Node.js (v16 or higher)** is installed on your machine.

Check your version:

```bash
node -v
npm -v
```

If Node.js is not installed, download it from:
https://nodejs.org

---

### 2️⃣ Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/ernestyedigaryan1/dummyjson-api-tests.git
```

Navigate into the project directory:

```bash
cd dummyjson-api-tests
```

---

### 3️⃣ Install Project Dependencies

Install all required dependencies using npm:

```bash
npm install
```

This will install Playwright, TypeScript, and all other project dependencies.

---

### 4️⃣ Install Playwright Browsers

Playwright requires browser binaries even for API testing:

```bash
npx playwright install
```

---

### 5️⃣ Verify Environment Configuration

Open the env.config.ts file and ensure the API base URL is correct:

```
BASE_URL: 'https://dummyjson.com',
```

No authentication or additional configuration is required for DummyJSON.

---

### 6️⃣ Run the Tests

Run the full API test suite:

```bash
npm test
```

---

### 7️⃣ View Test Report

After test execution, open the Playwright HTML report:

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

---

### 8️⃣ Run a Specific Test File

To run only the products API tests:

```bash
npx playwright test tests/api/product-crud-operations.spec.ts
```

---

### ✅ Setup Complete

The project is now ready to use.

---

## 🧠 Design Decisions & Tradeoffs

This test automation framework was designed with a strong focus on **readability, maintainability, and reliability**. Playwright was selected for API testing due to its fast execution, stable request handling, and built-in test runner, which reduces external dependencies and simplifies configuration. The project structure clearly separates test specifications, fixtures, configuration, and shared utilities, making the framework easy to navigate and extend.

TypeScript was chosen to improve type safety and developer experience, especially as the test suite grows. While this introduces a small initial setup overhead compared to plain JavaScript, it significantly reduces runtime errors and improves code clarity through static typing and IDE support. Reusable fixtures are used to centralize test data and expected values, minimizing duplication and making changes easier when API contracts evolve.

The framework intentionally avoids over-engineering and keeps the scope focused on **core product API scenarios** rather than exhaustive coverage. This tradeoff prioritizes demonstrating clean test design, meaningful assertions, and reliable execution both locally and in CI environments. Continuous Integration via GitHub Actions ensures tests are automatically validated on each change, reinforcing stability while keeping the pipeline simple and fast.

---

## 🔄 Continuous Integration (CI)

This project is integrated with **GitHub Actions** to automatically run the API test suite on every push and pull request to the `main` branch. The CI pipeline installs dependencies, builds the project (if applicable), and executes the tests to ensure consistent behavior across environments.

The workflow runs tests against multiple **Node.js versions**, helping catch compatibility issues early and ensuring the framework remains stable as dependencies or runtime versions evolve.
