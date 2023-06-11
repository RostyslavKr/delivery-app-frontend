import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import css from './SharedLayout.module.css';

const SharedLayout = ({ countDish }) => {
  const setActive = ({ isActive }) =>
    isActive ? { color: '#00A082' } : { color: 'black' };

  return (
    <>
      <header className={css.headerNav}>
        <nav className={css.nav}>
          <NavLink className={css.link} style={setActive} to="/" end>
            Home
          </NavLink>
          <NavLink className={css.link} style={setActive} to="/shops">
            Shops
          </NavLink>
          <NavLink className={css.link} style={setActive} to="/shopping_card">
            <div className={css.iconCard}>
              {countDish !== 0 && <p className={css.countDish}>{countDish}</p>}
            </div>
          </NavLink>
        </nav>
      </header>
      <Suspense fallback={<div>Loading page...</div>}>
        <Outlet />
      </Suspense>
    </>
  );
};
export default SharedLayout;
