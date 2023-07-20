const fetchGetPayment = async (url: string, { arg }: { arg: { start: string }}) => {
    let response = await fetch("/api/paiement/get", {
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
  
  export default fetchGetPayment;