
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function addMouseToCart(page) {
  await page.getByRole("button", { name: "Add to Cart" }).first().click();
}

async function fillValidCheckout(page) {
  await page.getByLabel("Full Name").fill("Dhanya");
  await page.getByLabel("Email Address").fill("dhanya@example.com");
  await page.getByLabel("Phone Number").fill("9876543210");
  await page.getByLabel("Delivery Address").fill("12, Main Road");
  await page.getByLabel("City").fill("Coimbatore");
  await page.getByLabel("Pincode").fill("641001");
}

test("1. Successful checkout displays order confirmation", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByRole("heading", { name: "Order Confirmed!" })).toBeVisible();
  await expect(page.getByText(/Thank you, Dhanya/)).toBeVisible();
  await expect(page.getByTestId("order-reference")).toContainText(/^ORD-/);
  await expect(page.getByTestId("order-receipt")).toContainText("Wireless Mouse");
  await expect(page.getByTestId("order-receipt")).toContainText("dhanya@example.com");
  await expect(page.getByTestId("order-receipt")).toContainText("9876543210");
  await expect(page.getByTestId("order-receipt")).toContainText("Coimbatore");
  await expect(page.locator(".receipt-total")).toContainText("₹799");
  await expect(page.getByTestId("empty-cart")).toBeVisible();
});

test("2. Empty cart prevents checkout", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Place Order" })).toBeDisabled();
});

test("3. Quantity change updates exact total", async ({ page }) => {
  await addMouseToCart(page);

  await page.getByRole("button", {
    name: "Increase Wireless Mouse quantity"
  }).click();

  await expect(page.getByTestId("quantity-1")).toHaveText("2");
  await expect(page.locator(".cart-total")).toContainText("₹1,598");
});

test("4. Adding the same product twice increases quantity", async ({ page }) => {
  await addMouseToCart(page);
  await addMouseToCart(page);

  await expect(page.getByTestId("quantity-1")).toHaveText("2");
});

test("5. Removing a product removes it from cart", async ({ page }) => {
  await addMouseToCart(page);

  await page.getByRole("button", { name: "Remove Wireless Mouse" }).click();

  await expect(page.getByTestId("empty-cart")).toBeVisible();
});

test("6. Removing the last product shows empty cart", async ({ page }) => {
  await page.getByRole("button", { name: "Add to Cart" }).nth(1).click();

  await page.getByRole("button", {
    name: "Remove Mechanical Keyboard"
  }).click();

  await expect(page.getByTestId("empty-cart")).toBeVisible();
});

test("7. Whitespace-only name is rejected", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);
  await page.getByLabel("Full Name").fill("   ");

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByTestId("name-error")).toHaveText(
    "Please enter your full name."
  );
  await expect(page.getByTestId("order-receipt")).not.toBeVisible();
});

test("8. One-character name is rejected", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);
  await page.getByLabel("Full Name").fill("A");

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByTestId("name-error")).toHaveText(
    "Name must contain at least 2 characters."
  );
});

test("9. Invalid email is rejected", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);
  await page.getByLabel("Email Address").fill("invalid-email");

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByTestId("email-error")).toHaveText(
    "Please enter a valid email address."
  );
});

test("10. Invalid phone number is rejected", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);
  await page.getByLabel("Phone Number").fill("12345");

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByTestId("phone-error")).toHaveText(
    "Enter a valid 10-digit mobile number."
  );
});

test("11. Empty address is rejected", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);
  await page.getByLabel("Delivery Address").fill("");

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByTestId("address-error")).toHaveText(
    "Please enter your address."
  );
});

test("12. Empty city is rejected", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);
  await page.getByLabel("City").fill("");

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByTestId("city-error")).toHaveText(
    "Please enter your city."
  );
});

test("13. Invalid pincode is rejected", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);
  await page.getByLabel("Pincode").fill("123");

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByTestId("pincode-error")).toHaveText(
    "Pincode must contain exactly 6 digits."
  );
});

test("14. Four products can be added to the cart", async ({ page }) => {
  const addButtons = page.getByRole("button", { name: "Add to Cart" });

  await addButtons.nth(0).click();
  await addButtons.nth(1).click();
  await addButtons.nth(2).click();
  await addButtons.nth(3).click();

  await expect(page.getByTestId("cart-item-1")).toBeVisible();
  await expect(page.getByTestId("cart-item-2")).toBeVisible();
  await expect(page.getByTestId("cart-item-3")).toBeVisible();
  await expect(page.getByTestId("cart-item-4")).toBeVisible();

  await expect(page.locator(".cart-total")).toContainText("₹5,296");
});

test("15. Rapid double-click creates only one order receipt", async ({ page }) => {
  await addMouseToCart(page);
  await fillValidCheckout(page);

  const placeOrder = page.getByRole("button", { name: "Place Order" });

  await placeOrder.dblclick({ noWaitAfter: true });

  await expect(page.getByTestId("order-receipt")).toBeVisible();
  await expect(page.getByTestId("order-reference")).toContainText(/^ORD-/);
  await expect(page.getByTestId("order-receipt")).toHaveCount(1);
});
test("16. Cart data persists after page refresh", async ({ page }) => {
  await addMouseToCart(page);

  await page.getByRole("button", {
    name: "Increase Wireless Mouse quantity"
  }).click();

  await page.reload();

  await expect(page.getByTestId("quantity-1")).toHaveText("2");
  await expect(page.locator(".cart-total")).toContainText("₹1,598");
});