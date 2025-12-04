import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";

export interface AuthenticatedNextApiRequest extends NextApiRequest {
    userId: string;
}

export const requireAuth = (handler: NextApiHandler) => async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        (req as AuthenticatedNextApiRequest).userId = payload.userId;
        return handler(req, res);
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
