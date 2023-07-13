const fetchEditSendToken = async (
  url: string,
  { arg }: { arg: { mail: string } }
) => {
  let response = await fetch("/api/user/sendTokenEditEmail", {
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

export default fetchEditSendToken;
