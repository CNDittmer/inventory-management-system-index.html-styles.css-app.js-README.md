"use strict";

const STORAGE_KEY = "abcOfficeInventory";

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
const roleSelect = document.getElementById("roleSelect");

const inventoryTableBody = document.getElementById("inventoryTableBody");
const messageBox = document.getElementById("message");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const lowStockReportButton = document.getElementById(
    "lowStockReportButton"
);
const resetFiltersButton = document.getElementById("resetFiltersButton");

const totalItemsElement = document.getElementById("totalItems");
const totalQuantityElement = document.getElementById("totalQuantity");
const lowStockCountElement = document.getElementById("lowStockCount");
const recordCountElement = document.getElementById("recordCount");

let inventory = loadInventory();

function loadInventory() {
    try {
        const savedInventory = localStorage.getItem(STORAGE_KEY);

        if (savedInventory) {
            return JSON.parse(savedInventory);
        }
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
            dateCreated: new Date().toISOString(),
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
            dateCreated: new Date().toISOString(),
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
            dateCreated: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        }
    ];
}

function saveInventory() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch (error) {
        showMessage(
            "Inventory could not be saved in browser storage.",
            "error"
        );
    }
}

function generateItemId() {
    if (inventory.length === 0) {
        return 1;
    }

    return Math.max(...inventory.map((item) => item.id)) + 1;
}

function isLowStock(item) {
    return Number(item.quantity) <= Number(item.reorderLevel);
}

function validateInventoryItem(itemData) {
    if (!itemData.itemName.trim()) {
        return "Item name is required.";
    }

    if (!itemData.category) {
        return "A category must be selected.";
    }

    if (!itemData.location) {
        return "A storage location must be selected.";
    }

    if (
        itemData.quantity === "" ||
        Number(itemData.quantity) < 0
    ) {
        return "Quantity must be zero or greater.";
    }

    if (
        itemData.reorderLevel === "" ||
        Number(itemData.reorderLevel) < 0
    ) {
        return "Reorder level must be zero or greater.";
    }

    return null;
}

function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;

    window.setTimeout(() => {
        messageBox.className = "message hidden";
        messageBox.textContent = "";
    }, 5000);
}

function getFilteredInventory() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedStockStatus = stockFilter.value;

    return inventory.filter((item) => {
        const matchesName = item.itemName
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            !selectedCategory ||
            item.category === selectedCategory;

        let matchesStockStatus = true;

        if (selectedStockStatus === "low") {
            matchesStockStatus = isLowStock(item);
        }

        if (selectedStockStatus === "normal") {
            matchesStockStatus = !isLowStock(item);
        }

        return (
            matchesName &&
            matchesCategory &&
            matchesStockStatus
        );
    });
}

function renderInventory() {
    const filteredInventory = getFilteredInventory();
    const currentRole = roleSelect.value;

    inventoryTableBody.innerHTML = "";

    if (filteredInventory.length === 0) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td colspan="10">
                No inventory items match the current search or filters.
            </td>
        `;

        inventoryTableBody.appendChild(row);
    } else {
        filteredInventory.forEach((item) => {
            const row = document.createElement("tr");
            const lowStock = isLowStock(item);

            if (lowStock) {
                row.classList.add("low-stock-row");
            }

            const updateDisabled =
                currentRole === "viewer" ? "disabled" : "";

            const deleteDisabled =
                currentRole !== "manager" ? "disabled" : "";

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${escapeHtml(item.itemName)}</td>
                <td>${escapeHtml(item.description || "")}</td>
                <td>${escapeHtml(item.category)}</td>
                <td>${escapeHtml(item.location)}</td>
                <td>${item.quantity}</td>
                <td>${item.reorderLevel}</td>
                <td class="${lowStock ? "status-low" : "status-normal"}">
                    ${lowStock ? "Low Stock" : "In Stock"}
                </td>
                <td>${formatDate(item.lastUpdated)}</td>
                <td>
                    <div class="action-buttons">
                        <button
                            type="button"
                            onclick="editItem(${item.id})"
                            ${updateDisabled}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="danger-button"
                            onclick="deleteItem(${item.id})"
                            ${deleteDisabled}
                        >
                            Delete
                        </button>
                    </div>
                </td>
            `;

            inventoryTableBody.appendChild(row);
        });
    }

    updateDashboard();
    updateRolePermissions();

    recordCountElement.textContent =
        `${filteredInventory.length} record(s) displayed`;
}

function updateDashboard() {
    const totalItems = inventory.length;

    const totalQuantity = inventory.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    const lowStockCount = inventory.filter(isLowStock).length;

    totalItemsElement.textContent = totalItems;
    totalQuantityElement.textContent = totalQuantity;
    lowStockCountElement.textContent = lowStockCount;
}

