const fetchDeleteDescription = async (url: string) => {
    let response = await fetch(url, {
      method: "PATCH",
    });
    let json = await response.json();
    return json;
  };
  
  export default fetchDeleteDescription;