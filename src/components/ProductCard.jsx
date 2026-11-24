
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <h2>{product.name}</h2>

      <p className="product-price">
        ₹{product.price.toLocaleString("en-IN")}
      </p>

      <p>{product.description}</p>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
