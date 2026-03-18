import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Category } from "@/models";

export async function GET(req: any) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    let categories = await Category.find({ userId: session.user.id });

    if (categories.length === 0) {
        const defaults = [
            // Expenses
            { name: "Alimentation", type: "expense", color: "#EF4444" },
            { name: "Transport", type: "expense", color: "#F59E0B" },
            { name: "Logement", type: "expense", color: "#3B82F6" },
            { name: "Santé", type: "expense", color: "#10B981" },
            { name: "Loisirs", type: "expense", color: "#8B5CF6" },
            { name: "Shopping", type: "expense", color: "#EC4899" },
            { name: "Abonnements", type: "expense", color: "#6B7280" },
            { name: "Internet/Tél", type: "expense", color: "#06B6D4" },
            { name: "Assurance", type: "expense", color: "#6366F1" },
            { name: "Impôts", type: "expense", color: "#4B5563" },
            { name: "Éducation", type: "expense", color: "#F43F5E" },
            { name: "Voyage", type: "expense", color: "#14B8A6" },
            { name: "Cadeaux", type: "expense", color: "#D946EF" },
            { name: "Autres", type: "expense", color: "#9CA3AF" },
            // Income
            { name: "Salaire", type: "income", color: "#10B981" },
            { name: "Freelance", type: "income", color: "#3B82F6" },
            { name: "Vente", type: "income", color: "#F59E0B" },
            { name: "Cadeaux Recus", type: "income", color: "#EC4899" },
            { name: "Investissements", type: "income", color: "#8B5CF6" }
        ];

        await Category.insertMany(defaults.map(cat => ({ ...cat, userId: session.user.id })));
        categories = await Category.find({ userId: session.user.id });
    }

    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    const category = await Category.create({
        ...body,
        userId: session.user.id
    });

    return NextResponse.json(category, { status: 201 });
}
