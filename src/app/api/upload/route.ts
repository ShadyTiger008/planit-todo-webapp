import { writeFile } from "fs/promises";
import { join, relative } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define the path to the uploads folder within the public directory
  const publicFolderPath = join(process.cwd(), "public");
  const uploadsFolderPath = join(publicFolderPath, "uploads");

  // Construct the full path for the uploaded file
  const filePath = join(uploadsFolderPath, Date.now() + "-" + file.name);

  try {
    // Write the file to the specified path
    await writeFile(filePath, buffer);
    console.log(`File saved at: ${filePath}`);

    // Compute the relative path of the uploaded file
    const relativePath = relative(publicFolderPath, filePath);

    // Prepend '/uploads/' to the relative path
    const uploadUrl = `${relativePath.replace(/\\/g, "/")}`;

    return NextResponse.json(
      {
        message: "Successfully uploaded the file",
        file: uploadUrl,
        success: true
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ success: false });
  }
}
