# AWS Cloud Study — Next.js × AWS サーバーレス学習プロジェクト

Next.js (App Router) をフロントエンドに、AWS のマネージドサービス（Cognito / S3 / DynamoDB / Lambda / API Gateway）をバックエンドにしたフルスタックの個人学習プロジェクトです。
認証・ファイルストレージ・NoSQL データベース・サーバーレス API を一つの画面に統合し、インフラの一部は AWS CDK (TypeScript) でコード管理しています。

> 日本語 / 한국어 の 2 言語 UI に対応しています。（한국어 설명은 [아래](#한국어)에 있습니다）

## 主な機能

| 機能 | 内容 | 使用サービス |
|---|---|---|
| ログイン | Cognito Hosted UI による OAuth 2.0 認可コードフロー。ログイン前は保護画面を表示しない | Amazon Cognito |
| ファイル管理 | ファイルのアップロード・一覧表示・削除。Next.js Route Handler 経由でサーバー側から S3 を操作 | Amazon S3, AWS SDK v3 |
| 氏名分割 API | 入力したフルネームを姓と名に分割して返す | API Gateway + Lambda |
| ユーザー一覧 | DynamoDB のテーブルを照会して表形式で表示、行ごとの削除 | API Gateway + Lambda + DynamoDB |
| 多言語対応 | ヘッダーのセレクタで日本語 / 韓国語を即時切替 | React Context |

## アーキテクチャ

```
ブラウザ
  │
  ├─ Cognito Hosted UI ──▶ Amazon Cognito (User Pool)
  │        └─ /auth/callback で認可コードを受け取りログイン状態に遷移
  │
  ├─ Next.js Route Handlers (/api/upload, /api/list, /api/delete)
  │        └─ AWS SDK v3 (S3Client) ──▶ Amazon S3
  │
  └─ fetch ──▶ API Gateway ──▶ Lambda ─┬─▶ 氏名分割 (splitName)
                                        ├─▶ DynamoDB 照会 (selectData)
                                        └─▶ DynamoDB 削除 (deleteUser, CDK で構築)
```

- S3 の認証情報はサーバー側（Route Handler）にのみ置き、ブラウザへ露出しない構成にしています。
- Lambda / API Gateway のエンドポイントや Cognito の設定値はすべて環境変数で注入し、コードにハードコードしていません。
- `deleteUser` Lambda と HTTP API は別リポジトリの AWS CDK スタックで定義し、既存の DynamoDB テーブル・Cognito User Pool をインポートして権限付与しています。

## 技術スタック

**フロントエンド**
- Next.js 16 (App Router, Turbopack) / React 19 / TypeScript 5
- Tailwind CSS 4
- React Context による認証状態・言語状態の管理

**バックエンド / クラウド**
- Amazon Cognito（Hosted UI, OAuth 2.0 Authorization Code Flow）
- Amazon S3（AWS SDK for JavaScript v3）
- Amazon DynamoDB
- AWS Lambda (Node.js 20) + Amazon API Gateway (HTTP API)
- AWS CDK (TypeScript) によるインフラのコード化

**開発ツール**
- ESLint (eslint-config-next)
- AWS CLI

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx / HomeClient.tsx   # メイン画面（ログイン判定と各機能の配置）
│   ├── auth/callback/page.tsx      # Cognito リダイレクト先
│   ├── api/upload/route.ts         # S3 アップロード (POST)
│   ├── api/list/route.ts           # S3 一覧 (GET)
│   └── api/delete/route.ts         # S3 削除 (DELETE)
├── components/
│   ├── CognitoLoginForm.tsx        # ログイン画面
│   ├── S3Header.tsx / S3Upload.tsx / S3FileList.tsx
│   ├── NameInput.tsx               # 氏名分割 API 呼び出し
│   ├── DynamoDBTable.tsx           # DynamoDB 照会・削除
│   └── HeaderLangSelector.tsx      # 言語切替
├── contexts/
│   ├── CognitoContext.tsx          # 認証状態
│   └── LanguageContext.tsx         # 言語状態 (ko / ja)
└── config/cognito.ts               # Cognito の認可・ログアウト URL 生成
```

## ローカルでの起動

```bash
npm install
cp .env.example .env.local   # 値を設定
npm run dev -- -p 3002       # Cognito のリダイレクト URL に合わせたポート
```

ブラウザで http://localhost:3002 を開きます。必要な環境変数は [.env.example](.env.example) を参照してください。

## デモアカウント

Cognito に登録済みのテスト用アカウントです。「AWS Cognitoでログイン」ボタンから以下でログインできます。

| 項目 | 値 |
|---|---|
| メールアドレス | test@gmail.com |
| パスワード | Test1234! |

※ 学習・デモ専用のアカウントです。実在のメールボックスとは紐づいていません。

## 学んだこと・工夫した点

- Cognito Hosted UI を使った OAuth フローを自前で組み、リダイレクト／コールバックの扱いを理解した
- S3 の操作を Route Handler に寄せることで、アクセスキーをクライアントに渡さない設計にした
- フロントエンドの手作業設定を減らすため、Lambda + API Gateway の追加分を AWS CDK でコード化した
- 日本語 / 韓国語の UI を Context で切り替え、ラベルをコンポーネント内に集約した

---

<a id="한국어"></a>
## 한국어

Next.js(App Router)를 프런트엔드로, AWS 관리형 서비스(Cognito / S3 / DynamoDB / Lambda / API Gateway)를 백엔드로 사용한 풀스택 개인 학습 프로젝트입니다. 인증, 파일 저장소, NoSQL 데이터베이스, 서버리스 API를 한 화면에 통합했고, 일부 인프라는 AWS CDK(TypeScript)로 코드 관리합니다.

**주요 기능**
- Cognito Hosted UI 기반 OAuth 2.0 로그인. 로그인 전에는 보호 화면을 표시하지 않음
- S3 파일 업로드 / 목록 / 삭제. Next.js Route Handler를 통해 서버 측에서만 S3에 접근
- API Gateway + Lambda로 이름을 성과 이름으로 분리
- DynamoDB 테이블 조회 및 행 삭제 (삭제용 Lambda와 HTTP API는 CDK로 구축)
- 한국어 / 일본어 UI 즉시 전환

**기술 스택**
- Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- Amazon Cognito, Amazon S3 (AWS SDK v3), Amazon DynamoDB, AWS Lambda (Node.js 20), Amazon API Gateway
- AWS CDK (TypeScript), ESLint, AWS CLI

**실행**

```bash
npm install
cp .env.example .env.local   # 값 설정
npm run dev -- -p 3002
```

**데모 계정**

"AWS Cognito로 로그인" 버튼을 누른 뒤 아래 계정으로 로그인할 수 있습니다. 학습·시연 전용 계정이며 실제 메일함과 연결되어 있지 않습니다.

| 항목 | 값 |
|---|---|
| 이메일 | test@gmail.com |
| 비밀번호 | Test1234! |
