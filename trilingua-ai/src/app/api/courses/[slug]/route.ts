import { NextResponse } from "next/server";
import { MOCK_COURSES } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const course = MOCK_COURSES.find(c => c.slug === params.slug);

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Transform to match the expected shape from Prisma
    const data = {
      ...course,
      domain: { slug: course.domainSlug, name: course.domainName, color: course.domainColor },
      langVariants: course.languages.map(lang => ({ lang, title: course.title })),
      _count: { lessons: course.lessonCount, enrollments: Math.floor(Math.random() * 200) + 10 },
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Course detail error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
