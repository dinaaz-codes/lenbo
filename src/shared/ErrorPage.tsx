export enum ErrorType {
  NOT_FOUND = "Not Found!",
  FORBIDDEN = "Forbidden!",
  INTERNAL_SERVER_ERROR = "Internal Server Error!",
}

export enum HttpStatusCode {
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  FORBIDDEN = 403,
  OK = 200,
}
type Props = {
  statusCode: HttpStatusCode;
  errorType: ErrorType;
  message?: string;
};

const ErrorPage = ({ statusCode, errorType, message }: Props) => {
  return (
    <>
      <h1>
        {statusCode} | {errorType}
      </h1>
      {message && <p>{message}</p>}
    </>
  );
};

export default ErrorPage;
