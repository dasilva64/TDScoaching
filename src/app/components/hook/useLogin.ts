const fetchUserLogin = async (
  url: string,
  {
    arg,
  }: {
    arg: { email: string; password: string; remember: boolean };
  }
) => {
  let response = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  console.log(response);
  let json = await response.json();
  console.log(json);

  return json;
};

export default fetchUserLogin;
