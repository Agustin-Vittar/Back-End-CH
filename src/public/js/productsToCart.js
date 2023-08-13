<<<<<<< HEAD
function addToCart(productId) {
  fetch(`/api/carts/1/product/${productId}`, {
    method: "POST",
=======
function addToCart(cartId, productId) {
  console.log("addToCart - cartId:", cartId);
  console.log("addToCart - productId:", productId);
  /* fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
>>>>>>> 9460772 (Preentrega Nº 3)
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "Success") {
        alert("Producto agregado al carrito");
      } else {
<<<<<<< HEAD
        alert("Error al agregar el producto al carrito");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al agregar el producto al carrito");
    });
=======
        alert("Error al agregar el producto al carrito1");
        throw new Error();
      }
    })
    .catch((error) => {
      alert("Error al agregar el producto al carrito2");
      throw new Error(error);
    }); */
>>>>>>> 9460772 (Preentrega Nº 3)
}
