import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function GET(request: NextRequest) {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || "s3-lee-hyunju";

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
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
