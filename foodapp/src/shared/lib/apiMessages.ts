/* eslint-disable @typescript-eslint/no-explicit-any */


export const GetApiErrorMessage = (error:any) => {
  const messages = [];
  const message = error?.response?.data?.message || error?.message || 'Error Message';
  messages.push(message);
  if (error?.response?.data?.error) {
    const values = Object.values(error?.response?.data?.error);

    values.forEach((value) => {
      if (Array.isArray(value)) {
        messages.push(...value);
      } else {
        messages.push(value);
      }
    });
  }

  return messages.join(' || ');
};

export const GetApiResponseMessage = (response:any) => {
  const message = response?.data?.message || response?.message || 'Response Message';
  return message;
};
