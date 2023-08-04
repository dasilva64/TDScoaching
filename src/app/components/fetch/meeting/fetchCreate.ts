const fetchCreate = async (url: string, { arg }: { arg: { start: Date } }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  const json = await response.json();
  return json;
};

export default fetchCreate;
