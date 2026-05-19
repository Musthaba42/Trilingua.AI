import { NextResponse } from "next/server";
import { UserStateService } from "@/lib/user-state";

/**
 * API for Progress Tracking — POST updates lesson/course progress.
 */
export async function POST(request: Request) {
  try {
    const { courseId, lessonId, progress } = await request.json();
    
    if (!courseId || !lessonId || progress === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    UserStateService.updateProgress(courseId, lessonId, progress);

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update progress" }, { status: 500 });
  }
}
