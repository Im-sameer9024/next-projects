import { apiConnector } from "@/services/apiConnector";
import { authApiEndpoints } from "@/services/apiEndpoints";
import {  SignUpSchemaValidationTypes } from "@/shared/validation/auth.validation";

export const SignupUser = async (data: SignUpSchemaValidationTypes) => {
  const response = await apiConnector({
    method: "POST",
    url: authApiEndpoints.SIGNUP_USER,
    bodyData: data,
  });
  return response.data;
};


