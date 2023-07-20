const fetchEditSendTokenTwoFactor = async (url: string) => {
  let response = await fetch("/api/user/sendTokenTwoFactor");
  let json = await response.json();
  return json;
};

export default fetchEditSendTokenTwoFactor;
