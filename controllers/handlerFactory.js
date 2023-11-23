const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/sqlApiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByPk(id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    await Model.destroy({ where: { id } });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    const doc = await Model.findByPk(id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    await doc.update(body, { where: { id } });

    const updatedDoc = await Model.findByPk(id);

    res.status(200).json({
      status: "success",
      data: {
        data: updatedDoc,
      },
    });
  });


exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { body } = req;

    const doc = await Model.create(body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, includeOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = await Model.findByPk(id);

    if (!query) {
      return next(new AppError("No document found with that ID", 404));
    }

    if (includeOptions) {
      query = await Model.findByPk(id, { include: includeOptions });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: query,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
