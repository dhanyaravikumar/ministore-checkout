
import { products } from "./data/products";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import useCart from "./hooks/useCart";
import "./App.css";

function App() {
  const {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity
  } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <main className="app-container">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">M</div>
          <span>MINI<span className="brand-highlight">STORE</span></span>
        </div>

        <div className="header-cart">
          <span className="cart-icon">🛒</span>
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">SIMPLE. SMART. SHOPPING.</p>
        <h1>Your everyday essentials, <span>made simple.</span></h1>
        <p className="hero-description">
          Discover quality products and enjoy a smooth, easy checkout experience.
        </p>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">OUR COLLECTION</p>
            <h2>Featured Products</h2>
          </div>
          <span className="product-count">{products.length} products</span>
        </div>

        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <section className="shopping-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">YOUR PURCHASE</p>
            <h2>Shopping Cart & Checkout</h2>
          </div>
        </div>

        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />

        <Checkout
          cart={cart}
          total={total}
          onOrderComplete={() => setCart([])}
        />
      </section>

      <footer className="app-footer">
        <p>© 2026 MiniStore. Built for a smooth shopping experience.</p>
      </footer>
    </main>
  );
}

export default App;
