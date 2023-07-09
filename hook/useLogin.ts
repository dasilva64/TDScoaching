const useLogin = async (url: string, {arg}: {arg: {mail: string, password: string}}) => {
  console.log('eeee')
 console.log('eeee')
 console.log('eeee')
 console.log('eeee')
 console.log('eeee')
 console.log('eeee')
 console.log('eeee')
 console.log('eeee')
 console.log('eeee')
 console.log('eeee')
  let response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify(arg),
  });
  let json = await response.json();
  return json;
};

export default useLogin;