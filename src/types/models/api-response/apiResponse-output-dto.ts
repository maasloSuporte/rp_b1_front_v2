export interface IApiResponseOutputDto <T> {
    value: T;
    isSuccess: boolean;
    error: {
      code: string;
      description: string;
      type: number;
    };
  }