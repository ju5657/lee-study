import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "파일 키가 없습니다" },
        { status: 400 }
      );
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME || "s3-lee-hyunju";

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);

    return NextResponse.json({
      success: true,
      message: "파일이 삭제되었습니다",
    });
  } catch (error) {
    console.error("S3 삭제 오류:", error);
    return NextResponse.json(
      { error: "파일 삭제 실패", details: String(error) },
      { status: 500 }
    );
  }
}
