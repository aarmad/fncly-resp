import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { User, Category } from "@/models";

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
            { name: "Alimentation", type: "expense", color: "#6366f1" },
            { name: "Loisirs", type: "expense", color: "#10b981" },
            { name: "Transports", type: "expense", color: "#f59e0b" },
            { name: "Salaires", type: "income", color: "#10b981" }
        ];

        await Category.insertMany(defaultCategories.map(cat => ({
            ...cat,
            userId: newUser._id
        })));

        return NextResponse.json({ message: "User registered" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error occured" }, { status: 500 });
    }
}