function updateRolePermissions() {
    const isViewer = roleSelect.value === "viewer";

    itemNameInput.disabled = isViewer;
    descriptionInput.disabled = isViewer;
    categoryInput.disabled = isViewer;
    locationInput.disabled = isViewer;
    quantityInput.disabled = isViewer;
    reorderLevelInput.disabled = isViewer;
    saveButton.disabled = isViewer;

    if (isViewer) {
        saveButton.textContent = "Updates Restricted";
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
    saveButton.textContent = "Save Inventory Item";
    updateRolePermissions();
}

function editItem(itemId) {
    if (roleSelect.value === "viewer") {
        showMessage(
            "Access denied. Read-only users cannot update inventory.",
            "error"
        );

        return;
    }

    const item = inventory.find(
        (inventoryItem) => inventoryItem.id === itemId
    );

    if (!item) {
        showMessage("Inventory item could not be found.", "error");
        return;
    }

    editItemIdInput.value = item.id;
    itemNameInput.value = item.itemName;
    descriptionInput.value = item.description || "";
    categoryInput.value = item.category;
    locationInput.value = item.location;
    quantityInput.value = item.quantity;
    reorderLevelInput.value = item.reorderLevel;

    saveButton.textContent = "Update Inventory Item";
    cancelButton.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteItem(itemId) {
    if (roleSelect.value !== "manager") {
        showMessage(
            "Access denied. Only managers can delete inventory records.",
            "error"
        );

        return;
    }

    const item = inventory.find(
        (inventoryItem) => inventoryItem.id === itemId
    );

    if (!item) {
        showMessage("Inventory item could not be found.", "error");
        return;
    }

    const confirmed = window.confirm(
        `Delete "${item.itemName}" from inventory?`
    );

    if (!confirmed) {
        return;
    }

    inventory = inventory.filter(
        (inventoryItem) => inventoryItem.id !== itemId
    );

    saveInventory();
    renderInventory();
    resetForm();

    showMessage("Inventory item deleted successfully.", "success");
}

function formatDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleString();
}

function escapeHtml(value) {
    const text = String(value);

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

inventoryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (roleSelect.value === "viewer") {
        showMessage(
            "Access denied. Read-only users cannot update inventory.",
            "error"
        );

        return;
    }

    const itemData = {
        itemName: itemNameInput.value.trim(),
        description: descriptionInput.value.trim(),
        category: categoryInput.value,
        location: locationInput.value,
        quantity: quantityInput.value,
        reorderLevel: reorderLevelInput.value
    };

    const validationError = validateInventoryItem(itemData);

    if (validationError) {
        showMessage(validationError, "error");
        return;
    }

    const editingItemId = Number(editItemIdInput.value);
    const currentDate = new Date().toISOString();

    if (editingItemId) {
        const itemIndex = inventory.findIndex(
            (item) => item.id === editingItemId
        );

        if (itemIndex === -1) {
            showMessage(
                "The inventory item could not be updated.",
                "error"
            );

            return;
        }

        inventory[itemIndex] = {
            ...inventory[itemIndex],
            ...itemData,
            quantity: Number(itemData.quantity),
            reorderLevel: Number(itemData.reorderLevel),
            lastUpdated: currentDate
        };

        showMessage(
            "Inventory item updated successfully.",
            "success"
        );
    } else {
        const duplicateItem = inventory.find(
            (item) =>
                item.itemName.toLowerCase() ===
                itemData.itemName.toLowerCase()
        );

        if (duplicateItem) {
            showMessage(
                "An item with this name already exists.",
                "error"
            );

            return;
        }

        inventory.push({
            id: generateItemId(),
            ...itemData,
            quantity: Number(itemData.quantity),
            reorderLevel: Number(itemData.reorderLevel),
            dateCreated: currentDate,
            lastUpdated: currentDate
        });

        showMessage(
            "New inventory item saved successfully.",
            "success"
        );
    }

    saveInventory();
    resetForm();
    renderInventory();
});

searchInput.addEventListener("input", renderInventory);
categoryFilter.addEventListener("change", renderInventory);
stockFilter.addEventListener("change", renderInventory);

roleSelect.addEventListener("change", () => {
    resetForm();
    renderInventory();

    if (roleSelect.value === "viewer") {
        showMessage(
            "Read-only mode enabled. Inventory updates are restricted.",
            "error"
        );
    }
});

cancelButton.addEventListener("click", resetForm);

lowStockReportButton.addEventListener("click", () => {
    stockFilter.value = "low";
    renderInventory();

    const lowStockItems = inventory.filter(isLowStock);

    if (lowStockItems.length === 0) {
        showMessage(
            "Low-stock report generated. No low-stock items were found.",
            "success"
        );
    } else {
        showMessage(
            `Low-stock report generated with ${lowStockItems.length} item(s).`,
            "success"
        );
    }
});

resetFiltersButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    stockFilter.value = "";

    renderInventory();
});

saveInventory();
renderInventory();