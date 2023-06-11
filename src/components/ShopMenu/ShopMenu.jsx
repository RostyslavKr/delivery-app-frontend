import ItemMenu from '../ItemMenu/ItemMenu';
import css from './ShopMenu.module.css';

const ShopMenu = ({ currentShopMenu, addToCard }) => {
  return (
    <>
      {currentShopMenu && (
        <ul className={css.listMenu}>
          {currentShopMenu.map(item => (
            <ItemMenu key={item._id} item={item} addToCard={addToCard} />
          ))}
        </ul>
      )}
    </>
  );
};
export default ShopMenu;
