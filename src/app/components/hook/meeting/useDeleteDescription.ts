const fetchDeleteDescription = async (url: string) => {
    console.log('test')
    let response = await fetch(url, {
      method: "PATCH",
      credentials: "include"
    });
    let json = await response.json();
    return json;
  };
  
  export default fetchDeleteDescription;