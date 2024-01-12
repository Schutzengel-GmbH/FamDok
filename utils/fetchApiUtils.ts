export const JsonHeaders = new Headers({
  "Content-Type": "application/json",
});

export class FetchError {
  constructor(_error: string) {
    this.error = _error;
  }
  error?: string;
}

export async function apiGet<ApiReturnType>(url: string) {
  try {
    return await fetch(url, {
      method: "GET",
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

export async function apiPostJson<ApiReturnType, BodyType = object>(
  url: string,
  body: BodyType
) {
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
