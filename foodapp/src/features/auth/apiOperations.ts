import { apiConnector } from "@/services/apiConnector";
import { SignupFormData } from "./validation/auth.shcema";
import { authApiUrls } from "@/services/apiEndpoints";

export const SignUpUser = async (data: SignupFormData) => {
  const response = await apiConnector({
    method: "POST",
    url: authApiUrls.REGISTER_USER,
    bodyData: data,
  });

  return response;
};
