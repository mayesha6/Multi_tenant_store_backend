import type { Plan } from "@prisma/client";
import httpStatus from "http-status-codes";
import prisma from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import AppError from "../../errorHelpers/AppError";

const createPlan = async (payload: Plan) => {
  const result = await prisma.$transaction(async (tx: any) => {
    // Step 1: Create Product in Stripe
    console.log("Creating Stripe Product with payload:", payload);

    const product = await stripe.products.create({
      name: payload.planName,
      description: payload.description!,
      active: true,
    });


   const isLifetimePlan = payload.planName.toLowerCase().includes("lifetime") || 
                          payload.interval === "lifetime";

    const priceConfig: any = {
      currency: "usd",
      unit_amount: Math.round(payload.amount * 100),
      active: true,
      product: product.id,
    };

    if (!isLifetimePlan) {
      // Regular subscription - add recurring
      priceConfig.recurring = {
        interval: payload.interval,
        interval_count: payload.intervalCount,
      };
      console.log("🔄 Creating SUBSCRIPTION plan");
    } else {
      // Lifetime - no recurring field (one-time payment)  
      console.log("🔥 Creating LIFETIME plan (one-time payment)");
    }

    const price = await stripe.prices.create(priceConfig);
    // console.log("Stripe Product and Price created:", price);

    // Step 3: Create Plan Record in Database
    const dbPlan = await tx.plan.create({
      data: {
        amount: payload.amount || 0,
        planName: payload.planName,
        currency: "usd",
        interval: payload.interval,
        intervalCount: payload.intervalCount,
        productId: product.id,
        priceId: price.id,
        active: payload.active || true,
        description: payload.description,
        features: payload.features || [],
      },
    });

    console.log("Database Plan created:", dbPlan);
    return dbPlan;
  });
  return result;
};
export const updatePlan = async (planId: string, payload: Partial<Plan>) => {
  let newPriceId: string | null = null;
  let oldPriceId: string | null = null;
  let stripePriceCreated = false;
  let productIdToUse: string | null=null

  try {
    console.log("=== Update Plan Start ===");

    // Step 1: Find existing plan
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      throw new AppError(httpStatus.NOT_FOUND, `Plan with ID ${planId} not found`);
    }

    oldPriceId = existingPlan.priceId;
    productIdToUse = existingPlan.productId;

    if (typeof productIdToUse !== "string") {
  throw new AppError(httpStatus.BAD_REQUEST, "Invalid product ID");
}
    // Step 2: Check if Stripe product exists, create if missing
    try {
      await stripe.products.retrieve(productIdToUse);
    } catch (err: any) {
      if (err.code === "resource_missing") {
        console.warn(
          `Stripe product ${productIdToUse} not found. Creating new product...`
        );

        const newProduct = await stripe.products.create({
          name: payload.planName ?? existingPlan.planName,
          description: payload.description ?? existingPlan.description ?? "",
          active: payload.active ?? existingPlan.active ?? true,
        });

        productIdToUse = newProduct.id;

        // Save new productId to DB immediately
        await prisma.plan.update({
          where: { id: planId },
          data: { productId: productIdToUse },
        });
      } else {
        throw err;
      }
    }


    const updateData: any = {
      priceId: newPriceId, // Will be set later
      productId: productIdToUse,
    };


    if (payload.planName !== undefined) {
      updateData.planName = payload.planName;
    }
    if (payload.amount !== undefined) {
      updateData.amount = payload.amount;
    }
    if (payload.currency !== undefined) {
      updateData.currency = payload.currency;
    }
    if (payload.interval !== undefined) {
      updateData.interval = payload.interval;
    }
    if (payload.intervalCount !== undefined) {
      updateData.intervalCount = payload.intervalCount;
    }
    if (payload.freeTrialDays !== undefined) {
      updateData.freeTrialDays = payload.freeTrialDays;
    }
    if (payload.active !== undefined) {
      updateData.active = payload.active;
    }
    if (payload.description !== undefined) {
      updateData.description = payload.description;
    }
    if (payload.features !== undefined) {
      updateData.features = payload.features;
    }

    // Step 4: Update Stripe product if needed
    if (
      payload.planName !== undefined ||
      payload.description !== undefined ||
      payload.active !== undefined
    ) {
      await stripe.products.update(productIdToUse, {
        name: payload.planName ?? existingPlan.planName,
        description: payload.description ?? existingPlan.description ?? "",
        active: payload.active ?? existingPlan.active ?? true,
      });
    }


    try {
      await stripe.products.retrieve(productIdToUse);
    } catch {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Stripe product ${productIdToUse} is invalid. Cannot create price.`
      );
    }

    // Step 6: Check if this is a lifetime plan
    const finalPlanName = payload.planName ?? existingPlan.planName;
    const finalInterval = payload.interval !== undefined ? payload.interval : existingPlan.interval;
    
    const isLifetimePlan = 
      finalPlanName.toLowerCase().includes("lifetime") || 
      finalInterval === "lifetime" ||
      finalInterval === null;

    console.log("=== LIFETIME CHECK ===");
    console.log("Is Lifetime Plan:", isLifetimePlan);
    console.log("Plan Name:", finalPlanName);
    console.log("Interval:", finalInterval);


    console.log("=== PRICING CHECK ===");
    
    const currentAmount = Number(existingPlan.amount) || 0;
    const currentCurrency = String(existingPlan.currency || '').toLowerCase();
    const currentInterval = existingPlan.interval;
    const currentIntervalCount = Number(existingPlan.intervalCount) || 1;
    
    let pricingChanged = false;
    let changeDetails = [];

    if (payload.amount !== undefined) {
      const newAmount = Number(payload.amount) || 0;
      if (newAmount !== currentAmount) {
        pricingChanged = true;
        changeDetails.push(`amount: ${currentAmount} → ${newAmount}`);
      }
    }

    if (payload.currency !== undefined) {
      const newCurrency = String(payload.currency).toLowerCase();
      if (newCurrency !== currentCurrency) {
        pricingChanged = true;
        changeDetails.push(`currency: ${currentCurrency} → ${newCurrency}`);
      }
    }

    if (payload.interval !== undefined) {
      const newInterval = payload.interval;
      if (newInterval !== currentInterval) {
        pricingChanged = true;
        changeDetails.push(`interval: ${currentInterval} → ${newInterval}`);
      }
    }


    if (!isLifetimePlan && payload.intervalCount !== undefined) {
      const newIntervalCount = Number(payload.intervalCount) || 1;
      if (newIntervalCount !== currentIntervalCount) {
        pricingChanged = true;
        changeDetails.push(`intervalCount: ${currentIntervalCount} → ${newIntervalCount}`);
      }
    }

    console.log("Pricing changed:", pricingChanged);
    console.log("Changes:", changeDetails);

    if (pricingChanged) {
      console.log(isLifetimePlan ? "🔥 Updating LIFETIME plan" : "🔄 Updating SUBSCRIPTION plan");
      console.log("Changes:", changeDetails.join(', '));


      const finalAmount = payload.amount !== undefined ? Number(payload.amount) : currentAmount;
      const finalCurrency = payload.currency !== undefined ? payload.currency : existingPlan.currency;
      const finalIntervalCount = payload.intervalCount !== undefined ? Number(payload.intervalCount) : currentIntervalCount;

      const priceConfig: any = {
        currency: finalCurrency,
        unit_amount: Math.round(finalAmount * 100),
        active: true,
        product: productIdToUse,
      };

      if (!isLifetimePlan && finalInterval && finalIntervalCount) {
        priceConfig.recurring = {
          interval: finalInterval,
          interval_count: finalIntervalCount,
        };
        console.log("Adding recurring config:", priceConfig.recurring);
      } else {
        console.log("Skipping recurring config (lifetime plan)");
      }

      console.log("Creating price with config:", priceConfig);

      const newPrice = await stripe.prices.create(priceConfig);
      newPriceId = newPrice.id;
      stripePriceCreated = true;

      console.log("✅ New price created:", newPriceId);

      // Deactivate old price
      if (oldPriceId) {
        try {
          await stripe.prices.update(oldPriceId, { active: false });
          console.log(`✅ Deactivated old price: ${oldPriceId}`);
        } catch (err: any) {
          if (err.code === "resource_missing") {
            console.warn(`⚠️ Old price ${oldPriceId} not found in Stripe`);
          } else {
            throw err;
          }
        }
      }
    } else {

      newPriceId = existingPlan.priceId;
      console.log("✅ NO PRICING CHANGES - Keeping existing price:", newPriceId);
    }

   
    updateData.priceId = newPriceId;

    const updatedPlan = await prisma.$transaction(async (tx: any) => {
      return tx.plan.update({
        where: { id: planId },
        data: updateData,
      });
    });

    console.log("=== Update Plan Success ===");
    return updatedPlan;
  } catch (error) {
    console.error("Update Plan Error:", error);


    if (stripePriceCreated && newPriceId) {
      try {
        await stripe.prices.update(newPriceId, { active: false });
        if (oldPriceId) {
          await stripe.prices.update(oldPriceId, { active: true });
        }
        console.log(" Rolled back Stripe prices");
      } catch (rollbackError) {
        console.error(" Failed to rollback Stripe price:", rollbackError);
      }
    }

    throw error instanceof AppError
      ? error
      : new AppError(httpStatus.INTERNAL_SERVER_ERROR, error as any);
  }
};
const getAllPlans = async () => {
  const plans = await prisma.plan.findMany();
  return plans;
};

// Get a Single Plan by ID
const getPlanById = async (planId: string) => {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  return plan;
};

const deletePlan = async (planId: string) => {
  return await prisma.$transaction(async (tx: any) => {
    // Step 1: Find the plan record in the database
    const plan = await tx.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new AppError(httpStatus.NOT_FOUND, `Plan with ID ${planId} not found`);
    }

    // Step 2: Safely deactivate the price in Stripe (if available)
    if (plan.priceId) {
      try {
        await stripe.prices.update(plan.priceId, { active: false });
        console.log(`✅ Deactivated Stripe price: ${plan.priceId}`);
      } catch (err: any) {
        if (err.code === "resource_missing") {
          console.warn(`⚠️ Stripe price ${plan.priceId} not found`);
        } else {
          console.error("❌ Failed to deactivate Stripe price:", err);
        }
      }
    } else {
      console.warn(`⚠️ No priceId found for plan ${planId}`);
    }

    if (plan.productId) {
      try {
        await stripe.products.update(plan.productId, { active: false });
        console.log(`✅ Deactivated Stripe product: ${plan.productId}`);
      } catch (err: any) {
        if (err.code === "resource_missing") {
          console.warn(`⚠️ Stripe product ${plan.productId} not found`);
        } else {
          console.error("❌ Failed to deactivate Stripe product:", err);
        }
      }
    } else {
      console.warn(`⚠️ No productId found for plan ${planId}`);
    }


    await tx.plan.delete({
      where: { id: planId },
    });

    console.log(`🗑️ Plan ${planId} deleted successfully`);

    return {
      message: `Plan with ID ${planId} archived and deleted successfully`,
    };
  });
};

export const PlanServices = {
  createPlan,
  getAllPlans,
  getPlanById,
  deletePlan,
  updatePlan,
};
