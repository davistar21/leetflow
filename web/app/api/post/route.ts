import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs/promises";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { markdown, title } = reqBody;

    if (!markdown || !title) {
      return NextResponse.json(
        { error: "Missing markdown content or title" },
        { status: 400 }
      );
    }

    // Define paths
    // web/ is current cwd, so scripts are at ../scripts
    const rootDir = path.resolve(process.cwd(), "..");
    const scriptsDir = path.join(rootDir, "scripts");
    const tempFile = path.join(scriptsDir, "temp_post.md");

    // Sanitize filename for Gist
    const safeFilename =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + ".md";

    // Write markdown to temp file
    await fs.writeFile(tempFile, markdown, "utf-8");

    // 0. Update Thread ID or Day if provided
    try {
      if (reqBody.day) {
        // User wants the NEXT post to be this day.
        // Script 'get_next_day' does current + 1.
        // So we set current to (day - 1).
        const dayArg = parseInt(reqBody.day) - 1;
        const updateDayCommand = `python "${path.join(
          scriptsDir,
          "progress_tracker.py"
        )}" set_day ${dayArg}`;
        await execPromise(updateDayCommand, { cwd: rootDir });
      }

      if (reqBody.lastThreadId) {
        // Resetting thread ID. We assume this starts a new streak or fixes a broken one.
        // If DAY was also provided above, we don't want to reset it to 2 here.
        // So only reset day to 2 if DAY wasn't manually provided.
        const dayArg = reqBody.day ? parseInt(reqBody.day) - 1 : 2;

        const updateCommand = `python "${path.join(
          scriptsDir,
          "progress_tracker.py"
        )}" update ${dayArg} "${reqBody.lastThreadId}"`;
        await execPromise(updateCommand, { cwd: rootDir });
      }
    } catch (e) {
      console.error("Failed to update progress:", e);
    }

    // 1. Create Gist
    // python scripts/gist_publisher.py <filename> <temp_file_path>
    const gistCommand = `python "${path.join(
      scriptsDir,
      "gist_publisher.py"
    )}" "${safeFilename}" "${tempFile}"`;

    let gistUrl = "";
    try {
      const { stdout, stderr } = await execPromise(gistCommand, {
        cwd: rootDir,
      });
      if (stderr && !stdout) throw new Error(stderr);
      gistUrl = stdout.trim();
    } catch (err: any) {
      console.error("Gist Error:", err);
      return NextResponse.json(
        { error: "Failed to create Gist: " + err.message },
        { status: 500 }
      );
    }

    if (!gistUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid Gist URL returned: " + gistUrl },
        { status: 500 }
      );
    }

    // 2. Post to X (Twitter)
    // python scripts/twitter_poster.py <title> <gist_url>
    const twitterCommand = `python "${path.join(
      scriptsDir,
      "twitter_poster.py"
    )}" "${title}" "${gistUrl}"`;

    let tweetOutput = "";
    try {
      const { stdout, stderr } = await execPromise(twitterCommand, {
        cwd: rootDir,
      });
      if (stderr && !stdout) throw new Error(stderr);
      tweetOutput = stdout.trim();
    } catch (err: any) {
      // Don't fail the whole request if Twitter fails, but report it
      console.error("Twitter Error:", err);
      return NextResponse.json({
        success: true,
        gistUrl,
        warning: "Gist created but Twitter post failed: " + err.message,
      });
    }

    // Clean up temp file
    try {
      await fs.unlink(tempFile);
    } catch (e) {
      /* ignore */
    }

    return NextResponse.json({ success: true, gistUrl, message: tweetOutput });
  } catch (error: any) {
    console.error("Post handler error:", error);
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
