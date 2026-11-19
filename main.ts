// Build script: copies the guide app + screenshots into /output and writes dossier.json.
// Deterministic: same inputs always produce the same bytes. No network.
import { buildDossier } from "./vendor/makefun-frontend.ts";
import { cp, mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR
  ? path.resolve(process.env.MAKEFUN_OUTPUT_DIR)
  : path.join(repoRoot, "out");

// Everything the browser needs lives under these two directories.
const trees = [
  { from: path.join(repoRoot, "app"), to: path.join(outputDir, "app") },
  { from: path.join(repoRoot, "screenshots"), to: path.join(outputDir, "screenshots") },
];

async function mirrorTree(fromDir: string, toDir: string): Promise<void> {
  await mkdir(toDir, { recursive: true });
  await cp(fromDir, toDir, { recursive: true });
}

async function build(): Promise<void> {
  // Fail fast with a readable error instead of a half-copied output.
  const index = path.join(repoRoot, "app", "index.html");
  await stat(index).catch(() => {
    throw new Error("app/index.html is missing — nothing to hand in");
  });
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  for (const tree of trees) {
    await mirrorTree(tree.from, tree.to);
  }
  // buildDossier returns the dossier as canonical JSON bytes; the caller writes it.
  const dossier = await buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  await writeFile(path.join(outputDir, "dossier.json"), dossier);
  console.log(`wrote ${outputDir} (dossier ${dossier.length} bytes)`);
}

await build();
