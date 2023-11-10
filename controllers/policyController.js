const catchAsync = require("../utils/catchAsync");
const { newEnforcer } = require("../utils/casbin")

exports.addPolicy = catchAsync(async (req, res, next) => {
    const { sub, roles } = req.body
    const e = await newEnforcer()
    if (sub && roles && roles.length > 0) {
        for (let role of roles) {
            await e.addRoleForUser(sub, role)
        }
    }
})

exports.addPermissionForUser = catchAsync(async (req, res, next) => {
    const { sub, permissions } = req.body
    if (permissions && permissions.length > 0) {
        permissions.map((permission) => e.addPermissionForUser(sub, ...permission))
    }
})