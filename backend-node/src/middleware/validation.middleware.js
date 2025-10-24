import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validations
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Dog report validations
export const createDogReportValidation = [
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('condition').isIn(['HEALTHY', 'INJURED', 'SICK', 'MALNOURISHED', 'CRITICAL']).withMessage('Invalid condition'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('reporterName').trim().notEmpty().withMessage('Reporter name is required'),
  body('reporterContact').trim().notEmpty().withMessage('Reporter contact is required'),
  validate
];

// Adoption validations
export const createAdoptionDogValidation = [
  body('name').trim().notEmpty().withMessage('Dog name is required'),
  body('gender').isIn(['MALE', 'FEMALE', 'UNKNOWN']).withMessage('Invalid gender'),
  body('size').isIn(['SMALL', 'MEDIUM', 'LARGE']).withMessage('Invalid size'),
  validate
];

// Donation validations
export const createDonationValidation = [
  body('donorName').trim().notEmpty().withMessage('Donor name is required'),
  body('donorEmail').isEmail().withMessage('Valid email is required'),
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod').isIn(['UPI', 'PAYPAL', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER']).withMessage('Invalid payment method'),
  validate
];

// Volunteer validations
export const volunteerRegistrationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('contact').trim().notEmpty().withMessage('Contact is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('area').trim().notEmpty().withMessage('Area is required'),
  body('role').isIn(['FEEDER', 'RESCUER', 'VET', 'TRANSPORT', 'FOSTER']).withMessage('Invalid role'),
  validate
];

// Pagination validations
export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

// ID validation
export const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate
];
