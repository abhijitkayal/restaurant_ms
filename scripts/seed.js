/**
 * Saveur Restaurant - Database Seed Script
 * Run with: node scripts/seed.js
 * Make sure MONGODB_URI is set in .env.local or pass it as env var
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant-ms";

// ── Schemas (mirror the TS models) ──────────────────────────────────────────
const InventorySchema = new mongoose.Schema({
  name: String, category: String, quantity: Number, unit: String,
  minStock: Number, costPerUnit: Number, supplier: String,
  lastRestocked: Date, expiryDate: Date,
}, { timestamps: true });

const StaffSchema = new mongoose.Schema({
  name: String, role: String, email: String, phone: String,
  status: String, shift: String, hourlyRate: Number,
  hoursWorked: Number, joinDate: Date,
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: String, tableNumber: Number,
  items: [{ name: String, quantity: Number, price: Number }],
  status: String, paymentStatus: String, paymentMethod: String,
  subtotal: Number, tax: Number, total: Number, notes: String,
}, { timestamps: true });

const Inventory = mongoose.models.InventoryItem || mongoose.model("InventoryItem", InventorySchema);
const Staff     = mongoose.models.Staff         || mongoose.model("Staff", StaffSchema);
const Order     = mongoose.models.Order         || mongoose.model("Order", OrderSchema);

// ── Seed data ────────────────────────────────────────────────────────────────

const inventoryItems = [
  { name: "Chicken Breast", category: "Meat",      quantity: 8,   unit: "kg",  minStock: 10, costPerUnit: 280, supplier: "Fresh Farms Co." },
  { name: "Basmati Rice",   category: "Dry Goods", quantity: 45,  unit: "kg",  minStock: 20, costPerUnit: 85,  supplier: "Grain Masters" },
  { name: "Tomatoes",       category: "Produce",   quantity: 12,  unit: "kg",  minStock: 8,  costPerUnit: 40,  supplier: "Green Valley Farms", expiryDate: new Date(Date.now() + 2 * 86400000) },
  { name: "Onions",         category: "Produce",   quantity: 30,  unit: "kg",  minStock: 10, costPerUnit: 25,  supplier: "Green Valley Farms" },
  { name: "Butter",         category: "Dairy",     quantity: 5,   unit: "kg",  minStock: 3,  costPerUnit: 450, supplier: "Amul Distributors", expiryDate: new Date(Date.now() + 7 * 86400000) },
  { name: "Fresh Cream",    category: "Dairy",     quantity: 3,   unit: "L",   minStock: 4,  costPerUnit: 180, supplier: "Amul Distributors", expiryDate: new Date(Date.now() + 3 * 86400000) },
  { name: "Paneer",         category: "Dairy",     quantity: 6,   unit: "kg",  minStock: 5,  costPerUnit: 320, supplier: "Amul Distributors" },
  { name: "Garam Masala",   category: "Spices",    quantity: 2,   unit: "kg",  minStock: 1,  costPerUnit: 600, supplier: "Spice Route" },
  { name: "Turmeric",       category: "Spices",    quantity: 1.5, unit: "kg",  minStock: 1,  costPerUnit: 220, supplier: "Spice Route" },
  { name: "Coriander Seeds",category: "Spices",    quantity: 2,   unit: "kg",  minStock: 1,  costPerUnit: 180, supplier: "Spice Route" },
  { name: "Cooking Oil",    category: "Dry Goods", quantity: 20,  unit: "L",   minStock: 10, costPerUnit: 150, supplier: "Fortune Foods" },
  { name: "Wheat Flour",    category: "Dry Goods", quantity: 40,  unit: "kg",  minStock: 15, costPerUnit: 45,  supplier: "Grain Masters" },
  { name: "Mint Leaves",    category: "Produce",   quantity: 2,   unit: "kg",  minStock: 3,  costPerUnit: 120, supplier: "Green Valley Farms", expiryDate: new Date(Date.now() + 1 * 86400000) },
  { name: "Lemon",          category: "Produce",   quantity: 5,   unit: "kg",  minStock: 3,  costPerUnit: 60,  supplier: "Green Valley Farms" },
  { name: "Milk",           category: "Dairy",     quantity: 15,  unit: "L",   minStock: 10, costPerUnit: 65,  supplier: "Amul Distributors", expiryDate: new Date(Date.now() + 2 * 86400000) },
  { name: "Cola (2L)",      category: "Beverages", quantity: 24,  unit: "pcs", minStock: 12, costPerUnit: 95,  supplier: "Beverage World" },
  { name: "Mango Juice",    category: "Beverages", quantity: 18,  unit: "pcs", minStock: 10, costPerUnit: 55,  supplier: "Beverage World" },
  { name: "Soda Water",     category: "Beverages", quantity: 30,  unit: "pcs", minStock: 12, costPerUnit: 35,  supplier: "Beverage World" },
  { name: "Naan (Frozen)",  category: "Bakery",    quantity: 50,  unit: "pcs", minStock: 30, costPerUnit: 18,  supplier: "Daily Breads" },
  { name: "Prawns",         category: "Seafood",   quantity: 3,   unit: "kg",  minStock: 5,  costPerUnit: 750, supplier: "Sea Fresh Ltd." },
];

const staffMembers = [
  { name: "Raju Kumar",    role: "Chef",        email: "raju.kumar@saveur.in",    phone: "9811234501", status: "Active",   shift: "Evening", hourlyRate: 350, hoursWorked: 156, joinDate: new Date("2022-03-15") },
  { name: "Suresh Verma",  role: "Sous Chef",   email: "suresh.verma@saveur.in",  phone: "9811234502", status: "Active",   shift: "Evening", hourlyRate: 280, hoursWorked: 148, joinDate: new Date("2022-06-01") },
  { name: "Priya Anand",   role: "Waitress",    email: "priya.anand@saveur.in",   phone: "9811234503", status: "Active",   shift: "Evening", hourlyRate: 180, hoursWorked: 162, joinDate: new Date("2023-01-10") },
  { name: "Neha Kaur",     role: "Waitress",    email: "neha.kaur@saveur.in",     phone: "9811234504", status: "On Leave", shift: "Evening", hourlyRate: 180, hoursWorked: 140, joinDate: new Date("2023-03-20") },
  { name: "Arjun Sharma",  role: "Manager",     email: "arjun.sharma@saveur.in",  phone: "9811234505", status: "Active",   shift: "Evening", hourlyRate: 500, hoursWorked: 176, joinDate: new Date("2021-11-01") },
  { name: "Mohan Das",     role: "Waiter",      email: "mohan.das@saveur.in",     phone: "9811234506", status: "Active",   shift: "Morning", hourlyRate: 180, hoursWorked: 152, joinDate: new Date("2023-05-15") },
  { name: "Suresh Mali",   role: "Bartender",   email: "suresh.mali@saveur.in",   phone: "9811234507", status: "Active",   shift: "Evening", hourlyRate: 240, hoursWorked: 168, joinDate: new Date("2022-09-01") },
  { name: "Kavitha Reddy", role: "Cashier",     email: "kavitha.r@saveur.in",     phone: "9811234508", status: "Active",   shift: "Evening", hourlyRate: 200, hoursWorked: 160, joinDate: new Date("2023-07-01") },
  { name: "Amit Singh",    role: "Kitchen Staff",email: "amit.singh@saveur.in",   phone: "9811234509", status: "Active",   shift: "Morning", hourlyRate: 160, hoursWorked: 144, joinDate: new Date("2023-08-15") },
  { name: "Deepa Nair",    role: "Host",        email: "deepa.nair@saveur.in",    phone: "9811234510", status: "Active",   shift: "Evening", hourlyRate: 190, hoursWorked: 158, joinDate: new Date("2023-04-10") },
  { name: "Vikram Patel",  role: "Waiter",      email: "vikram.patel@saveur.in",  phone: "9811234511", status: "Inactive", shift: "Night",   hourlyRate: 180, hoursWorked: 0,   joinDate: new Date("2024-01-20") },
  { name: "Sunita Roy",    role: "Cleaner",     email: "sunita.roy@saveur.in",    phone: "9811234512", status: "Active",   shift: "Morning", hourlyRate: 140, hoursWorked: 132, joinDate: new Date("2023-02-01") },
];

// Generate realistic orders spread across today and yesterday
function makeOrder(num, table, items, status, payStatus, payMethod, minsAgo, notes) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  return {
    orderNumber: `ORD-${num}`,
    tableNumber: table,
    items,
    status,
    paymentStatus: payStatus,
    paymentMethod: payMethod || undefined,
    subtotal,
    tax,
    total,
    notes: notes || undefined,
    createdAt: new Date(Date.now() - minsAgo * 60000),
    updatedAt: new Date(Date.now() - minsAgo * 60000),
  };
}

const sampleOrders = [
  // Active orders (today)
  makeOrder("T9K2A", 3,  [{ name: "Chicken Tikka Masala", quantity: 2, price: 320 }, { name: "Garlic Naan", quantity: 4, price: 50 }, { name: "Lassi", quantity: 2, price: 120 }], "Preparing", "Unpaid", null, 18, "Less spicy for Table 3"),
  makeOrder("T9K2B", 7,  [{ name: "Paneer Butter Masala", quantity: 1, price: 280 }, { name: "Butter Roti", quantity: 3, price: 35 }, { name: "Raita", quantity: 1, price: 80 }], "Ready",     "Unpaid", null, 25),
  makeOrder("T9K2C", 11, [{ name: "Biryani (Chicken)", quantity: 2, price: 320 }, { name: "Dal Makhani", quantity: 1, price: 220 }, { name: "Gulab Jamun", quantity: 2, price: 100 }], "Preparing", "Unpaid", null, 12),
  makeOrder("T9K2D", 2,  [{ name: "Veg Biryani", quantity: 2, price: 250 }, { name: "Cold Drink", quantity: 3, price: 80 }], "Pending", "Unpaid", null, 5),
  makeOrder("T9K2E", 9,  [{ name: "Dal Makhani", quantity: 1, price: 220 }, { name: "Garlic Naan", quantity: 2, price: 50 }, { name: "Lassi", quantity: 1, price: 120 }], "Pending", "Unpaid", null, 3, "Extra butter on naan"),
  // Served + paid (today)
  makeOrder("T9K1A", 1,  [{ name: "Chicken Tikka Masala", quantity: 3, price: 320 }, { name: "Butter Roti", quantity: 6, price: 35 }, { name: "Lassi", quantity: 3, price: 120 }], "Served", "Paid", "Card",  120),
  makeOrder("T9K1B", 5,  [{ name: "Paneer Butter Masala", quantity: 2, price: 280 }, { name: "Garlic Naan", quantity: 4, price: 50 }, { name: "Cold Drink", quantity: 2, price: 80 }], "Served", "Paid", "UPI",   150),
  makeOrder("T9K1C", 8,  [{ name: "Biryani (Chicken)", quantity: 4, price: 320 }, { name: "Raita", quantity: 2, price: 80 }, { name: "Gulab Jamun", quantity: 4, price: 100 }], "Served", "Paid", "Cash",  200),
  makeOrder("T9K1D", 12, [{ name: "Veg Biryani", quantity: 2, price: 250 }, { name: "Dal Makhani", quantity: 2, price: 220 }, { name: "Ice Cream", quantity: 2, price: 120 }], "Served", "Paid", "Card",  240),
  makeOrder("T9K1E", 4,  [{ name: "Chicken Tikka Masala", quantity: 1, price: 320 }, { name: "Garlic Naan", quantity: 2, price: 50 }, { name: "Lassi", quantity: 2, price: 120 }], "Served", "Paid", "UPI",   300),
  makeOrder("T9K1F", 6,  [{ name: "Dal Makhani", quantity: 3, price: 220 }, { name: "Butter Roti", quantity: 6, price: 35 }, { name: "Mango Lassi", quantity: 3, price: 130 }], "Served", "Paid", "Cash",  350),
  makeOrder("T9K1G", 10, [{ name: "Paneer Butter Masala", quantity: 2, price: 280 }, { name: "Biryani (Chicken)", quantity: 1, price: 320 }, { name: "Cold Drink", quantity: 3, price: 80 }], "Served", "Paid", "Card",  420),
  makeOrder("T9K1H", 13, [{ name: "Veg Biryani", quantity: 3, price: 250 }, { name: "Raita", quantity: 3, price: 80 }, { name: "Gulab Jamun", quantity: 3, price: 100 }], "Served", "Paid", "UPI",   480),
  // Yesterday's orders
  makeOrder("T8K3A", 1,  [{ name: "Chicken Tikka Masala", quantity: 2, price: 320 }, { name: "Garlic Naan", quantity: 4, price: 50 }], "Served", "Paid", "Cash",  1440),
  makeOrder("T8K3B", 3,  [{ name: "Paneer Butter Masala", quantity: 3, price: 280 }, { name: "Butter Roti", quantity: 6, price: 35 }, { name: "Lassi", quantity: 3, price: 120 }], "Served", "Paid", "Card",  1500),
  makeOrder("T8K3C", 7,  [{ name: "Biryani (Chicken)", quantity: 2, price: 320 }, { name: "Raita", quantity: 2, price: 80 }, { name: "Cold Drink", quantity: 2, price: 80 }], "Served", "Paid", "UPI",   1560),
  makeOrder("T8K3D", 5,  [{ name: "Dal Makhani", quantity: 2, price: 220 }, { name: "Garlic Naan", quantity: 4, price: 50 }, { name: "Ice Cream", quantity: 2, price: 120 }], "Served", "Paid", "Cash",  1620),
  makeOrder("T8K3E", 9,  [{ name: "Veg Biryani", quantity: 2, price: 250 }, { name: "Butter Roti", quantity: 4, price: 35 }], "Served", "Paid", "Card",  1680),
  // Cancelled order
  makeOrder("T9K2X", 14, [{ name: "Chicken Tikka Masala", quantity: 1, price: 320 }], "Cancelled", "Unpaid", null, 60),
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected:", MONGODB_URI.replace(/\/\/.*@/, "//***@"));

  console.log("\n🗑️  Clearing existing data…");
  await Promise.all([Inventory.deleteMany({}), Staff.deleteMany({}), Order.deleteMany({})]);

  console.log("📦 Seeding inventory…");
  const inv = await Inventory.insertMany(inventoryItems.map(i => ({ ...i, lastRestocked: new Date(Date.now() - Math.random() * 7 * 86400000) })));
  console.log(`   ✓ ${inv.length} inventory items`);

  console.log("👥 Seeding staff…");
  const st = await Staff.insertMany(staffMembers);
  console.log(`   ✓ ${st.length} staff members`);

  console.log("🧾 Seeding orders…");
  const ord = await Order.insertMany(sampleOrders);
  console.log(`   ✓ ${ord.length} orders`);

  console.log("\n🎉 Seed complete!");
  console.log("   Active orders:   ", sampleOrders.filter(o => ["Pending","Preparing","Ready"].includes(o.status)).length);
  console.log("   Served (paid):   ", sampleOrders.filter(o => o.paymentStatus === "Paid").length);
  console.log("   Low stock items: ", inventoryItems.filter(i => i.quantity <= i.minStock).length);
  console.log("   Expiring soon:   ", inventoryItems.filter(i => i.expiryDate && (i.expiryDate - Date.now()) / 86400000 <= 3).length);

  await mongoose.disconnect();
  console.log("\n👋 Disconnected. Start the app with: npm run dev");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
