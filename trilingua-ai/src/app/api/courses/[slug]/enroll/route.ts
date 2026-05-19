import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Mock enrollment — always succeeds
  return NextResponse.json({
    success: true,
    data: { id: `enroll-${Date.now()}`, courseSlug: params.slug },
    message: "Enrolled successfully!",
  });
}
