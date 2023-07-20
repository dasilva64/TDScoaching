const fetchDeleteMeeting = async (url: string) => {
  let response = await fetch(url, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  let json = await response.json();
  return json;
};

export default fetchDeleteMeeting;
