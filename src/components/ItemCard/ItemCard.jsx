import { useState, useEffect } from 'react';

import css from './ItemCard.module.css';

const ItemCard = ({ dish, deleteDish, getOneDish }) => {
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(dish.price);

  useEffect(() => {
    getOneDish(dish._id, count, total);
  }, [total, count, dish._id, getOneDish]);

  const handleIncrement = () => {
    if (count === 1) {
      return;
    }
    setCount(count - 1);
    setTotal(total - dish.price);
  };

  const handleDecrement = () => {
    setCount(count + 1);
    setTotal(total + dish.price);
  };

  return (
    <li className={css.itemCard}>
      <button
        className={css.buttonDelete}
        onClick={() => deleteDish(dish._id)}
      ></button>
      <div className={css.imageWrapper}>
        <img className={css.image} src={dish.image} alt={dish.name} />
      </div>

      <h3>{dish.name}</h3>
      <p>Price: {dish.price}</p>
      {count > 1 && <p>Total: {total}</p>}

      <div className={css.countWrapper}>
        <button
          className={css.buttonIncrement}
          onClick={handleIncrement}
        ></button>
        <p className={css.count}>{count}</p>
        <button
          className={css.buttonDecrement}
          onClick={handleDecrement}
        ></button>
      </div>
    </li>
  );
};
export default ItemCard;
