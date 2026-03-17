import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Goal } from "@/models";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    try {
        const body = await req.json();
        const goal = new Goal({
            ...body,
            userId: session.user.id
        });
        await goal.save();
        return NextResponse.json(goal, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
