import axios from 'axios';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import SharedLayout from './SharedLayout';
import Home from '../pages/Home';
import Shops from '../pages/Shops';
import ShoppingCard from '../pages/ShoppingCard';
import ShopMenu from './ShopMenu/ShopMenu';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
const App = () => {
  const [shops, setShops] = useState([]);
  const [currentShop, setCurrentShop] = useState(null);
  const [currentShopMenu, setCurrentShopMenu] = useState(null);
  const [dish, setDish] = useState([]);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  console.log('dish', dish);
  useEffect(() => {
    const savedData = localStorage.getItem('shoppingData');
    if (savedData) {
      setDish(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingData', JSON.stringify(dish));
  }, [dish]);

  useEffect(() => {
    axios
      .get('https://delivery-app-backend-l8fw.onrender.com/api/delivery/shops')
      .then(response => {
        const shops = response.data.map(shop => ({
          ...shop,
          status: true,
        }));
        setShops(shops);
      })
      .catch(error => {
        console.error('Помилка запиту:', error);
      });
  }, []);

  const chooseShop = (id, coordinates) => {
    const currentShop = shops.find(shop => shop._id === id);
    setCurrentShopMenu(currentShop.menu);
    setCurrentShop(currentShop._id);
    setCurrentCoordinates(coordinates);
  };

  const addToCard = id => {
    const foundDish = currentShopMenu.find(dish => dish._id === id);
    const foundSimilarDish = dish.find(d => d._id === id);
    if (foundSimilarDish) {
      return;
    }
    setDish([...dish, foundDish]);
    changeStatus(currentShop);
  };

  const changeStatus = id => {
    const updateStatus = shops.map(shop => {
      if (shop._id === id) {
        return { ...shop, status: true };
      } else {
        return { ...shop, status: false };
      }
    });
    setShops(updateStatus);
  };

  const deleteDish = id => {
    setDish(prevDish => prevDish.filter(dish => dish._id !== id));
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<SharedLayout countDish={dish.length} />}>
          <Route index element={<Home />} />
          <Route
            path="shops"
            element={
              <Shops shops={shops} dish={dish} chooseShop={chooseShop} />
            }
          >
            <Route
              path=":shop"
              element={
                <ShopMenu
                  currentShopMenu={currentShopMenu}
                  addToCard={addToCard}
                />
              }
            />
          </Route>
          <Route
            path="/shopping_card"
            element={
              <ShoppingCard
                dish={dish}
                currentCoordinates={currentCoordinates}
                deleteDish={deleteDish}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
};
export default App;
