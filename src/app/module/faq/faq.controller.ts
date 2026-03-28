import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { FAQService } from "./faq.services";
import { catchAsync } from "../../utils/catchAsync";

const createFAQ = catchAsync(async (req: Request, res: Response) => {
  const result = await FAQService.createFAQ(req.body);

sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FAQ created successfully",
    data: result,
  });
});

const getAllFAQ =  catchAsync(async (_req: Request, res: Response) => {
  const result = await FAQService.getAllFAQ();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,    
    message: "All FAQs fetched successfully",
    data: result,
  });
});

const getSingleFAQ =  catchAsync(async (req: Request, res: Response) => {
  const result = await FAQService.getSingleFAQ(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,    
    message: "FAQ fetched successfully",
    data: result,
  });
});

const updateFAQ = catchAsync(async (req: Request, res: Response) => {
  const result = await FAQService.updateFAQ(req.params.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FAQ updated successfully",
    data: result,
  });
});

const deleteFAQ = catchAsync(async (req: Request, res: Response) => {
  const result =await FAQService.deleteFAQ(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FAQ deleted successfully",
    data: result,
  });
});

export const FAQController = {
  createFAQ,
  getAllFAQ,
  getSingleFAQ,
  updateFAQ,
  deleteFAQ,
};