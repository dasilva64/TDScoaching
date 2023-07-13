const fetchEditEmailData = async (url: string, { arg }: { arg: { code: string }}) => {
  let response = await fetch("/api/user/editEmailUser", {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(arg),
  });
  let json = await response.json();
  return json;
};



export default fetchEditEmailData;
