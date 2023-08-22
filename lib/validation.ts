import validator from "validator";

export const validationBody = (body: any) => {
  let arrayMessageError: any = [];
  Object.entries(body).forEach(([key, value]: any) => {
    if (key === "email") {
      if (!validator.isEmail(value)) {
        arrayMessageError.push(["email", "Email : doit être un email valide"]);
      }
    }
    if (key === "firstname") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["firstname", "Prénom : ne peut pas être vide"]);
      }
    }
    if (key === "lastname") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push([
          "lastname",
          "Nom de famille : ne peut pas être vide",
        ]);
      }
    }
    if (key === "object") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["object", "Objet : ne peut pas être vide"]);
      }
    }
    if (key === "message") {
      if (validator.isEmpty(value)) {
        arrayMessageError.push(["message", "Message : ne peut pas être vide"]);
      }
    }
  });
  return arrayMessageError;
};
