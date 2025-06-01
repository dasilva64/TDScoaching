import validator from "validator";

const allowedFields = [
  "email",
  "firstname",
  "lastname",
  "object",
  "message",
  "password",
  "formule",
  "typeCoaching",
  "start",
  "id",
  "userId",
  "code",
  "reason"
];

export const validationBody = (body: any) => {
  let arrayMessageError: any = [];
  Object.entries(body).forEach(([key, value]: any) => {
    if (!allowedFields.includes(key)) return;
    if (key === "email") {
      let regex = /^.{5,50}$/;
      if (!validator.isEmail(value.trim(), { ignore_max_length: true })) {
        arrayMessageError.push([
          "email",
          "Email : doit avoir un format valide",
        ]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "email",
            "Email : doit contenir entre 5 et 50 caractères",
          ]);
        }
      }
    }
    if (key === "firstname") {
      let regex = /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["firstname", "Prénom : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "firstname",
            "Prénom : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères",
          ]);
        }
      }
    }
    if (key === "lastname") {
      let regex = /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push([
          "lastname",
          "Nom de famille : ne peut pas être vide",
        ]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "lastname",
            "Nom de famille : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères",
          ]);
        }
      }
    }
    if (key === "object") {
      let regex = /^[A-Za-z0-9À-ÿ][A-Za-z0-9À-ÿ,()?!;:"'#@_. -]{1,50}$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["object", "Objet : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "object",
            "Objet : doit contenir entre 2 et 50 caractères (lettre, chiffre, ponctuation) et ne peut pas commencer par une ponctuation",
          ]);
        }
      }
    }
    if (key === "message") {
      let regex = /^[A-Za-z0-9À-ÿ][A-Za-z0-9À-ÿ,()?!;:"'#@_. -]{1,}$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["message", "Message : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "message",
            "Message : doit contenir au moins 2 caractères (lettre, chiffre, ponctuation) et ne peut pas commencer par une ponctuation",
          ]);
        }
      }
    }
    if (key === "password") {
      if (
        !validator.matches(
          value.trim(),
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#=&,_])[A-Za-z\d-?!*:@~%.;+|$#=&,_]{12,}$/
        )
      ) {
        arrayMessageError.push([
          "password",
          "Mot de passe : doit avoir une lettre en minuscule, majuscule, un nombre, un caractère spécial (-?!*:@~%)(.;+{\"|$#}=['&,_) et 12 caractères minimum",
        ]);
      }
    }
    if (key === "formule") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["formule", "Formule : ne peut pas être vide"]);
      } else {
        if (!validator.isIn(value, ["unique", "flash", "custom"])) {
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
        if (!validator.isIn(value, ["familial", "couple", "professionnel", "autre"])) {
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
        if (isNaN(Date.parse(value))) {
          arrayMessageError.push(["start", "Date : doit être une date valide"]);
        }
      }
    }
    if (key === "id" || key === "userId") {
      let regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
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
        const regex = /^[a-zA-Z0-9?.@&#$,;:!]{14}$/;
    
        if (!regex.test(value)) {
          arrayMessageError.push([
            "code",
            "Code : format invalide (14 caractères, lettres, chiffres et certains symboles spéciaux uniquement)",
          ]);
        }
      }
    }
    if (key === "reason") {
      let regex = /^[A-Za-z0-9À-ÿ,()?!;:"'@#-_\. ]+$/;
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
