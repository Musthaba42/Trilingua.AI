import { NextResponse } from "next/server";
import { MOCK_DOMAINS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_DOMAINS });
}
