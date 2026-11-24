
import { useState, useRef } from "react";
import "./Checkout.css";

function Checkout({ cart, total, onOrderComplete }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const isSubmitting = useRef(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Please enter your address.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Please enter your city.";
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Pincode must contain exactly 6 digits.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: ""
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting.current) return;

    if (cart.length === 0) {
      setErrors({
        general: "Your cart is empty. Please add a product first."
      });
      return;
    }

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    isSubmitting.current = true;

    const newOrder = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      reference: "ORD-" + Date.now(),
      total,
      items: cart.map((item) => ({ ...item }))
    };

    setOrder(newOrder);
    setErrors({});
    onOrderComplete();
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  if (order) {
    return (
      <section className="checkout receipt" data-testid="order-receipt">
        <div className="success-icon">✓</div>

        <p className="receipt-label">ORDER SUCCESSFUL</p>

        <h2>Order Confirmed!</h2>

        <p className="receipt-thankyou">
          Thank you, {order.name}. Your order has been placed successfully.
        </p>

        <div className="order-reference">
          <span>ORDER REFERENCE</span>
          <strong data-testid="order-reference">
            {order.reference}
          </strong>
        </div>

        <div className="receipt-items">
          <h3>Customer Details</h3>

          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>City:</strong> {order.city}</p>
          <p><strong>Pincode:</strong> {order.pincode}</p>

          <h3>Order Summary</h3>

          {order.items.map((item) => (
            <div className="receipt-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                </p>
              </div>

              <strong>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <div className="receipt-total">
            <span>Grand Total</span>
            <strong>₹{order.total.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <p className="receipt-footer">
          Thank you for shopping with MiniStore!
        </p>

        <button
          type="button"
          className="download-receipt-button"
          onClick={handleDownloadReceipt}
        >
          ↓ Download Receipt
        </button>

        <p className="download-hint">
          Choose "Save as PDF" in the print window to download your receipt.
        </p>
      </section>
    );
  }

  const fields = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
      autoComplete: "name"
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "example@email.com",
      type: "email",
      autoComplete: "email"
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "10-digit mobile number",
      type: "tel",
      autoComplete: "tel",
      maxLength: 10
    },
    {
      name: "address",
      label: "Delivery Address",
      placeholder: "House number, street, area",
      type: "text",
      autoComplete: "street-address"
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter your city",
      type: "text",
      autoComplete: "address-level2"
    },
    {
      name: "pincode",
      label: "Pincode",
      placeholder: "6-digit pincode",
      type: "text",
      autoComplete: "postal-code",
      maxLength: 6
    }
  ];

  return (
    <section className="checkout">
      <p className="section-eyebrow">ALMOST THERE</p>
      <h2>Checkout</h2>

      <p className="checkout-description">
        Enter your contact and delivery details to complete your order.
      </p>

      {errors.general && (
        <p className="error" role="alert">
          {errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {fields.map((field) => (
          <div className="checkout-field" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>

            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={
                errors[field.name]
                  ? `${field.name}-error`
                  : undefined
              }
              required
            />

            {errors[field.name] && (
              <p
                className="error"
                id={`${field.name}-error`}
                role="alert"
                data-testid={`${field.name}-error`}
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        <button type="submit" disabled={cart.length === 0}>
          Place Order
        </button>
      </form>
    </section>
  );
}

export default Checkout;
