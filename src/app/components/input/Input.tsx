import React, { useEffect } from "react";
import stylesForm from "./Input.module.scss";
import Image from "next/image";

const Input = ({
  label,
  value,
  id,
  type,
  placeholder,
  onchange,
  validInput,
  errorMessage,
  image,
  alt,
  position,
  tab,
  style,
}: any) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(-1);

  useEffect(() => {
    if (type === "password") {
      setTabIndex(0);
    } else {
      setTabIndex(-1);
    }
  }, [type]);
  return (
    <div style={style} className={stylesForm.div}>
      <label
        className={`${
          value.length > 0
            ? stylesForm.div__label__value
            : stylesForm.div__label
        }`}
        htmlFor={id}
      >
        {label}
      </label>
      <div className={`${!image ? stylesForm.div__div : stylesForm.div__div}`}>
        <input
          autoFocus={position === "first" ? true : false}
          value={value}
          className={`${stylesForm.div__div__input} ${
            tab === false ? "modalOpen" : ""
          }`}
          type={type !== "password" ? type : showPassword ? "text" : "password"}
          name={id}
          id={id}
          placeholder={placeholder}
          onChange={(e) => {
            onchange(e);
          }}
        />
        {image && type === "password" && value.length > 0 && (
          <Image
            tabIndex={tabIndex}
            className={`${stylesForm.div__div__img} ${
              type === "password" ? stylesForm.div__div__img__password : ""
            }`}
            src={`${
              !showPassword
                ? `/assets/icone/${image}.svg`
                : `/assets/icone/eye-slash-solid.svg`
            }`}
            alt={`${!showPassword ? alt : "icone cacher mot de passe"}`}
            width={20}
            height={20}
            onClick={() => {
              if (type === "password") {
                if (value.length > 0) {
                  setShowPassword(!showPassword);
                }
              }
            }}
          />
        )}
        {image && type === "password" && value.length === 0 && (
          <Image
            className={`${stylesForm.div__div__img} ${
              type === "password" ? stylesForm.div__div__img__password : ""
            }`}
            src={`${
              !showPassword
                ? `/assets/icone/${image}.svg`
                : `/assets/icone/eye-slash-solid.svg`
            }`}
            alt={`${!showPassword ? alt : "icone cacher mot de passe"}`}
            width={20}
            height={20}
          />
        )}
        {image && type !== "password" && (
          <Image
            className={`${stylesForm.div__div__img}`}
            src={`/assets/icone/${image}.svg`}
            alt={alt}
            width={20}
            height={20}
          />
        )}
      </div>

      {validInput === false && (
        <div className={stylesForm.div__error}>{errorMessage}</div>
      )}
    </div>
  );
};

export default Input;
