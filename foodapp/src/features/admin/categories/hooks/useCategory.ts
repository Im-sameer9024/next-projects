import { useQuery } from "@tanstack/react-query"
import { GetAllCategories } from "../apiOperations"



export const useGetAllCategories = () => {
    return useQuery({
        queryKey:["categories"],
        queryFn:GetAllCategories
    })
}