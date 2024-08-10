import React, { useState, useEffect } from "react";
import PhotoCrop from "./PhotoCrop";
import { useDispatch } from "react-redux";
import { createDestination, updateDestination } from "../actions/destination";
import axios from "axios";
import {
  cleanString,
  extractLatLngFromGoogleMaps,
  costOfLivingOptions,
  climateOptions,
  climateTypeOptions,
  stateColors
} from "./utils";
import CountryPicker from "./CountryPicker";

const DestinationForm = ({ destination = null }) => {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState("#");
  const [cropped, setCropped] = useState(false);

  const [name, setName] = useState(destination?.name || "");
  const [iso, setIso] = useState(destination?.iso || "");
  const [description, setDescription] = useState(destination?.description || "");
  const [country, setCountry] = useState(destination?.country || "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(destination?.coords ? `https://maps.google.com/?q=${destination.coords.lat},${destination.coords.long}` : "");
  const [photoUrl, setPhotoUrl] = useState(destination?.photoUrl || "");
  const [climateGeneral, setClimateGeneral] = useState(destination?.clima?.general || "");
  const [climateWinter, setClimateWinter] = useState(destination?.clima?.winter || "");
  const [climateSummer, setClimateSummer] = useState(destination?.clima?.summer || "");
  const [costOfLiving, setCostOfLiving] = useState(destination?.cost_life || "");
  const [languages, setLanguages] = useState(destination?.languages || []);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [population, setPopulation] = useState(destination?.population || "");
  const [surface, setSurface] = useState(destination?.surface || "");
  const [universities, setUniversities] = useState(destination?.universities || []);

  const [allLanguages, setAllLanguages] = useState([]);

  const [universityName, setUniversityName] = useState("");
  const [universityUrl, setUniversityUrl] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
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

  const handleCountryChange = ({ code, name }) => {
    setCountry(name);
    setIso(code);
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

  const handleCreateOrUpdate = async (e) => {
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
      if (destination) {
        dispatch(updateDestination(destination._id, destinationData));
      } else {
        dispatch(createDestination(destinationData));
      }

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
      console.error("Error al crear o actualizar el destino:", error);
    }
  };

  return (
    <div>
      <form className="form-control text-center" onSubmit={handleCreateOrUpdate}>
        <h4>{destination ? "Edit Destination" : "Create a new destination"}</h4>
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Destination name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Description of the destination"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <CountryPicker onCountrySelect={handleCountryChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="googleMapsUrl" className="form-label">
                Google Maps URL
              </label>
              <input
                id="googleMapsUrl"
                type="url"
                className="form-control"
                placeholder="Google Maps URL"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="population" className="form-label">
                Population
              </label>
              <input
                id="population"
                type="text"
                className="form-control"
                placeholder="Population"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="surface" className="form-label">
                Surface (in km²)
              </label>
              <input
                id="surface"
                type="text"
                className="form-control"
                placeholder="Surface"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="climateGeneral" className="form-label">
                General Climate
              </label>
              <select
                id="climateGeneral"
                className="form-select"
                value={climateGeneral}
                onChange={(e) => setClimateGeneral(e.target.value)}
                required
              >
                <option value="">Select general climate</option>
                {climateTypeOptions.map((option, index) => (
                  <option key={index} value={option}>
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
                className="form-select"
                value={climateWinter}
                onChange={(e) => setClimateWinter(e.target.value)}
                required
              >
                <option value="">Select winter climate</option>
                {climateOptions.map((option, index) => (
                  <option key={index} value={option}>
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
                className="form-select"
                value={climateSummer}
                onChange={(e) => setClimateSummer(e.target.value)}
                required
              >
                <option value="">Select summer climate</option>
                {climateOptions.map((option, index) => (
                  <option key={index} value={option}>
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
                className="form-select"
                value={costOfLiving}
                onChange={(e) => setCostOfLiving(e.target.value)}
                required
              >
                <option value="">Select cost of living</option>
                {costOfLivingOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="languages" className="form-label">
                Languages
              </label>
              <div>
                <select
                  id="languages"
                  className="form-select d-inline-block w-75"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Select a language</option>
                  {allLanguages.map((lang, index) => (
                    <option key={index} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-warning ml-2"
                  onClick={handleAddLanguage}
                  style={{
                    backgroundColor: stateColors.one,
                    color: "#ffffff"
                  }}
                >
                  Add
                </button>
              </div>
              <ul className="list-group mt-2">
                {languages.map((lang, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {lang}
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
            </div>
            <div className="mb-3">
              <label htmlFor="universities" className="form-label">
                Universities
              </label>
              <div className="input-group mb-2">
                <input
                  id="universityName"
                  type="text"
                  className="form-control"
                  placeholder="University Name"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                />
                <input
                  id="universityUrl"
                  type="url"
                  className="form-control"
                  placeholder="University URL"
                  value={universityUrl}
                  onChange={(e) => setUniversityUrl(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleAddUniversity}
                  style={{
                    backgroundColor: stateColors.one,
                    color: "#ffffff"
                  }}
                >
                  Add
                </button>
              </div>
              <ul className="list-group">
                {universities.map((university, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <a
                      href={university.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {university.name}
                    </a>
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

            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                Frontpage
              </label>
              <PhotoCrop
              image={image}
              onImageChange={handleImageChange}
              onCropData={handleCropData}
              cropped={cropped}
              height={400}
              aspectRatio={2}
            />
            </div>
            <div className="mb-3">
              <button
              type="submit"
              style={{
                fontWeight: "bold",
                backgroundColor: stateColors.one,
                color: "#ffffff",
              }}
              className="btn btn-warning"
            >
              {destination ? "Save Changes" : "Create Destination"}
            </button>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;
