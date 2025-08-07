import HttpClient from "../http/HttpClient";

export default interface AccountGateway {
  signup(input: Input): Promise<Output>;
}

type Input = {
  accountType: string;
  name: string;
  role: string;
  documentNumber: string;
  email: string;
  password: string;
}

type Output = {
  success: boolean;
  accountId: number;
}

export class AccountGatewayHttp implements AccountGateway {

  constructor(private readonly httpClient: HttpClient) { }

  async signup(input: Input): Promise<Output> {
    const response = await this.httpClient.post('https://jsonplaceholder.typicode.com/users', input);
    return {
      success: response.status === 201,
      accountId: response.data.id
    }
  }

}

export class MockAccountGateway implements AccountGateway {
  signup(): Promise<Output> {
    return Promise.resolve({
      success: true,
      accountId: 12,
    })
  }
}
