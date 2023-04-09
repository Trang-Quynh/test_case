//Điều hướng
const guestController = require('./handle/guestController');
const ErrorController = require('./handle/errorController');
const userController = require('./handle/userController');
const adminController = require('./handle/adminController');



const router = {
    //! guest control
    "home" : guestController.home,
    'signin':guestController.signIn,
    'signup':guestController.signUp,
    'blogAdmin':adminController.blogAdmin,
    'blogUser':userController.blogUser,
    "blog-details": guestController.blogDetails,
    "my-profile-connections" : guestController.profileConnection,
    "my-profile" : guestController.myProfile,
    "offline" : guestController.offline,
    "" : guestController.home,
    'editPost':userController.editPost,
    "addPost": userController.addPost,
    'editAccount':userController.editAccount,
    'post':guestController.blogDetails
};

module.exports = router;