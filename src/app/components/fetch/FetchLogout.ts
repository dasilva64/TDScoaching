const FetchLogout = async (url: string, { arg }: { arg: { csrfToken: string } }) => {
    let response = await fetch(url, {
      method: "DELETE",
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
  
  export default FetchLogout;
  