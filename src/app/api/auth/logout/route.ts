import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/infrastructure/auth/session.provider";
import { toPublicError } from "@/lib/errors";
import { enforceSameOrigin } from "@/lib/security";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
    await clearAuthCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const publicError = toPublicError(error);
    return NextResponse.json({ error: publicError.message }, { status: publicError.statusCode });
  }
}