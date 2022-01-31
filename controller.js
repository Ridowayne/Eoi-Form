const express = require('express');
const bodyParser = require('body-parser');
const Applicant = require('./model/applicantModel');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// controller for filling expression form
exports.expression = async (req, res) => {
  try {
    const form = await Applicant.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        form,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: 'fail',
      message: error,
    });
  }

  // controller for reading all forms
  exports.readExpression = async (req, res) => {
    const allForm = await Applicant.find();

    res.status(201).json({
      status: 'success',
      data: {
        application: allForm,
      },
    });
  };
};
