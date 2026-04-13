import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ContactServices } from "./contact.services";

const createContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as JwtPayload;

    const result = await ContactServices.createContact(currentUser, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Contact created successfully",
      data: result,
    });
  }
);

const getAllContacts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as JwtPayload;
    const query = req.query as Record<string, string>;

    const result = await ContactServices.getAllContacts(currentUser, query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Contacts retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as JwtPayload;
    const contactId = req.params.id as string;

    const result = await ContactServices.getSingleContact(currentUser, contactId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Contact retrieved successfully",
      data: result,
    });
  }
);

const updateContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as JwtPayload;
    const contactId = req.params.id as string;

    const result = await ContactServices.updateContact(
      currentUser,
      contactId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Contact updated successfully",
      data: result,
    });
  }
);

const deleteContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as JwtPayload;
    const contactId = req.params.id as string;

    await ContactServices.deleteContact(currentUser, contactId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Contact deleted successfully",
      data: null,
    });
  }
);

export const ContactControllers = {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContact,
  deleteContact,
};