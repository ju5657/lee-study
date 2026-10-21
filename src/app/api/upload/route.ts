import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { s3Client, S3_BUCKET_NAME, MAX_UPLOAD_BYTES } from "@/lib/s3";

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

    if (file.size >= MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          error: "파일 크기는 1MB 미만이어야 합니다",
          maxBytes: MAX_UPLOAD_BYTES,
          size: file.size,
        },
        { status: 413 }
      );
    }

    if (!S3_BUCKET_NAME) {
      return NextResponse.json(
        { error: "S3 버킷이 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
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
