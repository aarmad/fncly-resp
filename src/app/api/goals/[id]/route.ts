import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Goal } from "@/models";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = params;

    try {
        const body = await req.json();
        const goal = await Goal.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $inc: { currentAmount: parseFloat(body.amount) } },
            { new: true }
        );

        if (!goal) return NextResponse.json({ message: "Goal not found" }, { status: 404 });

        return NextResponse.json(goal);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = params;

    try {
        await Goal.findOneAndDelete({ _id: id, userId: session.user.id });
        return NextResponse.json({ message: "Goal deleted" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
