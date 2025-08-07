import HttpClient, { ResponseType } from "./HttpClient";

class FetchAdapter implements HttpClient {
  async post(url: string, data: Record<string, any>): Promise<ResponseType> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return {
      status: response.status,
      data: await response.json()
    }
  }

  async get(url: string): Promise<ResponseType> {
    const response = await fetch(url, {
      method: 'GET',
    })
    return {
      status: response.status,
      data: await response.json()
    }
  }

}

export default FetchAdapter;
