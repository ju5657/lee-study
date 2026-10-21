import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 없습니다" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME || "s3-lee-hyunju";

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    return NextResponse.json({
      success: true,
      message: "파일이 업로드되었습니다",
      filename: filename,
      originalName: file.name,
    });
  } catch (error) {
    console.error("S3 업로드 오류:", error);
    return NextResponse.json(
      { error: "파일 업로드 실패", details: String(error) },
      { status: 500 }
    );
  }
}
