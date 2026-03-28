import httpStatus from "http-status-codes";
// import { PlanServices } from "./plan.service";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PlanServices } from "./plan.services";
import { sendResponse } from "../../utils/sendResponse";

const createPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const result = await PlanServices.createPlan(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Plan created successfully!",
    data: result,
  });
});
const updatePlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const result = await PlanServices.updatePlan(req.params.planId as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan updated successfully!",
    data: result,
  });
});

const getAllPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await PlanServices.getAllPlans();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plans fetched successfully!",
    data: result,
  });
});


const getPlanById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await PlanServices.getPlanById(req.params.planId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan fetched successfully!",
    data: result,
  });
});


const deletePlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await PlanServices.deletePlan(req.params.planId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Plan deleted successfully!",
    data: result,
  });
});

export const PlanController = {
  createPlan,
  getAllPlans,
  getPlanById,
  deletePlan,
  updatePlan
};
