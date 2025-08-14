const jwt = require('jsonwebtoken');
const User = require('../models/User');


const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        
        //res.render('./login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    //res.render('./login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
// const requireAdminAuth = async (req, res, next) => {
//   // Gets the token from cookies or Authorization header
//   console.log(req.cookies)
//   const token = req.cookies?.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
//     if (!token) {
//       return res.status(401).json({ error: 'Authorization token required' });
//     }
  
//   try {
//     let user;
//     jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
//       if (err) {
//         res.locals.user = null;
//       } else {
//          user = await User.findById(decodedToken.id);
//         res.locals.user = user;
//       }
//     });
//     // const { _id } = jwt.verify(token, 'net ninja secret'); 
//     // // Find the user by ID and stores their __id and admin fields in user
//     console.log(user._id);
//     // const user = await User.findOne({ _id }).select('_id admin');  
//     if (!user) {
//       return res.status(401).json({ error: 'User not found' });
//     }
//     // If the user is not an admin access is denied
//     if (!user.admin) {
//         console.log(user._id);
//         console.log(user.admin);
//       return res.status(403).json({ error: 'Access denied: Admins only' });
//     }
//     req.user = user;
//     req.userId = user._id;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ error: 'Request is not authorized' });
//   }
// };

module.exports = { requireAuth, checkUser };