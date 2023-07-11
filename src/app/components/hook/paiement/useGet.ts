const fetchGetPayment = async (url: string, { arg }: { arg: { start: string }}) => {
    console.log('test')
    let response = await fetch(url, {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(arg),
    });
    let json = await response.json();
    return json;
  };
  
  export default fetchGetPayment;