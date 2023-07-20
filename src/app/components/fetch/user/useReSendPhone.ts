const fetchReSendPhoneCode = async (url: string) => {
    let response = await fetch("/api/user/phoneReSendCode");
    let json = await response.json();
    return json;
  };
  
  export default fetchReSendPhoneCode;