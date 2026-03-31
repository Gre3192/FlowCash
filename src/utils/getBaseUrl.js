export default function getBaseUrl(envName) {

  const envMap = {
    mock: process.env.REACT_APP_API_BASE_URL_MOCKOON,
    local: process.env.REACT_APP_API_BASE_URL_LOCAL,
    server: process.env.REACT_APP_API_BASE_URL_SERVER,
  };

  const baseUrl = envMap[envName?.toLowerCase()];

  if (!baseUrl) {
    throw new Error(`Nessuna variabile trovata per env: ${envName}`);
  }

  return baseUrl;
}