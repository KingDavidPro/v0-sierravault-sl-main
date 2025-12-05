import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/User"
import Vault from "@/models/Vault"
import dbConnect from "@/lib/dbConnect"

export async function GET(req: NextRequest) {
    await dbConnect()

    const token = req.cookies.get("token")?.value
    if (!token) return NextResponse.json({ user: null }, { status: 200 })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
        const user = await User.findById(decoded.id).lean()
        if (!user) return NextResponse.json({ user: null }, { status: 404 })

        const vault = await Vault.findById(user.vaultId).lean()
        return NextResponse.json({
            user: { ...user, documents: vault?.documents || [] },
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ user: null }, { status: 200 })
    }
}
