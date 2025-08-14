const { Router } = require('express');
const authController = require('../controllers/authController');
//const {requireAdminAuth} = require('../middleware/authMiddleware');
const {requireAuth} = require('../middleware/authMiddleware')
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.post('/logout', authController.logout_get);
router.post('/signup_admin',authController.signupAdmin_post);
router.post('/login_admin', authController.loginAdmin_post);
router.get('/', requireAuth, (req, res) => {
    res.json('You have successfully accessed the protected route!');
  });
router.patch('/forgot_password',authController.forgot_password_patch)
router.patch('/update_profile',authController.update_profile_patch)
module.exports = router;