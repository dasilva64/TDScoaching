const fetchCancel = async (url: string) => {
  console.log(url);
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

export default fetchCancel;
