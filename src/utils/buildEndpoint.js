export default function buildEndpoint(baseUrl, path, withoutQuestion = false) {
  
  return function (params = {}, id = null) {
    const query = new URLSearchParams(params).toString();

    const fullPath = id ? `${path}${id}/` : path;

    if (withoutQuestion) {
      return `${baseUrl}${fullPath}`;
    }

    return `${baseUrl}${fullPath}${query ? `?${query}` : ""}`;
  };
}
