import Stripe from "stripe";
import httpStatus from "http-status-codes";
import { PaymentStatus, Interval } from "@prisma/client";
import AppError from "../errorHelpers/AppError";
import prisma from "../lib/prisma";
import { stripe } from "../lib/stripe";


const calculateEndDate = (
  startDate: Date,
  interval: Interval,
  intervalCount: number
): Date => {
  const endDate = new Date(startDate);

  switch (interval) {
    case "week":
      endDate.setDate(endDate.getDate() + 7 * intervalCount);
      break;
    case "month":
      endDate.setMonth(endDate.getMonth() + intervalCount);
 
      if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(0); 
      }
      break;
    case "year":
      endDate.setFullYear(endDate.getFullYear() + intervalCount);
      break;
    default:
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Unsupported interval: ${interval}`
      );
  }

  return endDate;
};

const handlePaymentIntentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent
) => {

  const payment = await prisma.subscription.findFirst({
    where: { stripePaymentId: paymentIntent.id },
    include: {
      plan: true,
    },
  });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Payment not found for ID: ${paymentIntent.id}`
    );
  }

  if (!payment.plan) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Plan not found for this subscription"
    );
  }

  if (paymentIntent.status !== "succeeded") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment intent is not in succeeded state"
    );
  }

  const startDate = new Date();
  const endDate = calculateEndDate(
    startDate,
    payment.plan.interval,
    payment.plan.intervalCount
  );


  await prisma.$transaction([
    prisma.user.update({
      where: { id: payment.userId },
      data: {
        isSubscribed: true,
        planExpiration: endDate,
      },
    }),
    prisma.subscription.update({
      where: { id: payment.id },
      data: {
        paymentStatus: PaymentStatus.COMPLETED,
        startDate,
        endDate,
      },
    }),
  ]);
};

const handlePaymentIntentFailed = async (
  paymentIntent: Stripe.PaymentIntent
) => {

  const payment = await prisma.subscription.findFirst({
    where: { stripePaymentId: paymentIntent.id },
  });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Payment not found for ID: ${paymentIntent.id}`
    );
  }


  await prisma.subscription.update({
    where: { id: payment.id },
    data: {
      paymentStatus: PaymentStatus.CANCELED,
      endDate: new Date(),
    },
  });
};


export { handlePaymentIntentSucceeded, handlePaymentIntentFailed };