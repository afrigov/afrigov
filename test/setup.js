// Vitest global setup: make sure dist/ is fresh before the build tests run.
import { execSync } from "node:child_process";

export default function setup() {
  execSync("pnpm build", { stdio: "inherit" });
}
