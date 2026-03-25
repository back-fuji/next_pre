// jest-dom のカスタムマッチャーをインポート（toBeInTheDocument 等）
import "@testing-library/jest-dom";
import { config } from "dotenv";

// テスト時に .env.local を読み込む（Next.js は自動読み込みするが Vitest は手動で読む必要がある）
config({ path: ".env.local" });
