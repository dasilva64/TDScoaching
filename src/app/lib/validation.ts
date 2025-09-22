import validator from "validator";

const allowedFields = [
  "email",
  "firstname",
  "lastname",
  "object",
  "message",
];

const dangerousPattern = /(script|onload|onerror|onclick|onmouseover|onmouseenter|javascript)/i;

export const validationBody = (body: any) => {
  
  let arrayMessageError: any = [];
  const unknownFields = Object.keys(body).filter(k => !allowedFields.includes(k));
  if (unknownFields.length > 0) {
    return [[
      "unknown_fields",
      `Requête rejetée : champs non autorisés détectés (${unknownFields.join(", ")})`
    ]];
  }
  Object.entries(body).forEach(([key, value]: any) => {
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
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "email",
              "Email : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
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
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "firstname",
              "Prénom : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
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
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "lastname",
              "Nom de famille : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
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
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "object",
              "Objet : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
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
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "message",
              "Message : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
        }
      }
    }
  });
  return arrayMessageError;
};
