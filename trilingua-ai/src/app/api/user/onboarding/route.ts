import { NextResponse } from "next/server";
import { UserStateService } from "@/lib/user-state";

/**
 * API for Onboarding — POST saves profile, GET retrieves it.
 * Uses the UserStateService for demo persistence.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save preferences
    UserStateService.updatePreferences({
      onboardingDone: true,
      ...body
    });

    return NextResponse.json({
      success: true,
      message: "Onboarding complete! Welcome to Trilingua AI.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save profile" }, { status: 500 });
  }
}

export async function GET() {
  const state = UserStateService.getState();
  return NextResponse.json({
    success: true,
    data: state.preferences,
  });
}
