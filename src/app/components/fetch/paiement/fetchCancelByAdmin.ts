const fetchCancelByAdmin = async (
  url: string,
  { arg }: { arg: { meetingId: string; userId: string } }
) => {
  let response = await fetch("/api/paiement/cancelByAdmin", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(arg),
  });
  let json = await response.json();
  return json;
};

export default fetchCancelByAdmin;
