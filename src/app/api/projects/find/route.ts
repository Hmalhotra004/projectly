import getCurrentUser from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const profile = await getCurrentUser();

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const projectId = req.nextUrl.searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await db.project.findUnique({
      where: {
        id: projectId,
        userId: profile.id,
      },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("[GET Projects Error]", err);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const profile = await getCurrentUser();

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { state, id } = await req.json();

    if (typeof state !== "boolean" || !id) {
      return NextResponse.json({ error: "Info missing" }, { status: 404 });
    }

    const project = await db.project.update({
      where: {
        id,
        userId: profile.id,
      },
      data: {
        completed: !state,
      },
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error("[projects][PUT] An error occurred:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const profile = await getCurrentUser();

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { date, desp, id } = await req.json();

    const project = await db.project.update({
      where: {
        id,
        userId: profile.id,
      },
      data: {
        dueDate: date,
        description: desp,
      },
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error("[projects][PATCH] An error occurred:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
