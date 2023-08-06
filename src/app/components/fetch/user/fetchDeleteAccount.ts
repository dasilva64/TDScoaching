const fetchUserDeleteAccount = async (url: string) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let json = await response.json();
  return json;
};

export default fetchUserDeleteAccount;
