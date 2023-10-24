import validator from "validator";
import moment from "moment";

export const validationBody = (body: any) => {
  let arrayMessageError: any = [];
  Object.entries(body).forEach(([key, value]: any) => {
    if (key === "email") {
      // if (!validator.isEmail(value.trim())) {
      arrayMessageError.push(["email", "Email : doit être un email valide"]);
      //}
    }
    if (key === "firstname") {
      let regex = /^[a-zA-ZÀ-ÿ]+$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["firstname", "Prénom : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "firstname",
            "Prénom : ne peut contenir que des lettres",
          ]);
        }
      }
    }
    if (key === "lastname") {
      let regex = /^[a-zA-ZÀ-ÿ]+$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push([
          "lastname",
          "Nom de famille : ne peut pas être vide",
        ]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "lastname",
            "Nom de famille : ne peut contenir que des lettres",
          ]);
        }
      }
    }
    if (key === "object") {
      // give me a regex for accept all punctuation
      let regex = /^[A-Za-z0-9,()?!;:"'@#-_\. ]{0,50}$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["object", "Objet : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "object",
            "Objet : ne peut contenir que des lettres, des chiffres, des ponctuations et doit contenir moins de 50 caractères",
          ]);
        }
      }
    }
    if (key === "message") {
      let regex = /^[A-Za-z0-9,()?!;:"'@#-_\. ]+$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["message", "Message : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "message",
            "Message : ne peut contenir que des lettres, des chiffres et des ponctuations",
          ]);
        }
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
      let regex = /^[0-9a-fA-F-]{36,36}$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["id", "Id : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push(["id", "Id : n'est pas un id valide"]);
        }
      }
    }
    if (key === "code") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["code", "Code : ne peut pas être vide"]);
      } else {
        if (!validator.isNumeric(value)) {
          arrayMessageError.push(["code", "Code : doit être un nombre"]);
        }
        if (value.length !== 8) {
          arrayMessageError.push(["code", "Code : doit contenir 8 chiffres"]);
        }
      }
    }
    if (key === "reason") {
      let regex = /^[A-Za-z0-9,()?!;:"'@#-_\. ]+$/;
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["reason", "Raison : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "reason",
            "Raison : ne peut contenir que des lettres, des chiffres et des ponctuations",
          ]);
        }
      }
    }
  });
  return arrayMessageError;
};
