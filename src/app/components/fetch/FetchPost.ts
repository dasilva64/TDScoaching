const fetchPost = async (url: string, { arg }: { arg: any }) => {
  let response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(arg),
  });
  console.log("response", response);
  let json = await response.json();
  console.log("json", json);
  return json;
};

export default fetchPost;
