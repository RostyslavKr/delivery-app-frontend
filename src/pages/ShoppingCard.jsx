import axios from 'axios';
import Notiflix from 'notiflix';
import { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

import Map from '../components/Map/Map';
import Autocomplete from '../components/Autocomplete/Autocomplete';
import ItemCard from '../components/ItemCard/ItemCard';

import css from './ShoppingCard.module.css';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
const API_KEY = process.env.REACT_APP_API_KEY;
const libraries = ['places'];

const ShoppingCard = ({ dish, deleteDish, currentCoordinates }) => {
  const [dishes, setDishes] = useState(dish);
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [order, setOrder] = useState(null);
  const [statusOrder, setStatusOrder] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries,
  });

  useEffect(() => {
    setDishes(dish);
  }, [dish]);
  useEffect(() => {
    if (statusOrder === null) {
      return;
    }
    localStorage.clear();
  }, [statusOrder]);
  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      dishes.forEach(item => {
        total += item.total;
      });
      setTotalPrice(total);
    };

    if (dishes) {
      calculateTotalPrice();
    }
  }, [dishes]);

  const handleSubmit = e => {
    e.preventDefault();
    setOrder({
      name: name,
      email: email,
      phone: phone,
      address: address,
      order: dishes,
      totalCost: totalPrice,
    });

    axios
      .post(
        'https://delivery-app-backend-l8fw.onrender.com/api/delivery/order',
        order
      )
      .then(response => {
        console.log(response);
        setStatusOrder(response.status);
        Notiflix.Notify.success('The order has been shipped');
      })
      .catch(error => {
        console.error('Помилка запиту:', error);
        Notiflix.Notify.failure(error.message);
      });
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  const getOneDish = (id, count, total) => {
    if (dishes === null) {
      const FoundDish = dishes.find(dish => dish._id === id);
      FoundDish.count = count;
      FoundDish.total = total;
      return setDishes([FoundDish]);
    }

    const FoundDish = dishes.findIndex(dish => dish._id === id);

    if (FoundDish !== -1) {
      dishes[FoundDish].count = count;
      dishes[FoundDish].total = total;
      return;
    }

    const dish = dishes.find(dish => dish._id === id);
    dish.count = count;
    dish.total = total;
    return setDishes([...dishes, dish]);
  };

  return (
    <>
      {dishes.length === 0 ? (
        <>
          <div className={css.emptyCard}></div>
          <p className={css.textEmptyCard}>Empty card</p>
        </>
      ) : (
        <section>
          <div className={css.wrapperShoppingCard}>
            {dishes && (
              <ul className={css.listOrder}>
                {dishes.map(dish => (
                  <ItemCard
                    deleteDish={deleteDish}
                    key={dish._id}
                    dish={dish}
                    getOneDish={getOneDish}
                  />
                ))}
              </ul>
            )}
            <p className={css.totalPrice}>Total price: {totalPrice}</p>
            <div className={css.container}>
              <div className={css.containerMap}>
                <Autocomplete isLoaded={isLoaded} />

                {isLoaded ? (
                  <Map center={currentCoordinates} />
                ) : (
                  <h2>Loading</h2>
                )}
              </div>
              <form className={css.form} onSubmit={handleSubmit}>
                <input
                  className={css.input}
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <input
                  className={css.input}
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <input
                  className={css.input}
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <input
                  className={css.input}
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
                <button className={css.buttonSubmit} type="submit">
                  Order
                </button>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default ShoppingCard;
