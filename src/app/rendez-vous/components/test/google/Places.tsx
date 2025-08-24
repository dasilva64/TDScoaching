import React, { useEffect } from "react";
import styles from "./Places.module.scss";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import Input from "@/app/components/input/Input";

const fetchPlaceDetails = async (placeId: string) => {
  const details: any = await getDetails({
    placeId,
    fields: ["address_components", "formatted_address"],
  });

  const components = details?.address_components;

  const getComponent = (type: string) =>
    components?.find((c: any) => c.types.includes(type))?.long_name || "";

  const city = getComponent("locality");
  const country = getComponent("country");

  return {
    city,
    country,
    fullAddress: details?.formatted_address,
  };
};

const lib: any = ["places"];
const Places = ({ errorCity, setErrorCity, setAdresse, setCity, setValidCity }: any) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    libraries: lib,
  });
  if (loadError) return <p>Erreur de chargement de Google Maps</p>;
  if (!isLoaded) return <p>Chargement de la carte...</p>;
  return (
    <>
      <div>
        <PlacesAutocomplete
          errorCity={errorCity}
          setErrorCity={setErrorCity}
          setAdresse={setAdresse}
          setCity={setCity}
          setValidCity={setValidCity}
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
  setValidCity
}: any) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "fr" },
    },
    debounce: 300,
  });
  const handlerInput = (e: any) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      setErrorCity("")
      setValidCity(true)
    } else {
      setValidCity(false)
      setErrorCity("Vous devez entrer une adresse")
    }
  };
  const frenchResults = data.filter(({ terms }) =>
    terms.some(term => term.value === "France")
  );
  return (
    <>
      <div>
        <Input
          disabled={!ready}
          label="Adresse"
          value={value}
          id="firstname"
          type="text"
          placeholder="Entrez votre adresse"
          onchange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            handlerInput(e);
          }}
          errorMessage={errorCity}
          image="house-solid"
          alt="icone house"
          position="first"
          tab={true}
        />
        {status === "OK" && frenchResults.length > 0 && (
          <div className={styles.places__all}>
            {frenchResults.map(
              ({ place_id, description, terms }, index: any) =>
                terms.some(term => term.value === "France") && (
                  <React.Fragment key={place_id}>
                    <p
                      className={styles.places__all__city}
                      onClick={() => {
                        const returnAdress = async () => {
                          const addressDetails = await fetchPlaceDetails(place_id);
                          if (!addressDetails.city || !addressDetails.country) {
                            clearSuggestions();
                            setValidCity(false)
                            setErrorCity("Veuillez sélectionner une adresse contenant au moins une ville et un pays.");
                          } else {
                            setValidCity(true)
                            setValue(addressDetails.fullAddress, false);
                            clearSuggestions();
                            setErrorCity("");
                            setAdresse(addressDetails.fullAddress);
                            setCity(addressDetails.city);
                          }
                        }
                        returnAdress()
                        //handleSelect(description, terms[1].value)
                      }}
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
        )}
      </div>
    </>
  );
};

export default Places;
