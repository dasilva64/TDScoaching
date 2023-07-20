const fetchUserEditPhoneSendTokenData = async (url: string, { arg }: { arg: { phone: string }}) => {
    let response = await fetch("/api/user/sendTokenEditPhone", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(arg),
    });
    let json = await response.json();
    return json;
  };
  
  export default fetchUserEditPhoneSendTokenData;