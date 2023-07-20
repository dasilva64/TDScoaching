const fetchCancel = async (url: string) => {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  };
  
  export default fetchCancel;