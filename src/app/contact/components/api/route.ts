import { NextRequest, NextResponse } from "next/server";
import { validationBody } from "../../../lib/validation";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-contact');
    if (rateLimitResponse) return rateLimitResponse;
    try {
      const { email, firstname, lastname, object, message, pseudo } =
        await request.json();

      let arrayMessageError = validationBody({
        email: email,
        firstname: firstname,
        lastname: lastname,
        object: object,
        message: message,
      });
      if (arrayMessageError.length > 0) {
        if (arrayMessageError.length === 1) {
          if (arrayMessageError[0][0] === "unknown_fields") {
            return NextResponse.json(
              {
                status: 400,
                message: arrayMessageError[0][1],
              },
              {
                status: 400,
              }
            );
          }
        }
        return NextResponse.json(
          {
            status: 400,
            type: "validation",
            message: arrayMessageError,
          },
          {
            status: 400,
          }
        );
      }
      if (pseudo.trim() !== "") {
        return NextResponse.json(
          {
            status: 400,
            type: "error",
            message:
              "Une erreur est survenue lors de l'envoie du message, veuillez réessayer plus tard",
          },
          {
            status: 400,
          }
        );
      } else {
          try {
            await resend.emails.send({
              from: 'contact@tdscoaching.fr',
              to: 'contact@tdscoaching.fr',
              subject: object.trim(),
              html: `<!DOCTYPE html>
                          <html lang="fr">
                            <head>
                              <title>tds coaching</title>
                              <meta charset="UTF-8" />
                              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                              <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                              <title>Document</title>
                            </head>
                            <body>
                              
                              <div style="width: 100%">
                                <div style="text-align: center">
                                  <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                </div>
                                <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                  <h1 style="text-align: center">tds coaching</h1>
                                  <h2 style="text-align: center">${firstname.trim()
                } ${lastname.trim()
                } vous a envoyé un message</h2>
                                  <p style="text-align: left; margin-left: 20px">Email : ${email.trim()
                }</p>
                                  <p style="text-align: left; margin-left: 20px">Message : ${message.trim()
                }</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
            });
          } catch (error) {
            return NextResponse.json(
              {
                message: "Erreur lors de l'envoi du mail :", error,

                status: 400
              },
              { status: 400 }
            );
          }
        try {
          await resend.emails.send({
            from: 'contact@tdscoaching.fr',
            to: email.trim(),
            subject: object.trim(),
            html: `<!DOCTYPE html>
                        <html lang="fr">
                          <head>
                            <title>tds coaching</title>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                            <title>Document</title>
                          </head>
                          <body>
                            
                            <div style="width: 100%">
                              <div style="text-align: center">
                                <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                              </div>
                              <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                <h1 style="text-align: center">tds coaching a reçu votre message</h1>
                                <h2 style="text-align: center">Rappel du message</h2>
                                <p style="text-align: left; margin-left: 20px">Email : ${email.trim()
              }</p>
                                <p style="text-align: left; margin-left: 20px">Prénom : ${firstname.trim()
              }</p>
                                <p style="text-align: left; margin-left: 20px">Nom de famille : ${lastname.trim()
              }</p>
                                <p style="text-align: left; margin-left: 20px">Objet : ${object.trim()
              }</p>
                                <p style="text-align: left; margin-left: 20px">Message : ${message.trim()
              }</p>
                              </div>
                            </div>
                          </body>
                        </html>`,
          });
        } catch (error) {
          return NextResponse.json(
            {
              message: "Erreur lors de l'envoi du mail :", error,

              status: 400
            },
            { status: 400 }
          );
        }

        return NextResponse.json({
          status: 200,
          message:
            "Merci de nous avoir contacté, nous allons vous répondre le plus vite possible",
        });
      }
    } catch (err) {
      return NextResponse.json(
        {
          status: 429,
          type: "error",
          message: "Trop de requêtes successives, veuillez réessayer plus tard",
        },
        {
          status: 429,
        }
      );
    }
  } catch (error) {
    console.log(error)
   return NextResponse.json({
    status: 500,
    message: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
  }, { status: 500 });
  }

}
