import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Transaction, Category } from "@/models";
import pdf from "pdf-parse";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    try {
        const { rawData, fileType } = await req.json();
        let textContent = "";

        if (fileType === "application/pdf") {
            const dataBuffer = Buffer.from(rawData.split(",")[1], "base64");
            const data = await pdf(dataBuffer);
            textContent = data.text;
        } else {
            textContent = rawData;
        }

        const lines = textContent.split("\n");
        const transactionsToCreate = [];
        const categories = await Category.find({ userId: session.user.id });

        // Regex to match dates (DD/MM/YYYY or YYYY-MM-DD or DD.MM.YYYY)
        // And match amounts like 42.50 or -42,50
        const datePattern = /(\d{2}[-/\.]\d{2}[-/\.]\d{4})|(\d{4}[-/\.]\d{2}[-/\.]\d{2})/;
        const amountPattern = /(-?\d+[\.,]\d{2})/;

        for (let line of lines) {
            const dateMatch = line.match(datePattern);
            const amountMatch = line.match(amountPattern);

            if (dateMatch && amountMatch) {
                const dateStr = dateMatch[0].replace(/\./g, "-").replace(/\//g, "-");
                const amountStr = amountMatch[0].replace(",", ".");
                
                // Note is often the rest of the line around the matches
                const note = line.replace(dateMatch[0], "").replace(amountMatch[0], "").trim();

                const amount = parseFloat(amountStr);
                const type = amount > 0 ? "income" : "expense";

                let categoryId = null;
                const lowerNote = note.toLowerCase();

                if (lowerNote.includes("resto") || lowerNote.includes("cafe") || lowerNote.includes("bouffe") || lowerNote.includes("superm") || lowerNote.includes("lecl")) {
                    categoryId = categories.find(c => c.name.toLowerCase().includes("alim"))?._id;
                } else if (lowerNote.includes("carbur") || lowerNote.includes("essence") || lowerNote.includes("sncf") || lowerNote.includes("uber") || lowerNote.includes("taxi")) {
                    categoryId = categories.find(c => c.name.toLowerCase().includes("transp"))?._id;
                } else if (lowerNote.includes("netfl") || lowerNote.includes("spotify") || lowerNote.includes("amazon") || lowerNote.includes("apple") || lowerNote.includes("google")) {
                    categoryId = categories.find(c => c.name.toLowerCase().includes("abon"))?._id;
                } else if (lowerNote.includes("loyer") || lowerNote.includes("edf") || lowerNote.includes("elec") || lowerNote.includes("assurance") || lowerNote.includes("axa")) {
                    categoryId = categories.find(c => c.name.toLowerCase().includes("logem"))?._id || categories.find(c => c.name.toLowerCase().includes("assur"))?._id;
                } else if (lowerNote.includes("salair") || lowerNote.includes("vir") || lowerNote.includes("pay")) {
                    categoryId = categories.find(c => c.name.toLowerCase().includes("salair"))?._id;
                }

                if (!categoryId) {
                    categoryId = categories.find(c => c.name.toLowerCase().includes("autres"))?._id;
                }

                // Parse date safely
                let parsedDate = new Date(dateStr);
                if (isNaN(parsedDate.getTime())) {
                    // Try DD-MM-YYYY swap
                    const parts = dateStr.split("-");
                    if (parts[0].length === 2 && parts[2].length === 4) {
                        parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    }
                }

                transactionsToCreate.push({
                    amount: Math.abs(amount),
                    type,
                    date: parsedDate,
                    note: note.substring(0, 50) || "Importé",
                    userId: session.user.id,
                    categoryId
                });
            }
        }

        if (transactionsToCreate.length === 0) {
            return NextResponse.json({ message: "Aucune transaction valide trouvée" }, { status: 400 });
        }

        await Transaction.insertMany(transactionsToCreate);

        return NextResponse.json({ message: `${transactionsToCreate.length} transactions importées avec succès.` }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
