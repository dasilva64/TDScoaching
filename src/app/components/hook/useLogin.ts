const fetchUserLogin = async (
  url: string,
  {
    arg,
  }: {
    arg: { email: string; password: string; remember: boolean };
  }
) => {
  let response = await fetch("https://test-auth-next-plum.vercel.app/api/login", {
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
