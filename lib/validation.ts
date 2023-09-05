import validator from "validator";
import moment from "moment";

export const validationBody = (body: any) => {
  let arrayMessageError: any = [];
  Object.entries(body).forEach(([key, value]: any) => {
    if (key === "email") {
      if (!validator.isEmail(value.trim())) {
        arrayMessageError.push(["email", "Email : doit être un email valide"]);
      }
    }
    if (key === "firstname") {
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["firstname", "Prénom : ne peut pas être vide"]);
      }
    }
    if (key === "lastname") {
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push([
          "lastname",
          "Nom de famille : ne peut pas être vide",
        ]);
      }
    }
    if (key === "object") {
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["object", "Objet : ne peut pas être vide"]);
      }
    }
    if (key === "message") {
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["message", "Message : ne peut pas être vide"]);
      }
    }
    if (key === "password") {
      if (!validator.matches(value.trim(), /^(?=.*[a-z]).{1,}$/)) {
        arrayMessageError.push([
          "password",
          "Mot de passe : doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
        ]);
      }
    }
    if (key === "formule") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["formule", "Formule : ne peut pas être vide"]);
      } else {
        if (!validator.isIn(value, ["unique", "flash", "longue"])) {
          arrayMessageError.push([
            "formule",
            "Formule : la valeur n'est pas valide",
          ]);
        }
      }
    }
    if (key === "typeCoaching") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push([
          "typeCoaching",
          "Type de coaching : ne peut pas être vide",
        ]);
      } else {
        if (!validator.isIn(value, ["familial", "couple", "professionnel"])) {
          arrayMessageError.push([
            "typeCoaching",
            "Type de coaching : la valeur n'est pas valide",
          ]);
        }
      }
    }
    if (key === "start") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["start", "Date : ne peut pas être vide"]);
      } else {
        if (!moment(new Date(value).toISOString()).isValid()) {
          arrayMessageError.push(["start", "Date : doit être une date valide"]);
        }
      }
    }
    if (key === "id" || key === "userId") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["id", "Id : ne peut pas être vide"]);
      } else {
        if (!validator.isUUID(value) && value.length !== 36) {
          arrayMessageError.push(["id", "Id : n'est pas un id valide"]);
        }
      }
    }
  });
  return arrayMessageError;
};
