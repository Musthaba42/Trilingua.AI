import { NextResponse } from "next/server";
import { getMockCourses } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const result = getMockCourses({
      domain: searchParams.get("domain") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
      lang: searchParams.get("lang") || undefined,
      free: searchParams.get("free") === "true" ? true : undefined,
      search: searchParams.get("search") || undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Course list error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
