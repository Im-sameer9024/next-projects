/* eslint-disable @typescript-eslint/no-explicit-any */


export const validate = (schema: any, data: any) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten(),
    };
  }

  return { success: true, data: result.data };
};