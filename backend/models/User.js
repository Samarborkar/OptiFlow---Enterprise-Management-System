const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: true,
    minlength: [3, 'Minimum username length is 3 characters'],
    maxlength: [20, 'Maximum username length is 20 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  admin: {
    type: Boolean,
    default: false,
  },
  designation: {
    type: String,
    required: true,
  },
  createdTasks: [{  // List of tasks created by the user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  assignedTasks: [{  // List of tasks assigned to the user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
});



// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {

  const user = await this.findOne({
    $or: [
       {email}
    ]
  });

  if (!user) {
    throw new Error('User not found');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  return user; 
};


// static signup method
userSchema.statics.signup = async function(email, username  ,password ,admin, designation) {
  console.log(email, username , designation ,password ,admin);
  // validation
  if (!email || !password || !username || !designation) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  // const salt = await bcrypt.genSalt(10)
  // const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, username , password,admin ,designation})

  return user
}
const User = mongoose.model('user', userSchema);

module.exports = User;