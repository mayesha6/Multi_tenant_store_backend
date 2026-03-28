import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ContactService } from "./contact.services";
import httpStatus from "http-status-codes";

const createContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await ContactService.createContact(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Contact created successfully",
    data: contact,
  });
});

const getContacts = catchAsync(async (req: Request, res: Response) => {
  const contacts = await ContactService.getContacts();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contacts fetched successfully",
    data: contacts,
  });
});

const getContactById = catchAsync(async (req: Request, res: Response) => {
  const contact = await ContactService.getContactById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contact fetched successfully",
    data: contact,
  });
});

const updateContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await ContactService.updateContact(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contact updated successfully",
    data: contact,
  });
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.deleteContact(req.params.id   as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

export const ContactController = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};