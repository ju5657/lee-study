import { S3Client } from "@aws-sdk/client-s3";

/**
 * S3 설정.
 * - 로컬: .env.local 의 AWS_* 값으로 동작
 * - Amplify Hosting: AWS_ 접두사 환경 변수는 예약되어 있어 S3_* 이름을 사용하고,
 *   자격 증명은 Amplify 컴퓨팅 역할(IAM Role)에서 자동으로 가져온다.
 */
export const S3_REGION =
  process.env.S3_REGION || process.env.AWS_REGION || "ap-southeast-2";

export const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME || "";

/** 업로드 허용 최대 크기 (1MB 미만) */
export const MAX_UPLOAD_BYTES = 1024 * 1024;

const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

export const s3Client = new S3Client({
  region: S3_REGION,
  // 키가 없으면 SDK 기본 자격 증명 체인(IAM Role 등)을 사용
  ...(accessKeyId && secretAccessKey
    ? { credentials: { accessKeyId, secretAccessKey } }
    : {}),
});
