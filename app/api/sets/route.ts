import { NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ data: repository.listSets() });
}
