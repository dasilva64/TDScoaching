import validator from "validator";

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
    if (key === "phone") {
      if (!validator.isMobilePhone(value.trim(), "fr-FR")) {
        arrayMessageError.push([
          "phone",
          "Téléphone : doit être un numéro de téléphone valide commençant par 06 or 07",
        ]);
      }
    }
    if (key === "birth") {
      if (!validator.isDate(value)) {
        arrayMessageError.push([
          "birth",
          "Date de naissance : doit avoir le format jj/mm/aaaa",
        ]);
      } else {
        let currentDate = new Date();
        let limiteDate = currentDate.setFullYear(
          currentDate.getFullYear() - 18
        );
        let choiceDate = new Date(value);
        if (choiceDate.getTime() > new Date(limiteDate).getTime()) {
          arrayMessageError.push([
            "birth",
            "Date de naissance : vous devez être majeur pour vous inscrire",
          ]);
        }
      }
    }
    if (key === "genre") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["genre", "Genre : ne peut pas être vide"]);
      } else {
        if (!validator.isIn(value, ["homme", "femme"])) {
          arrayMessageError.push(["genre", "Genre : ne peut pas être vide"]);
        }
      }
    }
    if (key === "formule") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["formule", "Formule : ne peut pas être vide"]);
      } else {
        if (!validator.isIn(value, ["unique", "flash", "longue"])) {
          arrayMessageError.push([
            "formule",
            "Formule : ne peut pas être vide",
          ]);
        }
      }
    }
  });
  return arrayMessageError;
};
