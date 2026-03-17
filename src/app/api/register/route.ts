import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { User, Category, Goal, Contact, Notification } from "@/models";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        await dbConnect();

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({ name, email, password: hashedPassword });

        // Seed default categories
        const defaultCategories = [
            { name: "Alimentation", type: "expense", color: "#333" },
            { name: "Loisirs", type: "expense", color: "#333" },
            { name: "Transports", type: "expense", color: "#333" },
            { name: "Salaires", type: "income", color: "#f5f5f5" }
        ];

        await Category.insertMany(defaultCategories.map(cat => ({
            ...cat,
            userId: newUser._id
        })));

        // Seed Initial System Notifications
        await Notification.create({
            title: "System Initialization",
            message: "Clearance granted. Welcome to your main Fncly terminal node.",
            type: "system",
            userId: newUser._id
        });

        // Seed Initial Demo Goal
        await Goal.create({
            name: "Emergency Fund",
            targetAmount: 5000,
            currentAmount: 1250,
            userId: newUser._id,
            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        });

        // Seed Initial Contact
        await Contact.create({
            name: "Central Server",
            initials: "CS",
            userId: newUser._id
        });

        return NextResponse.json({ message: "User registered" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error occured" }, { status: 500 });
    }
}
