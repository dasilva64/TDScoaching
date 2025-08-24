export async function pdfSupabase(file: string) {
  const apiUrl = process.env.SUPABASE_STORAGE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const res = await fetch(apiUrl + file, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expiresIn: 60 }),
  });

  const { signedURL } = await res.json();
  const pdfResponse = await fetch(`${process.env.SUPABASE_BASE_URL_FETCH}${signedURL}`);
  if (!pdfResponse.ok) {
    throw new Error("Échec lors de la récupération du PDF");
  }

  const arrayBuffer: any = await pdfResponse.arrayBuffer();

  return arrayBuffer;
}