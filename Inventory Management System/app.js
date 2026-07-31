"use strict";

const STORAGE_KEY = "abcOfficeInventoryV2";

const loginScreen = document.getElementById("loginScreen");
const application = document.getElementById("application");
const loginForm = document.getElementById("loginForm");
const guestButton = document.getElementById("guestButton");
const logoutButton = document.getElementById("logoutButton");
const loginMessage = document.getElementById("loginMessage");
const welcomeText = document.getElementById("welcomeText");
const roleBadge = document.getElementById("roleBadge");

const inventoryForm = document.getElementById("inventoryForm");
const editItemIdInput = document.getElementById("editItemId");
const itemNameInput = document.getElementById("itemName");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const locationInput = document.getElementById("location");
const quantityInput = document.getElementById("quantity");
const reorderLevelInput = document.getElementById("reorderLevel");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const stockFilter = document.getElementById("stockFilter");

const inventoryTableBody = document.getElementById("inventoryTableBody");
const messageBox = document.getElementById("message");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const lowStockReportButton = document.getElementById("lowStockReportButton");
const resetFiltersButton = document.getElementById("resetFiltersButton");

const totalItemsElement = document.getElementById("totalItems");
const totalQuantityElement = document.getElementById("totalQuantity");
const lowStockCountElement = document.getElementById("lowStockCount");
const recordCountElement = document.getElementById("recordCount");

let currentRole = null;
let currentUser = null;
let inventory = loadInventory();

function loadInventory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error("Unable to load inventory:", error);
  }

  return [
    {
      id: 1,
      itemName: "Copy Paper",
      description: "8.5 x 11 white copy paper",
      category: "Paper Products",
      location: "Warehouse A",
      quantity: 40,
      reorderLevel: 25,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 2,
      itemName: "Blue Pens",
      description: "Box of blue ballpoint pens",
      category: "Writing Supplies",
      location: "Stockroom 1",
      quantity: 8,
      reorderLevel: 10,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 3,
      itemName: "Printer Toner",
      description: "Black laser printer toner",
      category: "Computer Accessories",
      location: "Warehouse B",
      quantity: 4,
      reorderLevel: 5,
      lastUpdated: new Date().toISOString()
    }
  ];
}

function saveInventory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

function showLoginError(text) {
  loginMessage.textContent = text;
  loginMessage.className = "message error";
}

function startSession(user, role) {
  currentUser = user;
  currentRole = role;

  loginScreen.classList.add("hidden");
  application.classList.remove("hidden");

  const roleName =
    role === "manager" ? "Inventory Manager" :
    role === "employee" ? "Inventory Employee" :
    "Guest Viewer";

  welcomeText.textContent = `Welcome, ${user}`;
  roleBadge.textContent = roleName;
  loginMessage.classList.add("hidden");

  resetForm();
  renderInventory();
}

function endSession() {
  currentRole = null;
  currentUser = null;
  application.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  loginForm.reset();
  resetForm();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === "Admin" && password === "Passw0rd1") {
    startSession("Administrator", "manager");
  } else if (username === "User" && password === "Password") {
    startSession("Inventory User", "employee");
  } else {
    showLoginError("Invalid username or password.");
  }
});

guestButton.addEventListener("click", () => {
  startSession("Guest", "viewer");
});

logoutButton.addEventListener("click", endSession);

function generateItemId() {
  return inventory.length
    ? Math.max(...inventory.map(item => item.id)) + 1
    : 1;
}

function isLowStock(item) {
  return Number(item.quantity) <= Number(item.reorderLevel);
}

function validateItem(data) {
  if (!data.itemName.trim()) return "Item name is required.";
  if (!data.category) return "A category must be selected.";
  if (!data.location) return "A storage location must be selected.";
  if (data.quantity === "" || Number(data.quantity) < 0) {
    return "Quantity must be zero or greater.";
  }
  if (data.reorderLevel === "" || Number(data.reorderLevel) < 0) {
    return "Reorder level must be zero or greater.";
  }
  return null;
}

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;

  setTimeout(() => {
    messageBox.className = "message hidden";
  }, 5000);
}

function getFilteredInventory() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedStock = stockFilter.value;

  return inventory.filter(item => {
    const matchesName = item.itemName.toLowerCase().includes(searchText);
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesStock =
      !selectedStock ||
      (selectedStock === "low" && isLowStock(item)) ||
      (selectedStock === "normal" && !isLowStock(item));

    return matchesName && matchesCategory && matchesStock;
  });
}

