const fetchUserEditEmailData = async (url: string, { arg }: { arg: { code: string }}) => {
  let response = await fetch(url, {
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



export default fetchUserEditEmailData;
