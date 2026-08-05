# ABC Office Supply Co. Inventory Management System

## Version 2

This browser-based inventory management system was created for a DevOps software engineering assignment.

## Version 2 Additions

- Excel-compatible `.xls` export
- Export file and worksheet clearly state **Version 2**
- Analytics dashboard
- Category inventory analysis
- Storage-location analysis
- Healthy-stock percentage
- Low-stock attention list
- Navigation between Inventory, Analytics Dashboard, and Version 2 Status

## Login Credentials

### Administrator
- Username: `Admin`
- Password: `Passw0rd1`
- Can add, update, view, search, filter, report, export, and delete inventory records.

### Inventory User
- Username: `User`
- Password: `Password`
- Can add, update, view, search, filter, report, and export inventory records.
- Cannot delete records.

### Guest
- Select **Click Here for Guest Access**
- Read-only access.
- Can view, search, filter, export, and view analytics.
- Cannot add, update, or delete records.

## Excel Export

Select **Export to Excel — Version 2** from the Inventory screen.

The export:
- Uses the current search and filter results
- Downloads an Excel-compatible `.xls` file
- Includes a Version 2 title
- Includes the generation date and record count
- Includes item ID, name, description, category, location, quantity, reorder level, stock status, and last updated date

## Analytics Dashboard

The analytics dashboard displays:
- Unique item count
- Total inventory units
- Low-stock item count
- Healthy-stock rate
- Units by category
- Units by storage location
- Healthy versus low-stock item totals
- A prioritized low-stock attention list

## Known Development Issues

- Credentials are stored in client-side JavaScript for classroom demonstration only.
- Inventory data is stored in each browser and is not shared between devices.
- Clearing browser data removes saved inventory records.
- Excel export is an Excel-compatible `.xls` file rather than a server-generated `.xlsx` workbook.
- A secure production application would require server-side authentication and a central database.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## GitHub Update Commands

After replacing the existing files, run:

```bash
git add .
git commit -m "Add Version 2 Excel export and analytics dashboard"
git push origin main
```
