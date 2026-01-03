import jwt from "jsonwebtoken";
import { SUPABASE_JWT_SECRET } from "../config.js";

export async function verifyToken(token) {
  if (!token) return null;
  try {
    if (SUPABASE_JWT_SECRET) {
      const payload = jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: ["HS256"] });
      return payload;
    }

    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return payload;
  } catch (err) {
    return null;
  }
}
