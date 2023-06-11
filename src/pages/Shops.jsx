import { Link, Outlet } from 'react-router-dom';

import ItemShop from '../components/ItemShop/ItemShop';

import css from './Shops.module.css';

const Shops = ({ shops, chooseShop, dish }) => {
  return (
    <div className={css.wrapperShops}>
      <div className={css.listShops}>
        {shops.map(shop => (
          <Link className={css.link} key={shop._id} to={shop.name}>
            <ItemShop chooseShop={chooseShop} dish={dish} shop={shop} />
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};
export default Shops;
