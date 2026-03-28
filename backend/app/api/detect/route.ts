import { spawn } from "child_process";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const { imagePath } = await req.json();

    if (!imagePath || typeof imagePath !== "string") {
      return NextResponse.json(
        { error: "imagePath is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    return await new Promise<Response>((resolve) => {
      const pythonProcess = spawn("python", ["detect_api.py", imagePath]);
      let resultData = "";
      let errorData = "";

      pythonProcess.stdout.on("data", (data: Buffer) => {
        resultData += data.toString();
      });

      pythonProcess.stderr.on("data", (data: Buffer) => {
        errorData += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const parsed = JSON.parse(resultData);
            resolve(NextResponse.json(parsed, { headers: corsHeaders }));
          } catch {
            resolve(
              NextResponse.json(
                { error: "JSON Parse Error", detail: resultData },
                { status: 500, headers: corsHeaders },
              ),
            );
          }
        } else {
          resolve(
            NextResponse.json(
              { error: "Python Process Failed", detail: errorData },
              { status: 500, headers: corsHeaders },
            ),
          );
        }
      });

      pythonProcess.on("error", (error) => {
        resolve(
          NextResponse.json(
            { error: "Python Spawn Failed", detail: String(error) },
            { status: 500, headers: corsHeaders },
          ),
        );
      });
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid Request" },
      { status: 400, headers: corsHeaders },
    );
  }
}
