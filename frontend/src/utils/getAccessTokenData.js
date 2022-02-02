function getAccessTokenData(jwtToken) {
  const [, payload] = jwtToken.access.split(".");
  return JSON.parse(window.atob(payload));
}

export default getAccessTokenData;
