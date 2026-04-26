/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodSchema } from "zod";

export const validate = <T>(
  schema: ZodSchema<T>,
  data: unknown,
):
  | { success: true; data: T }
  | { success: false; errors:any } => {

  const result = schema.safeParse(data);

  console.log("result is here",result)


  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    data: result.data,
  };
};
