export const storeToken = (token) => {
  window.sessionStorage.setItem("tkn", token);
};

export const appendHeaders = () => {
  const authToken = window.sessionStorage.getItem("authtkn");
  const headers = {
    "Content-Type": "application/json",
    Authorization: authToken,
  };
  return headers;
};
