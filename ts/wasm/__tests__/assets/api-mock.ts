import type { ApiAccount, ApiTransaction } from '@hiveio/wax';

export interface IWaxApi {
  findAccounts (params: { accounts: string[] }): Promise<{ accounts: ApiAccount[] }> | { accounts: ApiAccount[] };
}

export interface IMockData {
  findAccounts: { paramsAccounts: string[], accounts: ApiAccount[] }[];
}

export type TMockExtendedData = IMockData & Record<string, ApiTransaction | ApiAccount[]>;

export class waxApiMock implements IWaxApi {
  private mockData!: IMockData;

  public load (inputData: IMockData): void {
    console.log(`Loading mocked data: ${JSON.stringify(inputData)}`);
    this.mockData = inputData;
  }

  public findAccounts (params: { accounts: string[]; }): { accounts: ApiAccount[]; } {
    const item = this.mockData.findAccounts.find(({ paramsAccounts }) => paramsAccounts.length === params.accounts.length && paramsAccounts.every((account, index) => account === params.accounts[index]));

    return { accounts: item ? item.accounts : [] };
  }
}
