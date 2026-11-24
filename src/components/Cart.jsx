
import "./Cart.css";

function Cart({ cart, removeFromCart, updateQuantity }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="cart" aria-label="Shopping cart">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p data-testid="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              className="cart-item"
              key={item.id}
              data-testid={`cart-item-${item.id}`}
            >
              <div>
                <h3>{item.name}</h3>

                <p>
                  ₹{item.price.toLocaleString("en-IN")} each
                </p>

                <p>
                  Line Total: ₹
                  {(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="quantity-controls">
                <button
                  type="button"
                  aria-label={`Decrease ${item.name} quantity`}
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                  disabled={item.quantity === 1}
                >
                  −
                </button>

                <span data-testid={`quantity-${item.id}`}>
                  {item.quantity}
                </span>

                <button
                  type="button"
                  aria-label={`Increase ${item.name} quantity`}
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>

                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h3 className="cart-total">
            Order Total: ₹{total.toLocaleString("en-IN")}
          </h3>
        </>
      )}
    </section>
  );
}

export default Cart;

