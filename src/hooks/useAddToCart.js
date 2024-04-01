import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';

import { notifyError, notifySuccess } from '@utils/toast';

const useAddToCart = () => {
  const [item, setItem] = useState(1);
  const [products, setProducts] = useState([]);
  const { addItem, items, updateItemQuantity } = useCart();

  useEffect(() => {
    const products = sessionStorage.getItem('products');
    setProducts(JSON.parse(products));
  }, []);

  const handleAddItem = (product) => {
    const result = items.find((i) => i.id === product._id);

    if (result !== undefined) {
      if (result?.quantity < product?.quantity) {
        const newItem = {
          ...product,
          id: product._id,
        };
        addItem(newItem, item);
        notifySuccess(`${item} ${product.title} Agregado al carrito!`);
      } else {
        notifyError('No hay más cantidad disponible para este producto!');
      }
    } else {
      const newItem = {
        ...product,
        id: product._id,
      };
      addItem(newItem, item);
      notifySuccess(`${item} ${product.title} Agregado al carrito!`);
    }
  };

  const handleIncreaseQuantity = (item) => {
    const result = products?.find((p) => p._id === item.id);
    if (result) {
      if (item?.quantity < result?.quantity) {
        updateItemQuantity(item.id, item.quantity + 1);
      } else {
        notifyError('No hay más cantidad disponible para este producto!');
      }
    }
  };

  return {
    handleAddItem,
    setItem,
    item,
    handleIncreaseQuantity,
  };
};

export default useAddToCart;
