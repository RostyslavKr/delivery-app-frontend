import css from './ItemMenu.module.css';

const ItemMenu = ({ item, addToCard }) => {
  return (
    <>
      <li className={css.itemMenu}>
        <div className={css.imageWrapper}>
          <img className={css.image} src={item.image} alt={item.name} />
        </div>

        <h3>{item.name}</h3>
        <p>Price: {item.price}</p>
        <button className={css.button} onClick={() => addToCard(item._id)}>
          add to Card
        </button>
      </li>
    </>
  );
};
export default ItemMenu;
