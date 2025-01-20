import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
// Connect to MongoDB

mongoose.connect("mongodb+srv://pushpit:pushpitkamboj@cluster0.tds00.mongodb.net/");

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: {type: String, required: true},
    password: {type: String, required: true}

});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: {type: String, required: true},
    password: {type: String, required: true},
    purchasedCourse: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageLink: {type: String, required: true}
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

export {
    Admin,
    User,
    Course
}
