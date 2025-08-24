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
  "typeOffre",
  "start",
  "id",
  "userId",
  "code",
  "reason",
  "remember",
  "adresse",
  "city",
  "signature",
  "majorInput",
  "cguInput",
  "cgvInput",
  "contratInput"
];

const dangerousPattern = /(script|onload|onerror|onclick|onmouseover|onmouseenter|javascript)/i;

export const validationBody = (body: any) => {
  
  let arrayMessageError: any = [];
  //let unknowField: any = []
  const unknownFields = Object.keys(body).filter(k => !allowedFields.includes(k));
  if (unknownFields.length > 0) {
    return [[
      "unknown_fields",
      `Requête rejetée : champs non autorisés détectés (${unknownFields.join(", ")})`
    ]];
  }
  Object.entries(body).forEach(([key, value]: any) => {
    /* if (!allowedFields.includes(key)) {
      unknowField.push(key);
    }; */
    if (key === "contratInput") {
      if (typeof value !== "boolean") {
        arrayMessageError.push([
          "contratInput",
          "Vous devez accepter le contrat",
        ]);
      } else {
        if (value !== true) {
          arrayMessageError.push([
            "contratInput",
            "Vous devez accepter le contrat",
          ]);
        }
      }
    }
    if (key === "majorInput") {
      if (typeof value !== "boolean") {
        arrayMessageError.push([
          "majorInput",
          "Vous devez être majeur",
        ]);
      } else {
        if (value !== true) {
          arrayMessageError.push([
            "majorInput",
            "Vous devez être majeur",
          ]);
        }
      }
    }
    if (key === "cguInput") {
      if (typeof value !== "boolean") {
        arrayMessageError.push([
          "cguInput",
          "Vous devez accepter les conditions générales d'utilisation",
        ]);
      } else {
        if (value !== true) {
          arrayMessageError.push([
            "cguInput",
            "Vous devez accepter les conditions générales d'utilisation",
          ]);
        }
      }
    }
    if (key === "cgvInput") {
      if (typeof value !== "boolean") {
        arrayMessageError.push([
          "cgvInput",
          "Vous devez accepter les conditions générales de vente",
        ]);
      } else {
        if (value !== true) {
          arrayMessageError.push([
            "cgvInput",
            "Vous devez accepter les conditions générales de vente",
          ]);
        }
      }
    }
    if (key === "remember") {
      if (typeof value !== "boolean") {
        arrayMessageError.push([
          "remember",
          "Le champ 'remember' doit être un booléen (true ou false)",
        ]);
      }
    }
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
    if (key === "password") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["password", "Mot de passe : ne peut pas être vide"]);
      } else {
        if (
          !validator.matches(
            value.trim(),
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#,_])[A-Za-z\d-?!*:@~%.;+|$#,_]{12,}$/
          )
        ) {
          arrayMessageError.push([
            "password",
            "Mot de passe : doit avoir une lettre en minuscule, majuscule, un nombre, un caractère spécial (-?!*:@~%.;+|$#,_) et 12 caractères minimum",
          ]);
        }
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
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "formule",
              "Formule : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
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
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "typeCoaching",
              "Type de coaching : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
        }
      }
    }
    if (key === "typeOffre") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push([
          "typeOffre",
          "Type d'offre : ne peut pas être vide",
        ]);
      } else {
        if (!validator.isIn(value, ["flash", "unique", "custom"])) {
          arrayMessageError.push([
            "typeOffre",
            "Type d'offre : la valeur n'est pas valide",
          ]);
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "typeOffre",
              "Type d'offre : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
        }
      }
    }
    if (key === "start") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["start", "Date : ne peut pas être vide"]);
      } else {
        if (!validator.isISO8601(value)) {
          arrayMessageError.push(["start", "Date : doit être une date valide"]);
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "start",
              "Date : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
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
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "id",
              "Id : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
        }
      }
    }
    if (key === "code") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["code", "Code : ne peut pas être vide"]);
      } else {
        const regex = /^[0-9]{8}$/;

        if (!regex.test(value)) {
          arrayMessageError.push([
            "code",
            "Code : format invalide (8 chiffres)",
          ]);
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "code",
              "Code : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
        }
      }
    }
    if (key === "reason") {
      let regex = /^[A-Za-z0-9À-ÿ,()?!;:"'#@_. -]+$/;
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["reason", "Raison : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "reason",
            "Raison : ne peut contenir que des lettres, des chiffres et des ponctuations",
          ]);
        } else {
          if (dangerousPattern.test(value.trim())) {
            arrayMessageError.push([
              "reason",
              "Raison : contient un ou plusieurs mots interdits pour des raisons de sécurité (script, onload, onerror, onclick, onmouseover, onmouseenter, javascript)",
            ]);
          }
        }
      }
    }
    if (key === "signature") {
      if (typeof value !== "string" || validator.isEmpty(value.trim())) {
        arrayMessageError.push(["signature", "Signature : ne peut pas être vide"]);
      } else {
        // Vérifie que c'est bien une dataURL d'image
        const dataUrlPattern = /^data:image\/(png|jpg|jpeg);base64,/;
        if (!dataUrlPattern.test(value.trim())) {
          arrayMessageError.push([
            "signature",
            "Signature : format invalide (doit être une image encodée en base64)",
          ]);
        } else if (dangerousPattern.test(value.trim())) {
          arrayMessageError.push([
            "signature",
            "Signature : contient un ou plusieurs mots interdits pour des raisons de sécurité",
          ]);
        }
      }
    }

    if (key === "city") {
      let regex = /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ \-']{2,40}$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["city", "Ville : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "city",
            "Ville : doit contenir uniquement des lettres et entre 2 et 40 caractères",
          ]);
        } else if (dangerousPattern.test(value.trim())) {
          arrayMessageError.push([
            "city",
            "Ville : contient un ou plusieurs mots interdits pour des raisons de sécurité",
          ]);
        }
      }
    }

    if (key === "adresse") {
      let regex = /^[A-Za-z0-9À-ÿ][A-Za-z0-9À-ÿ,()?!;:"'#@_. \-]{5,100}$/;
      if (validator.isEmpty(value.trim())) {
        arrayMessageError.push(["adresse", "Adresse : ne peut pas être vide"]);
      } else {
        if (!validator.matches(value.trim(), regex)) {
          arrayMessageError.push([
            "adresse",
            "Adresse : format invalide (entre 5 et 100 caractères, lettres, chiffres, ponctuation)",
          ]);
        } else if (dangerousPattern.test(value.trim())) {
          arrayMessageError.push([
            "adresse",
            "Adresse : contient un ou plusieurs mots interdits pour des raisons de sécurité",
          ]);
        }
      }
    }
  });
   /*const unknown = Object.keys(body).filter(k => !allowedFields.includes(k));
  if (unknown.length) {
    return [[
      "unknown_fields",
      `Champs non autorisés : ${unknown.join(", ")}`
    ]];
  }
 if (unknowField.length > 0) {
    arrayMessageError.push([
      "unknow",
      unknowField,
    ]);
      arrayMessageError.push([
     "unknown_fields",
     `Champs non autorisés détectés : ${unknowField.join(", ")}`
   ]); 
  }*/
  return arrayMessageError;
};
