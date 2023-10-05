const User = require('../models/userModel');

exports.getProfile = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Phiên đăng nhập kết thúc. Vui lòng đăng nhập lại');
        return res.redirect('/');
    }
    res.render('profile', {user: req.session.user, pageTitle: 'Profile', path: '/profile'});
};

exports.getAdminPage = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Phiên đăng nhập kết thúc. Vui lòng đăng nhập lại');
        return res.redirect('/');
    }
    if (req.session.user.role !== "Admin") {
        res.redirect('/profile');
    }
    res.render('admin', {user: req.session.user, pageTitle: 'Admin page', path: '/admin'});
}