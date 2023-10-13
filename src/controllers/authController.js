const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.GetLoginPage = (req, res, next) => {
    let errMessage = req.flash('error')
    errMessage = errMessage.length > 0 ? errMessage[0] : null
    res.render('login', {
        pageTitle: 'Login page',
        path: '/',
        errMessage: errMessage,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    })
}

exports.PostLogin = async (req, res, next) => {
    const {email, password} = req.body;
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(400).render('login', {
                pageTitle: 'Login page',
                path: '/',
                errMessage: '',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
            })
        };
        const user = await User.findOne({email: email});
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.user = user
            return req.session.save(err => {
                console.log(err)
                if (req.session.user.role === "Admin") {
                    return res.redirect('/admin');  
                }
                res.redirect('/profile');
            })
        };
        return res.status(422).render('login', {
            pageTitle: 'Login page',
            path: '/',
            errMessage: '',
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: [{path: 'password',msg: 'Mật khẩu không chính xác'}]
        })
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    };
}

exports.PostLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}

exports.GetSignupPage = (req, res, next) => {
    res.render('signup', {
        pageTitle: 'Signup page',
        path: '/signup',
        oldInput: {
            fullname: '',
            email: '',
            address: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    })
}

exports.PostSignup = async (req, res, next) => {
    const {fullName, email, password, address, confirmPassword} = req.body;
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(400).render('signup', {
                pageTitle: 'Signup page',
                path: '/signup',
                oldInput: { 
                    fullName: fullName, 
                    email: email,  
                    address: address, 
                    password: password, 
                    confirmPassword: confirmPassword
                },
                validationErrors: errors.array()
            })
        }
        const hashPass = await bcrypt.hash(password, 12);
        const user = new User({
            fullName: fullName,
            email: email,
            address: address,
            password: hashPass,
            role: 'User'
        })
        await user.save();
        res.redirect('/');
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    };
        
}
