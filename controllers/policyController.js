const catchAsync = require('../utils/catchAsync');
const { newEnforcer } = require('../utils/casbin');
const AppError = require('../utils/appError');

exports.addPolicy = catchAsync(async (req, res, next) => {
  const { sub, roles } = req.body;
  const e = await newEnforcer();

  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return next(new AppError('Roles is empty or undefined', 500));
  }

  for (let role of roles) {
    await e.addRoleForUser(sub, role).catch(err => next(new AppError(err)));
  }

  res.status(201).json({
    status: 'success',
    message: `Successfully added ${roles.join(', ')} to ${sub}`,
  });
});

exports.addPermissionForUser = catchAsync(async (req, res, next) => {
  const { sub, permissions } = req.body;
  const e = await newEnforcer();

  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return next(new AppError('Permission is empty or undefined', 500));
  }

  for (let permission of permissions) {
    await e
      .addPermissionForUser(sub, ...permission)
      .catch(err => next(new AppError(err)));
  }

  res.status(201).json({
    status: 'success',
    message: `Successfully added permissions to ${sub}`,
  });
});
