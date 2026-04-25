import { apiConnector } from "@/services/apiConnector"
import { categoryUrls } from "@/services/apiEndPoints"




export const GetCourseCategories = async() =>{
    const response = await apiConnector({
        method:"GET",
        url:categoryUrls.GET_ALL_CATEGORIES,
    })
    return response.data
}