import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { SendResponse } from "../../shared/utils/response.js";
import { stripe } from "../../config/stripe.js";
export const CreateOrder = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { id, email } = req.user;
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            isPublished: true,
        },
    });
    if (!course) {
        return SendResponse(res, {
            statusCode: 404,
            success: true,
            message: "Course not found",
        });
    }
    const purchase = await prisma.purchase.findUnique({
        where: {
            userId_courseId: {
                userId: id,
                courseId: courseId,
            },
        },
    });
    if (purchase) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "You have already purchased this course",
        });
    }
    const line_items = [
        {
            quantity: 1,
            price_data: {
                currency: "INR",
                product_data: {
                    name: course.title,
                },
                unit_amount: Math.round(Number(course.price) * 100),
            },
        },
    ];
    let stripeCustomer = await prisma.stripeCustomer.findUnique({
        where: {
            userId: id,
        },
        select: {
            stripeCustomerId: true,
        },
    });
    if (!stripeCustomer) {
        const customer = await stripe.customers.create({
            email: email,
        });
        stripeCustomer = await prisma.stripeCustomer.create({
            data: {
                userId: id,
                stripeCustomerId: customer.id,
            },
        });
    }
    const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        line_items,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/courses/${courseId}?success=1`,
        cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}?canceled=1`,
        metadata: {
            courseId: course.id,
            userId: id,
        },
    });
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order created successfully",
        data: session.url,
    });
});
export const StripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
        return res.status(400).send("Missing signature");
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (error) {
        return res.status(400).send(`Webhook Error`);
    }
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const courseId = session.metadata?.courseId;
            const userId = session.metadata?.userId;
            if (!courseId || !userId) {
                break;
            }
            const existingPurchase = await prisma.purchase.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId,
                    },
                },
            });
            if (!existingPurchase) {
                await prisma.purchase.create({
                    data: {
                        userId,
                        courseId,
                    },
                });
            }
            break;
        }
        default:
            break;
    }
    return res.status(200).json({
        received: true,
    });
};
//# sourceMappingURL=stripe.controllers.js.map