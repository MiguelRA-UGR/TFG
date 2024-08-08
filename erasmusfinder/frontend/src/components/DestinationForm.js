import React, { useState, useEffect } from "react";
import PhotoCrop from "./PhotoCrop";
import { useDispatch } from "react-redux";
import { createDestination } from "../actions/destination";
import axios from "axios";
import { cleanString, extractLatLngFromGoogleMaps } from "./utils";

const DestinationForm = () => {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState("#");
  const [cropped, setCropped] = useState(false);

  const [name, setName] = useState("");
  const [iso, setIso] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [climateGeneral, setClimateGeneral] = useState("");
  const [climateWinter, setClimateWinter] = useState("");
  const [climateSummer, setClimateSummer] = useState("");
  const [costOfLiving, setCostOfLiving] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [population, setPopulation] = useState("");
  const [surface, setSurface] = useState("");
  const [countries, setCountries] = useState({});
  const [countryNames, setCountryNames] = useState({});
  const [allLanguages, setAllLanguages] = useState([]);

  const [universityName, setUniversityName] = useState("");
  const [universityUrl, setUniversityUrl] = useState("");
  const [universities, setUniversities] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCountryFlags = async () => {
      try {
        const response = await axios.get("https://flagcdn.com/en/codes.json");
        const data = response.data;

        const filteredData = Object.entries(data)
          .filter(([key]) => !key.includes("us-"))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});

        setCountries(filteredData);
        setCountryNames(filteredData);
      } catch (error) {
        console.error("Error al obtener las banderas de los países:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countriesData = response.data;
        const languageSet = new Set();

        countriesData.forEach((country) => {
          if (country.languages) {
            Object.values(country.languages).forEach((language) => {
              languageSet.add(language);
            });
          }
        });

        setAllLanguages([...languageSet]);
      } catch (error) {
        console.error("Error al obtener los lenguajes:", error);
      }
    };

    fetchCountryFlags();
    fetchLanguages();
  }, []);

  const uploadPhotoToBack = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/dests/upload-dest-photo", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPhotoUrl(response.data.url);
      console.log("Photo uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleImageChange = (newImage) => {
    setImage(newImage);
    setCropped(false);
  };

  const handleCropData = (data) => {
    setCropData(data);
    setCropped(true);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    const isoCode = Object.entries(countries).find(([key, value]) => value === selectedCountry)?.[0] || "";
    setIso(isoCode);
  };

  const handleAddUniversity = (e) => {
    e.preventDefault();
    if (universityName && universityUrl) {
      setUniversities([...universities, { name: universityName, url: universityUrl }]);
      setUniversityName("");
      setUniversityUrl("");
    }
  };

  const handleRemoveUniversity = (index) => {
    setUniversities(universities.filter((_, i) => i !== index));
  };

  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (selectedLanguage && !languages.includes(selectedLanguage)) {
      setLanguages([...languages, selectedLanguage]);
      setSelectedLanguage("");
    }
  };

  const handleRemoveLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (cropped) {
      const fileBlob = await fetch(cropData).then((res) => res.blob());
      const file = new File([fileBlob], `${cleanString(name)}.png`, {
        type: fileBlob.type
      });

      console.log(file);
      await uploadPhotoToBack(file);
    }

    const { lat, long } = extractLatLngFromGoogleMaps(googleMapsUrl);

    const destinationData = {
      name,
      iso,
      description,
      country,
      coords: {
        lat,
        long,
      },
      photoUrl,
      clima: {
        general: climateGeneral,
        winter: climateWinter,
        summer: climateSummer,
      },
      cost_life: costOfLiving,
      languages: languages.join(", "),
      population,
      surface,
      universities,
    };

    try {
      dispatch(createDestination(destinationData));
      setImage(null);
      setCropData("#");
      setCropped(false);
      setName("");
      setIso("");
      setDescription("");
      setCountry("");
      setGoogleMapsUrl("");
      setPhotoUrl("");
      setClimateGeneral("");
      setClimateWinter("");
      setClimateSummer("");
      setCostOfLiving("");
      setLanguages([]);
      setPopulation("");
      setSurface("");
      setUniversities([]);

      window.location.reload();
    } catch (error) {
      console.error("Error creating destination:", error);
    }
  };

  const climateOptions = [
    "Cold and Dry",
    "Cold and Wet",
    "Mild and Dry",
    "Mild and Wet",
    "Very Cold",
    "Very Cold and Snowy",
    "Cold with Frequent Snow",
    "Mild with Light Rain",
    "Cold with Occasional Snow",
    "Very Cold with Heavy Snow",
    "Chilly and Dry",
    "Chilly and Wet",
    "Freezing and Windy",
    "Cold and Foggy",
    "Bitterly Cold",
    "Cool and Dry",
    "Cool and Wet",
    "Cold with Icy Conditions",
    "Freezing Rain",
    "Extreme Cold",
    "Cold and Icy",
    "Hot and Dry",
    "Hot and Humid",
    "Warm and Dry",
    "Warm and Humid",
    "Very Hot",
    "Very Hot and Dry",
    "Hot with Frequent Thunderstorms",
    "Warm with Light Rain",
    "Hot and Sunny",
    "Warm with Occasional Thunderstorms",
    "Hot and Windy",
    "Warm and Pleasant",
    "Extremely Hot",
    "Hot with High Humidity",
    "Warm with High UV Index",
    "Very Warm and Dry",
    "Warm with Light Showers",
    "Hot and Muggy",
    "Warm and Breezy",
    "Hot with Intense Heatwaves",
    "Warm with Variable Conditions",
  ];

  const climateTypeOptions = [
    "Mediterranean",
    "Continental",
    "Oceanic",
    "Arid",
    "Tropical",
  ];

  const costOfLivingOptions = [
    "Very Low",
    "Low",
    "Moderate",
    "High",
    "Very High",
  ];

  return (
    <div>
      <form className="form-control text-center" onSubmit={handleCreate}>
        <h4>Create a new destination</h4>
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <select
                id="country"
                className="form-control"
                value={country}
                onChange={handleCountryChange}
                required
              >
                <option value="">Select a country</option>
                {Object.entries(countryNames).map(([code, name]) => (
                  <option key={code} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="iso" className="form-label">
                ISO Code
              </label>
              <input
                type="text"
                className="form-control"
                id="iso"
                value={iso}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="googleMapsUrl" className="form-label">
                Google Maps URL
              </label>
              <input
                type="text"
                className="form-control"
                id="googleMapsUrl"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="climateGeneral" className="form-label">
                General Climate
              </label>
              <select
                id="climateGeneral"
                className="form-control"
                value={climateGeneral}
                onChange={(e) => setClimateGeneral(e.target.value)}
              >
                <option value="">Select a climate type</option>
                {climateTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="climateWinter" className="form-label">
                Winter Climate
              </label>
              <select
                id="climateWinter"
                className="form-control"
                value={climateWinter}
                onChange={(e) => setClimateWinter(e.target.value)}
              >
                <option value="">Select the winter climate</option>
                {climateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="climateSummer" className="form-label">
                Summer Climate
              </label>
              <select
                id="climateSummer"
                className="form-control"
                value={climateSummer}
                onChange={(e) => setClimateSummer(e.target.value)}
              >
                <option value="">Select the summer climate</option>
                {climateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="costOfLiving" className="form-label">
                Cost of Living
              </label>
              <select
                id="costOfLiving"
                className="form-control"
                value={costOfLiving}
                onChange={(e) => setCostOfLiving(e.target.value)}
              >
                <option value="">Select cost of living</option>
                {costOfLivingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="languages" className="form-label">
                Languages
              </label>
              <div className="d-flex">
                <select
                  id="languages"
                  className="form-control me-2"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Select a language</option>
                  {allLanguages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddLanguage}
                >
                  Add
                </button>
              </div>
            </div>

            <ul className="list-group mb-3">
              {languages.map((language, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{language}</strong>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveLanguage(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mb-3">
              <label htmlFor="population" className="form-label">
                Population
              </label>
              <input
                type="number"
                className="form-control"
                id="population"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="surface" className="form-label">
                Surface
              </label>
              <input
                type="number"
                className="form-control"
                id="surface"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="universityName" className="form-label">
                University Name
              </label>
              <input
                type="text"
                className="form-control"
                id="universityName"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="universityUrl" className="form-label">
                University URL
              </label>
              <input
                type="text"
                className="form-control"
                id="universityUrl"
                value={universityUrl}
                onChange={(e) => setUniversityUrl(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={handleAddUniversity}
            >
              Add University
            </button>

            <ul className="list-group mb-3">
              {universities.map((uni, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{uni.name}</strong>: {uni.url}
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveUniversity(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <label htmlFor="frontpage" className="form-label">
            Frontpage
          </label>

          <div className="col-md-12 mb-3 d-flex justify-content-center">
            <PhotoCrop
              image={image}
              onImageChange={handleImageChange}
              onCropData={handleCropData}
              cropped={cropped}
              height={400}
              aspectRatio={2}
            />
          </div>

          <div className="col-md-12 text-center">
            <button
              type="submit"
              style={{
                fontWeight: "bold",
                backgroundColor: "#f5973d",
                color: "#ffffff",
              }}
              className="btn btn-warning"
            >
              Create Destination
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;
