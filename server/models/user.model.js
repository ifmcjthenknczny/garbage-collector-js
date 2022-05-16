import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    lastLogin: Date,
    registrationTime: Date,
    isActive: Boolean,
    isAdmin: Boolean,
    password: String
});
const User = mongoose.model('User', UserSchema);

export default User;