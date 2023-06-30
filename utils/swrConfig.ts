export async function fetcher<T>(url: string) {
  const res = await fetch(url);

  if (!res.ok) return Promise.reject(res.statusText);

  return res.json() as Promise<T>;
}
