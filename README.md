# # ABC Office Supply Co. Inventory Management System

## Project Description

The ABC Office Supply Co. Inventory Management System is a Version 1
web application designed to help employees manage office supply
inventory.

The application was created as part of a DevOps software engineering
project. It supports the development, testing, staging, and production
lifecycle.

## Version 1 Build Status

**Version:** 1.0  
**Build Status:** Successful  
**Current Environment:** Development/Test  
**Testing Readiness:** Ready for functional testing

## Completed Features

- Add inventory items
- View inventory items
- Update inventory quantities
- Assign item categories
- Track storage locations
- Identify low-stock items
- Search inventory by item name
- Filter inventory by category
- Filter inventory by stock status
- Generate a low-stock report
- Validate required fields
- Restrict updates for read-only users
- Restrict deletion to inventory managers
- Store inventory records using browser localStorage

## Out-of-Scope Features

The following features are not included in Version 1:

- Barcode scanning
- Payment processing
- Vendor purchasing integrations
- Accounting system integration
- Full ERP functionality
- Advanced forecasting dashboards

## Test Environment

The Version 1 test environment uses GitHub Pages and a modern web
browser. Testers can access the deployed website without installing
additional software. Inventory records are stored in the browser's
localStorage. Test data is separate for each browser and device.

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

## Version 1 Test Cases

| Test Case | Expected Result |
|---|---|
| Add a new inventory item | Item is saved successfully |
| Add item with missing required field | System displays a validation message |
| Update an inventory quantity | Quantity changes correctly |
| Reduce quantity below reorder level | Item is marked as low stock |
| Search inventory by item name | Correct item appears |
| Filter inventory by category | Only matching items appear |
| Attempt update as read-only viewer | Access is denied |
| Generate low-stock report | Items below reorder level are displayed |

## Known Development Issues

1. Inventory data is stored locally and is not shared between devices.
2. Clearing browser data will remove locally stored inventory records.
3. User roles are simulated and do not use secure account authentication.
4. The application does not currently export reports to PDF or Excel.
5. Large inventory datasets may require a server database in a future version.

These issues do not prevent Version 1 functional testing.

## Defect Reporting

Development defects will be reported using GitHub Issues.

Each defect report should include:

- Descriptive title
- Tester name
- Date reported
- Application version
- Browser used
- Steps to reproduce
- Expected result
- Actual result
- Severity level
- Screenshot when available

### Severity Levels

- Critical: Application cannot be used
- High: Major feature does not work
- Medium: Feature works incorrectly but has a workaround
- Low: Minor formatting or usability problem

## GitHub Labels

Recommended issue labels:

- bug
- testing
- documentation
- enhancement
- critical
- high-priority
- medium-priority
- low-priority

## DevOps Environments

### Development

Features are written and reviewed in the development environment.

### Test

Completed features are tested using the documented test cases. Bugs are
reported through GitHub Issues.

### Stage

The near-final application is reviewed by the project team and mock
stakeholders.

### Production

The approved version is released through GitHub Pages as the final
project submission.

## Version Control Plan

The project uses GitHub and Git for version control.

Recommended branches:

- `main` — stable production version
- `develop` — combined development work
- `feature/add-inventory` — add-item feature
- `feature/search-filter` — search and filter features
- `feature/low-stock-report` — reporting feature
- `bugfix/issue-name` — defect corrections

## How to Run the Application

1. Download or clone the repository.
2. Open `index.html` in a web browser.

The application can also be published through GitHub Pages.

## Project Team

- Christopher — Application components, use cases, data dictionary,
  workflow, and Version 1 application build
- Matthew — Dev-Test-Stage-Prod timeline, release plan, infrastructure
  diagram, and version-control planning
- Trent — Introduction, project plan, scope, stakeholders,
  communication plan, and final report formattinginventory-management-system-index.html-styles.css-app.js-README.md