const fetchUserLogin = async (
  url: string,
  {
    arg,
  }: {
    arg: { email: string; password: string; remember: boolean };
  }
) => {
  let response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(arg),
  });
  let json = await response.json();
  return json;
};

export default fetchUserLogin;