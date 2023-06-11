import css from './ItemShop.module.css';

const ItemShop = ({ shop, chooseShop, dish }) => {
  return (
    <>
      {!shop.status && dish.length !== 0 ? (
        <button className={css.isDisabled} disabled>
          {shop.name.toUpperCase()}
        </button>
      ) : (
        <button
          className={css.itemShop}
          key={shop._id}
          onClick={() => chooseShop(shop._id, shop.coordinates)}
        >
          {shop.name.toUpperCase()}
        </button>
      )}
    </>
  );
};

export default ItemShop;
