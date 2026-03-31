export default function getBaseUrl(envName) {

  const envMap = {
    mock: import.meta.env.VITE_BASE_URL_MOCKOON,
    local: import.meta.env.VITE_BASE_URL_LOCAL,
    server: import.meta.env.VITE_BASE_URL_SERVER,
  };

  const baseUrl = envMap[envName?.toLowerCase()];

  if (!baseUrl) {
    throw new Error(`Nessuna variabile trovata per env: ${envName}`);
  }

  return baseUrl;
}