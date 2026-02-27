import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
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

    const query: any = { userId: session.user.id };
    if (startDate) query.date = { ...query.date, $gte: new Date(startDate) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };

    const transactions = await Transaction.find(query);
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;

    // Monthly data (last 6 months)
    const monthlyData = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(session.user.id) } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            }
        },
        { $sort: { _id: -1 } },
        { $limit: 6 }
    ]);

    // Expenses by category
    const expensesByCategory = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(session.user.id), type: "expense" } },
        {
            $group: {
                _id: "$categoryId",
                total: { $sum: "$amount" }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "category"
            }
        },
        { $unwind: "$category" }
    ]);

    return NextResponse.json({
        balance,
        income,
        expense,
        monthly: monthlyData.reverse().map(m => ({ month: m._id, income: m.income, expense: m.expense })),
        by_category: expensesByCategory.map(c => ({ name: c.category.name, value: c.total }))
    });
}
