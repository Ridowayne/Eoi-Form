const mongoose = require('mongoose');
const validator = require('validator');

// schema to create model of informations
const applicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'kindly provide your name'],
  },
  email: {
    type: String,
    required: [true, 'kindly provide an email address'],
    unique: true,
    validate: [
      validator.isEmail,
      'email address should be a valid email address',
    ],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Female', 'Male', 'Prefer not to say'],
  },
  phoneNumber: {
    type: Number,
    required: [true, 'please provide an email address'],
    unique: true,
    // // validate: [validator.isMobilePhone, 'Kindly provide a valid phone number'],
  },
  stateOfResidence: {
    type: String,
    required: [true, 'kindly provide a state in nigeria'],
  },
  HighestEducationQualification: {
    type: String,
    enum: ['SSCE', 'OND', 'HND', 'Undergradute', 'BSc'],
  },
  whatTechnicalSkill: {
    type: String,
    required: [true, 'kindly select a skill your are most interested in'],
    enum: [
      'UI/UX',
      'Front end development',
      'Back end Development',
      'QA testing',
      'Data Science',
      'DevOps',
      'Mobile application development',
      'Technical Product Management-SCRUM MASTER',
      'Other',
    ],
  },
  doYouHaveBasicKnowledge: {
    type: String,
    enum: ['Yes', 'No', 'Still learning'],
  },
  gitHubLink: {
    type: String,
    validate: [validator.isURL, 'Please a valid github link'],
  },
  describeChallengeOfSelectedField: {
    type: String,
    required: [
      true,
      'Kidly decribe what you regard as the most challenging in your selected field',
    ],
  },
  techJourney: {
    type: String,
    required: [
      true,
      'Kindly give details of your tech journey and Challenges along the way',
    ],
    maxlength: 219,
  },
  reasonYouWantToJoin: {
    type: String,
    required: [
      true,
      'Kindly give detail of the past previous project you feel most impressed about',
    ],
    maxlength: 219,
  },
  pastProjects: {
    type: String,
    maxlength: 219,
  },
  UnderstandingOfTypeOfCommunity: {
    type: String,
    required: [true, 'kindly signify that you aware'],
    enum: ['Yes, I understand', 'No'],
  },
  formHandled: {
    type: Boolean,
    defaulty: false,
  },
  adminComents: {
    type: String,
  },
});

applicantSchema.pre('save', function (next) {
  if (this.isModified('adminComents')) return next;

  this.formHandled = true;
});

// Model for application form
const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;
