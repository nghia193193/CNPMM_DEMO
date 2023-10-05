const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const User = require('../models/userModel');

const router = express.Router()

router.get('/', authController.GetLoginPage);
router.post('/', [
    body('email').trim().notEmpty().withMessage('Vui lòng nhập Email')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (!user) {
                        throw new Error('Email không tồn tại');
                    }
                    return true
                })
        }),
    body('password').trim().notEmpty().withMessage('Vui lòng nhập mật khẩu')
], authController.PostLogin);

router.get('/signup', authController.GetSignupPage);
router.post('/signup', [
    // body('fullName').trim().notEmpty().withMessage('Vui lòng nhập họ tên')
    //     .custom((value, {req}) => {
    //         const regex = /^[\p{L} ]+$/u; // Cho phép chữ và dấu cách
    //         if (!regex.test(value)) {
    //             throw new Error('Tên chỉ gồm chữ và dấu cách');
    //         };
    //         return true;
    //     }),
    // body('email').trim().notEmpty().withMessage('Vui lòng nhập Email')
    //     .isEmail().withMessage('Email không hợp lệ')
    //     .normalizeEmail()
    //     .custom((value, { req }) => {
    //         return User.findOne({ email: value })
    //             .then(userDoc => {
    //                 if (userDoc) {
    //                     throw new Error('Email đã tồn tại')
    //                 }
    //                 return true
    //             })
    //     }),
    // body('address').trim().notEmpty().withMessage('Vui lòng nhập địa chỉ')
    //     .custom((value, {req}) => {
    //         const regex = /^[\p{L} ,\/0-9]+$/u; 
    //         if (!regex.test(value)) {
    //             throw new Error('Địa chỉ chỉ gồm chữ, số, dấu phẩy và dấu gạch chéo');
    //         };
    //         return true;
    //     }),
    // body('password').trim()
    //     .isLength({ min: 8, max:32}).withMessage('Mật khẩu phải có độ dài từ 8-32 ký tự'),
    // body('confirmPassword').trim()
    //     .notEmpty().withMessage('Vui lòng nhập lại mật khẩu')
    //     .custom((value, { req }) => {
    //         if (value !== req.body.password) {
    //             throw new Error('Mật khẩu xác nhận không chính xác');
    //         }
    //         return true
    //     })
], authController.PostSignup)

router.post('/logout', authController.PostLogout)

module.exports = router;