import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { SendResponse } from "../../shared/utils/response.js";
export const CreateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Please provide a name for the category",
            data: null,
        });
    }
    const category = await prisma.category.create({
        data: {
            name: name,
        },
    });
    return SendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
    });
});
export const GetAllCategories = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
    if (!categories || categories.length === 0) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No categories found",
            data: [],
        });
    }
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories fetched successfully",
        data: categories,
    });
});
//# sourceMappingURL=category.controllers.js.map