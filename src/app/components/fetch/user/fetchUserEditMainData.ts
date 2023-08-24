const fetchUserEditMainData = async (
  url: string,
  { arg }: { arg: { firstname: string; lastname: string; pseudo: string } }
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

export default fetchUserEditMainData;
