import React, { useState, useEffect } from "react";
import axios from "axios";

const CountryPicker = ({ onCountrySelect }) => {
  const [countries, setCountries] = useState([]);
  const [countryNames, setCountryNames] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");

  const fetchCountryFlags = async () => {
    try {
      const response = await axios.get("https://flagcdn.com/en/codes.json");
      const data = response.data;

      // Eliminar estados de USA
      const filteredData = Object.entries(data)
        .filter(([key, value]) => !key.includes("us-"))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const countryCodes = Object.keys(filteredData);

      setCountries(countryCodes);
      setCountryNames(filteredData);
    } catch (error) {
      console.error("Error al obtener las banderas de los países:", error);
    }
  };

  useEffect(() => {
    fetchCountryFlags();
  }, []);

  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    setSelectedCountry(selectedCountryCode);
    if (onCountrySelect) {
      onCountrySelect({
        name: countryNames[selectedCountryCode],
        code: selectedCountryCode,
      });
    }
  };

  return (
    <div>
       <label htmlFor="country-selector" className="visually-hidden">
        Select a country
      </label>
      <select
        className="form-select"
        id="country-selector"
        value={selectedCountry}
        onChange={handleCountryChange}
      >
        <option value="">Select a country</option>
        {countries.map((code) => (
          <option key={code} value={code}>
            {countryNames[code]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountryPicker;
