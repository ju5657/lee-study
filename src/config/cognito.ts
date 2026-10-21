export const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
export const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
export const COGNITO_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;
export const COGNITO_REDIRECT_SIGN_IN = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN;
export const COGNITO_REDIRECT_SIGN_OUT = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT;

export const getCognitoAuthUrl = () => {
  const domain = COGNITO_DOMAIN;
  const clientId = COGNITO_CLIENT_ID;
  const redirectUri = encodeURIComponent(COGNITO_REDIRECT_SIGN_IN || "");
  const responseType = "code";
  const scope = "email openid phone profile";

  const cognitoDomain = `${domain}.auth.${COGNITO_REGION}.amazoncognito.com`;
  
  return `https://${cognitoDomain}/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;
};

export const getCognitoLogoutUrl = () => {
  const domain = COGNITO_DOMAIN;
  const clientId = COGNITO_CLIENT_ID;
  const logoutUri = encodeURIComponent(COGNITO_REDIRECT_SIGN_OUT || "");

  const cognitoDomain = `${domain}.auth.${COGNITO_REGION}.amazoncognito.com`;

  return `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
};
