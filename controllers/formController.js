const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Applicant = require('./../model/applicantModel');

// controller for filling expression form
exports.expression = catchAsync(async (req, res) => {
  const form = await Applicant.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      form,
    },
  });
});

// controller for reading all forms
exports.readExpression = catchAsync(async (req, res, next) => {
  const allForm = await Applicant.find();
  if (!allForm) {
    return next(new AppError('There are no forms available yet', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      allForm,
    },
  });
});

//  sorting forms based on their skill
exports.formBySkill = catchAsync(async (req, res, next) => {
  const skills = await Applicant.find({ skill: req.body });

  if (!skills) {
    return next(new AppError(' There are no forms with this skill yet', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      skills,
    },
  });
});

//  sorting forms by handled
exports.formHandled = catchAsync(async (req, res) => {
  const alreadyHandled = await Applicant.find({ handled: req.body });

  if (!alreadyHandled) {
    return next(
      new AppError(' There are no forms with this with such criteria', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      alreadyHandled,
    },
  });
});

// sorting for forms that are yet to be handled
// exports.formHandled = async (req, res) => {
//   const alreadyHandled = await Applicant.find({ handled: false });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       alreadyHandled,
//     },
//   });
// };

// exports.formByGender = async (req, res) => {
//   const gender = await Applicant.find(gender:)
// }
