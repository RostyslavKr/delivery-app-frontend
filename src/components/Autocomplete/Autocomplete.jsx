import { useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';

import css from './Autocomplete.module.css';

const Autocomplete = ({ isLoaded }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    init,
    clearSuggestions,
  } = usePlacesAutocomplete({
    initOnMount: false,
    callbackName: 'YOUR_CALLBACK_NAME',
    debounce: 300,
  });

  useEffect(() => {
    if (isLoaded) {
      init();
    }
  }, [isLoaded, init]);

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = e => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      setValue(description, false);
      clearSuggestions();
      console.log(description);

      getGeocode({ address: description }).then(results => {
        const { lat, lng } = getLatLng(results[0]);
        console.log('📍 Coordinates: ', { lat, lng });
      });
    };

  const renderSuggestions = () =>
    data.map(suggestion => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          className={css.listItem}
          key={place_id}
          onClick={handleSelect(suggestion)}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div className={css.root} ref={ref}>
      <input
        className={css.input}
        type="text"
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Куди доставити?"
      />
      {status === 'OK' && (
        <ul className={css.suggestions}>{renderSuggestions()}</ul>
      )}
    </div>
  );
};

export default Autocomplete;
