function addToCart(productId) {
  fetch(`/api/carts/1/product/${productId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "Success") {
        alert("Producto agregado al carrito");
      } else {
        alert("Error al agregar el producto al carrito");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al agregar el producto al carrito");
    });
}