function renderInventory() {
  const filtered = getFilteredInventory();
  inventoryTableBody.innerHTML = "";

  if (!filtered.length) {
    inventoryTableBody.innerHTML =
      '<tr><td colspan="10">No matching inventory items were found.</td></tr>';
  } else {
    filtered.forEach(item => {
      const low = isLowStock(item);
      const row = document.createElement("tr");

      if (low) row.classList.add("low-stock-row");

      const editDisabled = currentRole === "viewer" ? "disabled" : "";
      const deleteDisabled = currentRole !== "manager" ? "disabled" : "";

      row.innerHTML = `
        <td>${item.id}</td>
        <td>${escapeHtml(item.itemName)}</td>
        <td>${escapeHtml(item.description || "")}</td>
        <td>${escapeHtml(item.category)}</td>
        <td>${escapeHtml(item.location)}</td>
        <td>${item.quantity}</td>
        <td>${item.reorderLevel}</td>
        <td class="${low ? "status-low" : "status-normal"}">
          ${low ? "Low Stock" : "In Stock"}
        </td>
        <td>${formatDate(item.lastUpdated)}</td>
        <td>
          <div class="action-buttons">
            <button type="button" onclick="editItem(${item.id})" ${editDisabled}>
              Edit
            </button>
            <button type="button" class="danger"
              onclick="deleteItem(${item.id})" ${deleteDisabled}>
              Delete
            </button>
          </div>
        </td>
      `;

      inventoryTableBody.appendChild(row);
    });
  }

  updateDashboard();
  updatePermissions();
  recordCountElement.textContent = `${filtered.length} record(s) displayed`;
}

function updateDashboard() {
  totalItemsElement.textContent = inventory.length;
  totalQuantityElement.textContent = inventory.reduce(
    (sum, item) => sum + Number(item.quantity), 0
  );
  lowStockCountElement.textContent = inventory.filter(isLowStock).length;
}

function updatePermissions() {
  const readOnly = currentRole === "viewer";

  [
    itemNameInput,
    descriptionInput,
    categoryInput,
    locationInput,
    quantityInput,
    reorderLevelInput
  ].forEach(control => control.disabled = readOnly);

  saveButton.disabled = readOnly;

  if (readOnly) {
    saveButton.textContent = "Guest Access Is Read-Only";
  } else if (editItemIdInput.value) {
    saveButton.textContent = "Update Inventory Item";
  } else {
    saveButton.textContent = "Save Inventory Item";
  }
}

function resetForm() {
  inventoryForm.reset();
  editItemIdInput.value = "";
  cancelButton.classList.add("hidden");
  updatePermissions();
}

function editItem(itemId) {
  if (currentRole === "viewer") {
    showMessage("Access denied. Guest users cannot update inventory.", "error");
    return;
  }

  const item = inventory.find(record => record.id === itemId);
  if (!item) return;

  editItemIdInput.value = item.id;
  itemNameInput.value = item.itemName;
  descriptionInput.value = item.description || "";
  categoryInput.value = item.category;
  locationInput.value = item.location;
  quantityInput.value = item.quantity;
  reorderLevelInput.value = item.reorderLevel;

  cancelButton.classList.remove("hidden");
  updatePermissions();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteItem(itemId) {
  if (currentRole !== "manager") {
    showMessage("Access denied. Only administrators can delete records.", "error");
    return;
  }

  const item = inventory.find(record => record.id === itemId);
  if (!item) return;

  if (!window.confirm(`Delete "${item.itemName}"?`)) return;

  inventory = inventory.filter(record => record.id !== itemId);
  saveInventory();
  resetForm();
  renderInventory();
  showMessage("Inventory item deleted successfully.", "success");
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

inventoryForm.addEventListener("submit", event => {
  event.preventDefault();

  if (currentRole === "viewer") {
    showMessage("Access denied. Guest users cannot update inventory.", "error");
    return;
  }

  const data = {
    itemName: itemNameInput.value.trim(),
    description: descriptionInput.value.trim(),
    category: categoryInput.value,
    location: locationInput.value,
    quantity: quantityInput.value,
    reorderLevel: reorderLevelInput.value
  };

  const validationError = validateItem(data);

  if (validationError) {
    showMessage(validationError, "error");
    return;
  }

  const editId = Number(editItemIdInput.value);
  const now = new Date().toISOString();

  if (editId) {
    const index = inventory.findIndex(item => item.id === editId);
    if (index === -1) return;

    inventory[index] = {
      ...inventory[index],
      ...data,
      quantity: Number(data.quantity),
      reorderLevel: Number(data.reorderLevel),
      lastUpdated: now
    };

    showMessage("Inventory item updated successfully.", "success");
  } else {
    const duplicate = inventory.some(
      item => item.itemName.toLowerCase() === data.itemName.toLowerCase()
    );

    if (duplicate) {
      showMessage("An item with this name already exists.", "error");
      return;
    }

    inventory.push({
      id: generateItemId(),
      ...data,
      quantity: Number(data.quantity),
      reorderLevel: Number(data.reorderLevel),
      lastUpdated: now
    });

    showMessage("Inventory item saved successfully.", "success");
  }

  saveInventory();
  resetForm();
  renderInventory();
});

searchInput.addEventListener("input", renderInventory);
categoryFilter.addEventListener("change", renderInventory);
stockFilter.addEventListener("change", renderInventory);
cancelButton.addEventListener("click", resetForm);

lowStockReportButton.addEventListener("click", () => {
  stockFilter.value = "low";
  renderInventory();

  showMessage(
    `Low-stock report generated with ${inventory.filter(isLowStock).length} item(s).`,
    "success"
  );
});

resetFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "";
  stockFilter.value = "";
  renderInventory();
});

saveInventory();