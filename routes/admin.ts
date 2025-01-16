import {Router, Request, Response} from "express"
import adminMiddleware from "../middleware/admin"
const router = Router();

import { Admin, Course } from '../db';

router.post('/signup', async (req: Request, res: Response) => {
    // Implement admin signup logic
    const { username, password } = req.body;

    // Check if username exists
    const existingUser = await Admin.findOne({ username })

    if (existingUser)  {
        res.status(400).json({
            message: "username or email already exists",
        })
        return;
    }

    const newUser = await Admin.create({
        username,
        password
    })

    res.status(201).json({message: "user logged in successfully", user: newUser})
});

router.post('/courses', adminMiddleware, async (req: Request, res: Response) => {
    // Implement course creation logic
    const {title, description, price, imageLink} = req.body;
    if (!title || !description || !price || !imageLink) {
        res.status(400).json({
            message: "please mention all the details"
        })
        return;
    }

    const newCourse = await Course.create({
        title, 
        description,
        price,
        imageLink,
    })

    res.status(201).json({message: "course created successfully", Course: newCourse, courseId: newCourse._id})
});

router.get('/courses', adminMiddleware, async (req: Request, res: Response) => {
    const allCourses = await Course.find({});
    res.json({
        message: "all courses showed successfully",
        courses: allCourses
    })
});

export default router;
