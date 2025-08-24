// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supUrl = Deno.env.get("SUPABASE_URL") as string;
const supKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const resendKey = Deno.env.get("_RESEND_API_KEY") as string
const supabase = createClient(supUrl, supKey);
/* const client = new SmtpClient({
  content_encoding: "quoted-printable", // 7bit, 8bit, base64, binary, quoted-printable
}); */

serve(async (req) => {
  let { data: user, error: errorMeet } = await supabase.from('User').select(`
    id,
    role,
    firstname,
    mail,
    resettoken:  resetToken->token,
    registertoken:        registerToken->token,
    resetlimite:      resetToken->limitDate,
    registerlimite:     registerToken->limitDate,
    editemailToken: editEmail->token,
    editemaillimite: editEmail->limitDate,
    deleteToken: deleteToken->token,
    deletelimit: deleteToken->limitDate,
    twoFAToken: twoFAToken->token,
    twoFALimit: twoFAToken->limitDate,
    meetingId,
    meetingconfirm: meetingId(status),
    meetingtoken: meetingId(token),
    meetingstart: meetingId(startAt),
    meetingremimdersent: meetingId(reminderSent),
    meetingrappelsent: meetingId(rappelSent),
    offrecoaching: offreId(coaching),
    offretype: offreId(type)
  `);
  for (let i = 0; i < user.length; i++) {
    if (user[i].registertoken !== null) {
      if (new Date().getTime() > new Date(user[i].registerlimite).getTime()) {
        await supabase.from("User").delete().eq("id", user[i].id);
      }
    }
    if (user[i].twoFAToken !== null) {
      if (new Date().getTime() > new Date(user[i].twoFALimit).getTime()) {
        await supabase
          .from("User")
          .update({ twoFAToken: null })
          .eq("id", user[i].id)
          .select();
      }
    }

    if (user[i].resettoken !== null) {
      if (new Date().getTime() > new Date(user[i].resetlimite).getTime()) {
        await supabase
          .from("User")
          .update({ resetToken: null })
          .eq("id", user[i].id)
          .select();
      }
    }
    if (user[i].editemailToken !== null) {
      if (new Date().getTime() > new Date(user[i].editemaillimite).getTime()) {
        await supabase
          .from("User")
          .update({ editEmail: null })
          .eq("id", user[i].id)
          .select();
      }
    }
    if (user[i].deleteToken !== null) {
      if (new Date().getTime() > new Date(user[i].deletelimit).getTime()) {
        await supabase
          .from("User")
          .update({ deleteToken: null, deleteReason: null })
          .eq("id", user[i].id)
          .select();
      }
    }
    if (user[i].meetingId !== null) {
      if (user[i].meetingconfirm.status === "not_confirmed") {
        if (new Date(user[i].meetingstart.startAt).getTime() - 12 * 60 * 60 * 1000 < new Date().getTime()) {
          const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>tds coaching</title>
      </head>
      <body>
        <div style="width: 100%">
          <div style="text-align: center">
            <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
          </div>
          <div style="background: aqua; padding: 50px 20px; border-radius: 20px">
            <h1 style="text-align: center">tds coaching</h1>
            <h2 style="text-align: center">Votre rendez-vous a expiré</h2>
            <p>Bonjour ${user[i].firstname},</p>
            <p>Votre rendez-vous a expiré :</p>
            <ul>
              <li>ID du rendez-vous : ${user[i].meetingId}</li>
              <li>Date : ${new Date(user[i].meetingstart.startAt).toLocaleDateString("fr-FR")}</li>
              <li>Heure : ${new Date(user[i].meetingstart.startAt).toLocaleTimeString("fr-FR")}</li>
              <li>Type : ${user[i].offretype.type === "discovery" ? "Découverte" : user[i].offretype.type[0].toUpperCase() + user[i].offretype.type.slice(1)}</li>
              <li>Type de coaching : ${user[i].offrecoaching.coaching}</li>
              <li>Prix : Gratuit</li>
            </ul>
            <p style="margin-bottom: 20px;">Vous pouvez reprendre un autre rendez-vous en cliquant sur le bouton ci-dessous</p>
            <a href="https://tdscoaching.fr/rendez-vous" style="text-decoration: none; padding: 10px; border-radius: 10px; background: orange; color: white;">Reprendre un rendez-vous</a>
            <p style="margin-top: 20px;">Ce message est personnel. Ne le transférez pas sans votre accord.</p>
          </div>
        </div>
      </body>
    </html>
  `;

          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${Deno.env.get("_RESEND_API_KEY")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "contact@tdscoaching.fr",
              to: user[i].mail,
              subject: "[Expiration] Votre rendez-vous a expiré",
              html: htmlContent,
            }),
          });
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Erreur lors de l'envoi du mail avec Resend :", errorText);
          } else {
            if (user[i].meetingtoken.token !== null || user[i].meetingtoken.token.length > 0) {
              await supabase.from("meeting_test").update({
                status: "expired",
                token: null
              }).eq("id", user[i].meetingId);
            } else {
              await supabase.from("meeting_test").update({
                status: "expired"
              }).eq("id", user[i].meetingId);
            }

          }


        }
        if (new Date(user[i].meetingstart.startAt).getTime() - 24 * 60 * 60 * 1000 < new Date().getTime()) {
          if (user[i].meetingremimdersent.reminderSent === false) {
            const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>tds coaching</title>
      </head>
      <body>
        <div style="width: 100%">
          <div style="text-align: center">
            <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
          </div>
          <div style="background: aqua; padding: 50px 20px; border-radius: 20px">
            <h1 style="text-align: center">tds coaching</h1>
            <h2 style="text-align: center">Rappel important – confirmation requise</h2>
            <p>Bonjour ${user[i].firstname},</p>
            <p>Votre rendez-vous approche et <strong>nécessite une confirmation avant expiration</strong> :</p>
            <ul>
              <li>ID du rendez-vous : ${user[i].meetingId}</li>
              <li>Date : ${new Date(user[i].meetingstart.startAt).toLocaleDateString("fr-FR")}</li>
              <li>Heure : ${new Date(user[i].meetingstart.startAt).toLocaleTimeString("fr-FR")}</li>
              <li>Type : ${user[i].offretype.type === "discovery" ? "Découverte" : user[i].offretype.type[0].toUpperCase() + user[i].offretype.type.slice(1)}</li>
              <li>Type de coaching : ${user[i].offrecoaching.coaching}</li>
              <li>Prix : Gratuit</li>
            </ul>
            <p style="margin-bottom: 20px; color: red;"><strong>⚠️ Merci de confirmer votre présence au plus tard 12h avant le rendez-vous.</strong></p>
            <p>Pour cela, cliquez ci-dessous :</p>
            <a href="https://tdscoaching.fr/rendez-vous" style="text-decoration: none; padding: 10px; border-radius: 10px; background: orange; color: white;">Confirmer mon rendez-vous</a>
            <p style="margin-top: 20px;">Ce message est personnel. Ne le transférez pas sans votre accord.</p>
          </div>
        </div>
      </body>
    </html>
  `;

            const response = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${Deno.env.get("_RESEND_API_KEY")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "contact@tdscoaching.fr",
                to: user[i].mail,
                subject: "[Rappel] Confirmation requise de votre rendez-vous",
                html: htmlContent,
              }),
            });
            if (!response.ok) {
              const errorText = await response.text();
              console.error("Erreur lors de l'envoi du mail avec Resend :", errorText);
            } else {
              await supabase.from("meeting_test").update({
                reminderSent: true
              }).eq("id", user[i].meetingId);
            }

          }

        }
      }
      if (user[i].meetingconfirm.status === "confirmed") {
        if (new Date(user[i].meetingstart.startAt).getTime() - 6 * 60 * 60 * 1000 < new Date().getTime()) {
          if (user[i].meetingrappelsent.rappelSent === false) {
            const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>tds coaching</title>
      </head>
      <body>
        <div style="width: 100%">
          <div style="text-align: center">
            <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
          </div>
          <div style="background: aqua; padding: 50px 20px; border-radius: 20px">
            <h1 style="text-align: center">tds coaching</h1>
            <h2 style="text-align: center">Lien de la visioconférence</h2>
            <p>Bonjour ${user[i].firstname},</p>
            <p>Votre rendez-vous approche :</p>
            <ul>
              <li>ID du rendez-vous : ${user[i].meetingId}</li>
              <li>Date : ${new Date(user[i].meetingstart.startAt).toLocaleDateString("fr-FR")}</li>
              <li>Heure : ${new Date(user[i].meetingstart.startAt).toLocaleTimeString("fr-FR")}</li>
              <li>Type : ${user[i].offretype.type === "discovery" ? "Découverte" : user[i].offretype.type[0].toUpperCase() + user[i].offretype.type.slice(1)}</li>
              <li>Type de coaching : ${user[i].offrecoaching.coaching}</li>
              <li>Prix : Gratuit</li>
            </ul>
            <p>Le lien de la visioconférence a été générer, pour y accèder veuillez cliquer sur le bouton ci-dessous</p>
            <a href="https://tdscoaching.fr/rendez-vous" style="margin-bottom: 10px; text-decoration: none; padding: 10px; border-radius: 10px; background: orange; color: white;">Lien de la visioconférence</a>
            <p>Vous pouvez voir les détail de votre rendez-vous en cliquant sur le bouton ci-dessous</p>
            <a href="https://tdscoaching.fr/rendez-vous" style="text-decoration: none; padding: 10px; border-radius: 10px; background: orange; color: white;">Mon rendez-vous</a>
            <p style="margin-top: 20px;">Ce message est personnel. Ne le transférez pas sans votre accord.</p>
          </div>
        </div>
      </body>
    </html>
  `;

            const response = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${Deno.env.get("_RESEND_API_KEY")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "contact@tdscoaching.fr",
                to: user[i].mail,
                subject: "[Rappel] Lien de la visioconférence de votre rendez-vous",
                html: htmlContent,
              }),
            });
            if (!response.ok) {
              const errorText = await response.text();
              console.error("Erreur lors de l'envoi du mail avec Resend :", errorText);
            } else {
              await supabase.from("meeting_test").update({
                rappelSent: true
              }).eq("id", user[i].meetingId);
            }

          }

        }
      }

    }
  }
  const { name } = await req.json();
  let data = { message: `Hello good` };
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'