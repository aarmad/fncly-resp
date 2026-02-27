import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Transaction } from "@/models";
import mongoose from "mongoose";

export async function GET(req: any) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const type = searchParams.get("type");
    const categoryId = searchParams.get("category_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 15;

    const query: any = { userId: session.user.id };

    if (startDate) query.date = { ...query.date, $gte: new Date(startDate) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };
    if (type) query.type = type;
    if (categoryId) query.categoryId = categoryId;

    const transactions = await Transaction.find(query)
        .populate("categoryId")
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Transaction.countDocuments(query);

    return NextResponse.json({
        data: transactions,
        current_page: page,
        last_page: Math.ceil(total / limit),
        total
    });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    const transaction = await Transaction.create({
        ...body,
        userId: session.user.id
    });

    return NextResponse.json(transaction, { status: 201 });
}
