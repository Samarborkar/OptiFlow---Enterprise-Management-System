const User = require("../models/User");
const jwt = require('jsonwebtoken');


// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '',username: '', password: '' };

  if (err.message === 'User not found') {
    errors.email = 'Invalid credentials';
    errors.username = 'Invalid credentials';
  }
  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000 && err.message.includes('email')) {
    errors.email = 'that email is already registered';
    return errors;
  }
  // duplicate username error
  if (err.code === 11000 && err.message.includes('username')) {
    errors.username = 'That username is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  console.log(user._id, user.admin,user)
  return jwt.sign({ id: user._id, admin: user.admin ,designation:user.designation,username:user.username}, 'net ninja secret', {
    expiresIn: maxAge
  });
};




//controller actions
module.exports.signup_get = (req, res) => {
  
}


module.exports.login_get = (req, res) => {
 
}



module.exports.signup_post = async (req, res) => {
  const { email, username, password , designation } = req.body;

  try {
    const user = await User.create({ email,username, password , designation});
    const token = createToken(user);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id, username: user.username });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.signupAdmin_post = async (req, res) => {
  const { email, password ,username , designation } = req.body;
  const admin=true;
  try {
    const user = await User.signup(email, username ,password,admin , designation);

    // Create a token and storing it in a cookie
    const token = createToken(user);
    res.cookie('jwt', token, {
      httpOnly: false, 
      maxAge:  24 * 60 * 60 * 1000 // 1 days duration of the cookie
    });

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.loginAdmin_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password  );
    if (!user.admin) {
      console.log(user._id);
      console.log(user.admin);
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
    // Create a token and storing it in a cookie
    const token = createToken(user);
    res.cookie('jwt', token, {
      httpOnly: false,
      sameSite: 'Lax', // Allows cookies for cross-origin requests
      secure: false, 
      maxAge:24 * 60 * 60 * 1000 // 1 days duration of the cookie
    });
    console.log(res.cookie);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.login_post = async (req, res) => {
  const {email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user);
    res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, username: user.username });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.forgot_password_patch = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify if the user exists with the provided details
    const user = await User.findOne({ email});
    if (!password) {
      return res.status(400).json({ errors: { password: 'Password is required' } });
    }
    if (!user) {
      return res.status(404).json({ errors: { general: 'User not found with these credentials' } });
    }

    // Hash the new password
    // const salt = await bcrypt.genSalt();
    // const has, username, designation hedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = password;
    console.log(user.password)
    await user.save();
    res.cookie('jwt', '', { maxAge: 1 });
    console.log('success')
    // Respond with success
     return res.status(200).json({ message: 'Password updated successfully' });
    
    
  } catch (err) {
    console.log(err);
    res.status(400).json({ errors: { general: 'Something went wrong' } });
  }
}

module.exports.update_profile_patch = async (req, res) => {
  const { username, designation ,id } = req.body;
  const userId = id; // Assuming you have user ID from the session or JWT
  console.log(userId)
  try {
    // Update the user with the new name and designation
    const user = await User.findByIdAndUpdate(userId, { username, designation }, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ errors: { general: 'User not found' } });
    }

    
    // const token = createToken(user._id);
    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ user: user._id });
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');

}