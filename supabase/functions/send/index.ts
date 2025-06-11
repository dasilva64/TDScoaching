// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supUrl = Deno.env.get("_SUPABASE_URL") as string;
const supKey = Deno.env.get("_SUPABASE_SERVICE_KEY") as string;
const supabase = createClient(supUrl, supKey);
/* const client = new SmtpClient({
  content_encoding: "quoted-printable", // 7bit, 8bit, base64, binary, quoted-printable
}); */

serve(async (req) => {
  
   let { data: user, error: errorMeet } = await supabase.from("User").select(`
    id,
    role,
    resettoken:  resetToken->token,
    registertoken:        registerToken->token,
    resetlimite:      resetToken->limitDate,
    registerlimite:     registerToken->limitDate,
    editemailToken: editEmail->token,
    editemaillimite: editEmail->limitDate,
    deleteToken: deleteToken->token,
    deletelimit: deleteToken->limitDate,
    meetingId,
    meetingconfirm: meetingId(confirm),
    meetingstart: meetingId(startAt)
  `);
  for (let i = 0; i < user.length; i++) {
    if (user[i].registertoken !== null) {
      if (new Date().getTime() > new Date(user[i].registerlimite).getTime()) {
        await supabase.from("User").delete().eq("id", user[i].id);
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
      if (user[i].meetingconfirm.confirm === false) {
        if (new Date(user[i].meetingstart.startAt).getTime() - 24 * 60 * 60 * 1000 < new Date().getTime()) {
          await supabase
            .from("User")
            .update({ meetingId: null})
            .eq("id", user[i].id)
            .select();
            await supabase.from("meeting_test").delete().eq("id", user[i].meetingId);
            if (user[i].password === null) {
              await supabase.from("User").delete().eq("id", user[i].id);
            }

        }
      }
    }
  }

  /* await client.connectTLS({
    hostname: "smtp.gmail.com",
    port: 465,
    username: "thomasdasilva010@gmail.com",
    password: "zcijrlsalibfiytj",
  });
  try {
    await client.send({
      from: "thomasdasilva010@gmail.com",
      to: "thomasdasilva010@gmail.com",
      subject: "Lien d'accès à la réunion",
      html: ` <div style="width: 100%">
                <div style="text-align: center">
                  <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                </div>
                <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                  <h1 style="text-align: center">tds coaching</h1>
                  <h2 style="text-align: center">Vous pouvez maintenant accèder à votre rendez-vous</h2>
                  <p style="margin-bottom: 20px">Pour y accèder, veuillez cliquer sur le lien ci-dessous.</p>
                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="http://localhost:3000" target="_blank">Mon rendez-vous</a>
                </div>
              </div>`,
    });
  } catch (error) {
    return new Response("erreur", { status: 500 });
  }

  await client.close(); */
  /* let { data: Meeting, error: errorMeet } = await supabase
    .from("Meeting")
    .select("*");
  let current = new Date();
  let test = current.setHours(current.getHours() + 348);
  let ar = "";
  Meeting.forEach((meet) => {
    if (new Date(test) > new Date(meet.startAt)) {
      if (meet.link === null) {
        async function updateMeeting() {
          const { data, error: errorMeet } = await supabase
            .from("Meeting")
            .update({ link: "http://localhost:3000" })
            .eq("id", meet.id);

          let { data: User, error: errorUser } = await supabase
            .from("User")
            .select("*")
            .eq("id", meet.userId);

          await client.connectTLS({
            hostname: "smtp.gmail.com",
            port: 465,
            username: Deno.env.get("_SECRET_SMTP_EMAIL"),
            password: Deno.env.get("_SECRET_SMTP_PASSWORD"),
          });
          try {
            await client.send({
              from: "thomasdasilva010@gmail.com",
              to: "thomasdasilva010@gmail.com",
              subject: "Lien d'accès à la réunion",
              html: ` <div style="width: 100%">
                        <div style="text-align: center">
                          <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                        </div>
                        <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                          <h1 style="text-align: center">tds coaching</h1>
                          <h2 style="text-align: center">Vous pouvez maintenant accèder à votre rendez-vous</h2>
                          <p style="margin-bottom: 20px">Pour y accèder, veuillez cliquer sur le lien ci-dessous.</p>
                          <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="http://localhost:3000" target="_blank">Mon rendez-vous</a>
                        </div>
                      </div>`,
            });
          } catch (error) {
            return new Response(error.message, { status: 500 });
          }

          await client.close();
        }
        updateMeeting();
      }
    }
  }); */
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
