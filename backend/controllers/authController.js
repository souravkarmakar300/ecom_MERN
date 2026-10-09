const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "10d" });
};

// Register a new User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid user data"
            });
        }

        // Generate OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Email message
        const message = `
        Welcome to our platform, ${name}!

        Thank you for registration.

        Your OTP for registration is: ${otp}
        `;

        // Send email
        await sendEmail(
            email,
            "Welcome to our platform",
            message
        );

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            message: "User registered successfully. Please check your email for the OTP."
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (
            user &&
            await bcrypt.compare(password, user.password)
        ) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }

        return res.status(401).json({
            message: "Invalid credentials"
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Error logging in user",
            error: error.message
        });
    }
};

const getUsers = async (req,res)=>{
    try{
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({ message: "Error fetching users", error });
    }
}


module.exports = { registerUser , loginUser , getUsers};