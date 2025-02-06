export const service = {
    "type": "service_account",
    "project_id": "event-nextjs-auth",
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_KEY,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_URL,
    "client_x509_cert_url":process.env.CLIENT_URL,
    "universe_domain": "googleapis.com"
  }
  