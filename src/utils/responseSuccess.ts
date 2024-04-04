export const responseSuccess = <T>(
  msg: string,
  data: T,
  status: number = 200
) => {
  return {
    status: status,
    message: msg,
    data: data,
  };
};
