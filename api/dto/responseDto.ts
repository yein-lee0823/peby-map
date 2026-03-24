interface HeaderDto {
  resultCode: number;
  resultMessage: string;
}

export interface ResponseDto<T> {
  header: HeaderDto;
  data: T;
  errorData: null | string;
}

export interface SuccessCheckDto {
  isSuccess: boolean;
}
