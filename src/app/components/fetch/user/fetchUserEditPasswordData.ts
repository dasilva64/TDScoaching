const fetchUserEditPasswordData = async (url: string, { arg }: { arg: { password: string }}) => {
  let response = await fetch("/api/user/editPasswordUser", {
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

export default fetchUserEditPasswordData;
