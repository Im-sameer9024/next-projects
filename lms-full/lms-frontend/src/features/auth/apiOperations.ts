import { apiConnector } from "@/services/apiConnector";
import {
  LoginSchemaValidationTypes,
  SignUpSchemaValidationTypes,
} from "./auth.validation";
import { authApiEndpoints } from "@/services/apiEndPoints";

export const SignupUser = async (data: SignUpSchemaValidationTypes) => {
  const response = await apiConnector({
    method: "POST",
    url: authApiEndpoints.SIGNUP_USER,
    bodyData: data,
  });

  return response.data;
};

export const LoginUser = async (data: LoginSchemaValidationTypes) => {
  const response = await apiConnector({
    method: "POST",
    url: authApiEndpoints.LOGIN_USER,
    bodyData: data,
  });
  return response.data;
};
