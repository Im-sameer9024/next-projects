import { apiConnector } from "@/services/apiConnector"
import { courseApiEndpoints } from "@/services/apiEndPoints"






export const GetAnalyticsData = async() =>{
  const response = await apiConnector({
    method: "GET",
    url: courseApiEndpoints.GET_ANALYTICS_OF_TEACHER,
  })
  return response.data
}