function addToCart(cartId, productId) {
  console.log("addToCart - cartId:", cartId);
  console.log("addToCart - productId:", productId);
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "Success") {
        alert("Producto agregado al carrito");
      } else {
        alert("Error al agregar el producto al carrito");
        throw new Error();
      }
    })
    .catch((error) => {
      alert("Error al agregar el producto al carrito");
      throw new Error(error);
    });
}
