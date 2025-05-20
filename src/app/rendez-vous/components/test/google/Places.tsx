import React from "react";
import styles from "./Places.module.scss";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { Visibility } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormHelperText,
} from "@mui/material";

const lib: any = ["places"];
const Places = ({ errorCity, setErrorCity, setAdresse, setCity }: any) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    libraries: lib,
  });
  return (
    <>
      <div>
        <PlacesAutocomplete
          errorCity={errorCity}
          setErrorCity={setErrorCity}
          setAdresse={setAdresse}
          setCity={setCity}
        />
      </div>
    </>
  );
};

const PlacesAutocomplete = ({
  errorCity,
  setErrorCity,
  setAdresse,
  setCity,
}: any) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();
  const handleSelect = async (address: any, city: any) => {
    setValue(address, false);
    clearSuggestions();
    setErrorCity("");
    setAdresse(address);
    setCity(city);
  };
  return (
    <>
      <div>
        <FormControl variant="standard" sx={{ width: "100%" }}>
          <InputLabel
            sx={{
              color: "black",
              "&.Mui-focused": {
                color: "#1976d2",
              },
            }}
            htmlFor="standard-adornment-email"
          >
            Adresse
          </InputLabel>
          <Input
            disabled={!ready}
            autoFocus
            id="standard-adornment-email"
            value={value}
            placeholder={"Entrez votre adresse"}
            type={"text"}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <LocationCityIcon
                  sx={{ color: "black" }}
                  aria-label="toggle email visibility"
                >
                  <Visibility />
                </LocationCityIcon>
              </InputAdornment>
            }
          />
          <FormHelperText>{errorCity}</FormHelperText>
        </FormControl>
        {status === "OK" && data.length > 0 && (
          <div className={styles.places__all}>
            {data.map(
              ({ place_id, description, terms }, index: any) =>
                terms[terms.length - 1].value === "France" && (
                  <React.Fragment key={place_id}>
                    <p
                      className={styles.places__all__city}
                      onClick={() => handleSelect(description, terms[1].value)}
                    >
                      {description}
                      {data.length - 1 !== index && (
                        <div className={styles.places__all__city__line}></div>
                      )}
                      {data.length - 1 === index && (
                        <div
                          className={styles.places__all__city__padding}
                        ></div>
                      )}
                    </p>{" "}
                  </React.Fragment>
                )
            )}
          </div>
        )}{" "}
        {/*  <div>
            {status === "OK" &&
              data.length > 0 &&
              data.map(
                ({ place_id, description, terms }: any) =>
                  terms[terms.length - 1].value === "France" && (
                    <p onClick={() => handleSelect(description)} key={place_id}>
                      {description}
                    </p>
                  )
              )}
          </div> */}
      </div>
    </>
  );
};

export default Places;
