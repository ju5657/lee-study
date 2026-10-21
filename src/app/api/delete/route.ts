import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { s3Client, S3_BUCKET_NAME } from "@/lib/s3";

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "파일 키가 없습니다" },
        { status: 400 }
      );
    }

    if (!S3_BUCKET_NAME) {
      return NextResponse.json(
        { error: "S3 버킷이 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
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
