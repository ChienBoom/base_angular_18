export interface Config {
  production: boolean;
  hmr: boolean;
  ignoreAuthorization: boolean;
  Api_Domain: string;
  Paging_Size: number;
  Paging_SizeOptions: number[];
  ClientId: string;
  ClientSecret: string;
  DefaultRole: string;
  GrantType: GrantType;
  AppCode: string;
}

export interface GrantType {
  LDap: string;
  DeepCare: string;
  Password: string;
}
