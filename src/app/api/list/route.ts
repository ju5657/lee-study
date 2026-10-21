import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { s3Client, S3_BUCKET_NAME } from "@/lib/s3";

export async function GET() {
  try {
    if (!S3_BUCKET_NAME) {
      return NextResponse.json(
        { error: "S3 버킷이 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME,
    });

    const response = await s3Client.send(command);

    const files = (response.Contents || []).map((obj) => ({
      key: obj.Key,
      size: obj.Size || 0,
      lastModified: obj.LastModified?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      files: files,
    });
  } catch (error) {
    console.error("S3 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "파일 목록 조회 실패", details: String(error) },
      { status: 500 }
    );
  }
}
