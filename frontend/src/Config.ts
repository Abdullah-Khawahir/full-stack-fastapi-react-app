export const BACKEND_URL = "http://localhost:8000";
export function backendFetch(uri: string, init?: RequestInit): Promise<Response> {
  return fetch(`${BACKEND_URL}${uri}`, init);
}
