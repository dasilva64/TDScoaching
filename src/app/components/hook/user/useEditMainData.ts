const fetchEditMainData = async (url: string, { arg }: { arg: { firstname: string, lastname: string }}) => {
  let response = await fetch("/api/user/editMainUser", {
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

export default fetchEditMainData;
