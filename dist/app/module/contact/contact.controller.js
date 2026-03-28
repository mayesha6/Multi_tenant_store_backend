import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ContactService } from "./contact.services";
import httpStatus from "http-status-codes";
const createContact = catchAsync(async (req, res) => {
    const contact = await ContactService.createContact(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Contact created successfully",
        data: contact,
    });
});
const getContacts = catchAsync(async (req, res) => {
    const contacts = await ContactService.getContacts();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contacts fetched successfully",
        data: contacts,
    });
});
const getContactById = catchAsync(async (req, res) => {
    const contact = await ContactService.getContactById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contact fetched successfully",
        data: contact,
    });
});
const updateContact = catchAsync(async (req, res) => {
    const contact = await ContactService.updateContact(req.params.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contact updated successfully",
        data: contact,
    });
});
const deleteContact = catchAsync(async (req, res) => {
    const result = await ContactService.deleteContact(req.params.id);
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
//# sourceMappingURL=contact.controller.js.map