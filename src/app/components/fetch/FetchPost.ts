const fetchPost = async (url: string, { arg }: { arg: any }) => {
  let response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": arg.csrfToken,
    },
    body: JSON.stringify(arg),
  });
  let json = await response.json();
  return json;
};

export default fetchPost;