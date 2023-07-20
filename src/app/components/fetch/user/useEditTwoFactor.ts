const fetchEditTwoFactor = async (url: string, { arg }: { arg: { code: string }}) => {
  console.log('jlsdfjlksjflq')
    let response = await fetch("/api/user/editTwoFactor", {
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
  
  export default fetchEditTwoFactor;
  