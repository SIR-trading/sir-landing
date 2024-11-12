declare interface IStatusResponse {
  hasAgreed: boolean;
}

declare interface IErrorResponse {
  statusCode: number;
  body: {
    error: string;
  };
}

export type {IStatusResponse, IErrorResponse};