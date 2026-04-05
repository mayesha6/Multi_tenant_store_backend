
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import { ContactServices } from "./contact.services";
import { sendResponse } from "../../utils/sendResponse";
import type { JwtPayload } from "jsonwebtoken";

const createContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const contact = await ContactServices.createContact(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Contact created successfully",
      data: contact,
    });
  }
);

const getAllContacts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Assumption:
    // তোমার auth middleware req.user inject করে
    // এবং সেখানে tenantId আছে
    const user = req.user as JwtPayload
    const tenantId = user.tenantId;
    const result = await ContactServices.getAllContacts(
      req.query,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Contacts fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
     const user = req.user as JwtPayload
    const tenantId = user.tenantId;
    const result = await ContactServices.getSingleContact(
      req.params.id as string,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Contact fetched successfully",
      data: result,
    });
  }
);

const updateContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const tenantId = user.tenantId;
    const result = await ContactServices.updateContact(
      req.params.id as string,
      req.body,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Contact updated successfully",
      data: result,
    });
  }
);

const deleteContactById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const tenantId = user.tenantId;

    const result = await ContactServices.deleteContactById(
      req.params.id as string,
      tenantId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Contact deleted successfully",
      data: result,
    });
  }
);

export const ContactControllers = {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContact,
  deleteContactById,
};