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
  const [languages, setLanguages] = useState("");
  const [population, setPopulation] = useState("");
  const [surface, setSurface] = useState("");
  const [countries, setCountries] = useState({});
  const [countryNames, setCountryNames] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCountryFlags = async () => {
      try {
        const response = await axios.get("https://flagcdn.com/en/codes.json");
        const data = response.data;

        // Eliminar estados de USA
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

    fetchCountryFlags();
  }, []);

  const uploadPhotoToBack = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/dests/upload-dest-photo",formData,
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
      languages,
      population,
      surface,
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
      setLanguages("");
      setPopulation("");
      setSurface("");

      window.location.reload();
    } catch (error) {
      console.error("Error creating destination:", error);
    }
  };

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
              <input
                type="text"
                className="form-control"
                id="climateGeneral"
                value={climateGeneral}
                onChange={(e) => setClimateGeneral(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="climateWinter" className="form-label">
                Winter Climate
              </label>
              <input
                type="text"
                className="form-control"
                id="climateWinter"
                value={climateWinter}
                onChange={(e) => setClimateWinter(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="climateSummer" className="form-label">
                Summer Climate
              </label>
              <input
                type="text"
                className="form-control"
                id="climateSummer"
                value={climateSummer}
                onChange={(e) => setClimateSummer(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="costOfLiving" className="form-label">
                Cost of Living
              </label>
              <input
                type="text"
                className="form-control"
                id="costOfLiving"
                value={costOfLiving}
                onChange={(e) => setCostOfLiving(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="languages" className="form-label">
                Languages
              </label>
              <input
                type="text"
                className="form-control"
                id="languages"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
              />
            </div>

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
