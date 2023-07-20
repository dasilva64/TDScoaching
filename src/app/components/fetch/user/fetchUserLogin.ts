const fetchUserLogin = async (
  url: string,
  {
    arg,
  }: {
    arg: { mail: string; password: string; remember: boolean };
  }
) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  let json = await response.json();

  return json;
};

export default fetchUserLogin;
