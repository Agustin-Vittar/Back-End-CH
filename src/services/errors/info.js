export const generateProductErrorInfo = (product) => {
  return `One more properties were incompelte or not valid.
    List of required properties:
    * _id        : needs to be a String, received ${product._id}
    * title      : needs to be a String, received ${product.title}
    * description: needs to be a String, received ${product.description}
    * code       : needs to be a Number, received ${product.code}
    * price      : needs to be a Number, received ${product.price}
    * status     : needs to be a Boolean, received ${product.status}
    * stock      : needs to be a Number, received ${product.stock}
    * category   : needs to be a String, received ${product.category}
    * thumbnail  : needs to be a Array, received ${product.thumbnail}`;
};
