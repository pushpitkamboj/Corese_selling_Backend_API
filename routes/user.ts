import { Router, Request, Response } from "express";
import userMiddleware from "../middleware/user";
import { z } from "zod";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY!;
const router = Router();

import {User, Course} from "../db"

const signupSchema = z.object({
    username: z.string().min(2, {message: "name must have atleast 2 characters"}),
    password: z.string().min(8, {message: "password must be at least 8 characters long"})
})

function signin_jwt(username: string, password: string) {

    const signature = jwt.sign({
        username
    }, SECRET_KEY);

    return signature;

}
// Admin Routes
router.post('/signup', async (req: Request, res: Response) => {
    // Implement admin signup logic
    const { username, password } = req.body;

    const check = signupSchema.safeParse({
        username,
        password
    })
    
    if (!check.success) {
        // Extract detailed validation errors from Zod
        const errors = check.error.issues.map(issue => issue.message).join(", ");
        res.status(400).json({ message: errors });
        return;
    }

    // Check if username exists
    const existingUser = await User.findOne({ username })

    if (existingUser)  {
        res.status(400).json({
            message: "username already exists",
        })
        return;
    }
    // const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        username: username,
        password: password
    })

    res.status(201).json({message: "user signed in successfully"})
});

router.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = await User.find({
        username,
        password
    })

    if (user) {
        const token = jwt.sign({
            username
        }, SECRET_KEY)

        res.json({
            token
        })
    }
    else {
        res.status(411).json({
            message: "incorrect username or password"
        })
    }
    
})
router.get('/courses', async (req, res) => {
    const allCourses = await Course.find({});
    res.json({
        message: "all courses showed successfully",
        courses: allCourses
    })    
});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const name_user = req.headers.username;
    
    const user = await User.findOne({ username: name_user });

    if (Array.isArray(user.purchasedCourse)) {
        if (user.purchasedCourse.includes(courseId)) {
            res.json({
                message: "the course is already purchased by you"
            })
            return;
        }
    }

        const result = await User.updateOne({
        username: name_user
    }, {
        "$push": {
            purchasedCourse: courseId
        }
    })

    if (result.modifiedCount === 1) {
        res.json({
            message: "Purchase complete!"
        });
        return;
    } else {
        res.status(500).json({
            message: "Failed to update the user. Please try again."
        });
    }

});

router.get('/purchasedCourse', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    });

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourse
        }
    });
    if (!courses) {
        res.json({
            message: "the user has not purchased any courses"
        })
    }
    res.json({
        courses: courses
    })
});

export default router;

