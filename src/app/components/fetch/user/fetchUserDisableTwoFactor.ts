const fetchUserDisableTwoFactor = async (url: string) => {
    let response = await fetch("/api/user/disableTwoFactor");
    let json = await response.json();
    return json;
  };
  
  export default fetchUserDisableTwoFactor;