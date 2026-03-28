import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { TenantService } from "./tenant.services"

const createTenant = catchAsync(async (req, res) => {
  const result = await TenantService.createTenant(req.body)

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Tenant created successfully",
    data: result,
  })
})

const getAllTenant = catchAsync(async (req, res) => {
  const result = await TenantService.getAllTenant()

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Tenants retrieved successfully",
    data: result,
  })
})

const getTenantById = catchAsync(async (req, res) => {
  const result = await TenantService.getTenantById(req.params.id as string)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Tenant retrieved successfully",
    data: result,
  })
})

const updateTenant = catchAsync(async (req, res) => {
  const result = await TenantService.updateTenant(req.params.id as string, req.body)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Tenant updated successfully",
    data: result,
  })
})

const deleteTenant = catchAsync(async (req, res) => {
  await TenantService.deleteTenant(req.params.id as string)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Tenant deleted successfully",
    data: null,
  })
})

export const TenantController = {
  createTenant,
  getAllTenant,
  getTenantById,
  updateTenant,
  deleteTenant,
}