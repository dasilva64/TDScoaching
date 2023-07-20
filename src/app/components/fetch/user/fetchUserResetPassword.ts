const fetchUserResetPassword = async (
  url: string,
  { arg }: { arg: { password: string; token: string } }
) => {
  let response = await fetch(url, {
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

export default fetchUserResetPassword;
