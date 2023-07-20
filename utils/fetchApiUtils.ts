export const JsonHeaders = new Headers({
  "Content-Type": "application/json",
});

export class FetchError {
  constructor(_error: string) {
    this.error = _error;
  }
  error?: string;
}

export async function apiPostJson<ApiReturnType>(url: string, body: object) {
  try {
    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: JsonHeaders,
    }).then(async (r) => {
      let json: ApiReturnType;
      try {
        json = (await r.json()) as ApiReturnType;
      } catch (e) {
        return new FetchError(`${r.status} - ${r.statusText}`);
      }
      return json;
    });
  } catch (e) {
    console.error(e);
    return new FetchError(e);
  }
}

export async function apiDelete<ApiReturnType>(url: string) {
  return await fetch(url, {
    method: "DELETE",
  })
    .then(async (r) => {
      let json: ApiReturnType;
      try {
        json = (await r.json()) as ApiReturnType;
      } catch (e) {
        return new FetchError(`${r.status} - ${r.statusText}`);
      }
      return json;
    })
    .catch((e) => {
      console.error(e);
      return new FetchError(e);
    });
}
