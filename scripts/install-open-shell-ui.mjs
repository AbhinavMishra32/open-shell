#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const DEFAULT_REPO = "https://github.com/AbhinavMishra32/open-shell.git";
const DEFAULT_REF = "main";
const DEFAULT_OUT_DIR = "src/components/open-shell";
const REQUIRED_DEPS = [
  "@radix-ui/react-context-menu",
  "@radix-ui/react-dialog",
  "@radix-ui/react-dropdown-menu",
  "@radix-ui/react-slot",
  "@radix-ui/react-tabs",
];

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const targetRoot = path.resolve(args.target ?? process.cwd());
const outDir = path.resolve(targetRoot, args.outDir ?? DEFAULT_OUT_DIR);
const force = args.force === true;
const skipInstall = args.skipInstall === true;
const sourceRoot = resolveSourceRoot(args);

assertDirectory(targetRoot, "Target project directory");
assertDirectory(path.join(sourceRoot, "packages/ui/src"), "Open Shell UI source directory");

const packageJsonPath = path.join(targetRoot, "package.json");
if (!fs.existsSync(packageJsonPath)) {
  fail(`No package.json found in ${targetRoot}. Run this inside a React project or pass --target.`);
}

if (fs.existsSync(outDir) && !force) {
  fail(`${relative(targetRoot, outDir)} already exists. Re-run with --force to overwrite it.`);
}

copyDirectory(path.join(sourceRoot, "packages/ui/src"), outDir, { force });
writeInstallNotes(targetRoot, outDir);

const packageManager = args.packageManager ?? detectPackageManager(targetRoot);
const missingDeps = getMissingDependencies(packageJsonPath, REQUIRED_DEPS);

if (missingDeps.length > 0 && !skipInstall) {
  installDependencies(packageManager, missingDeps, targetRoot);
}

console.log("");
console.log("Open Shell UI installed.");
console.log(`- Components: ${relative(targetRoot, outDir)}`);
console.log(`- Import: ${toImportPath(args.outDir ?? DEFAULT_OUT_DIR)}`);
if (missingDeps.length > 0 && skipInstall) {
  console.log(`- Skipped dependency install. Add: ${missingDeps.join(" ")}`);
}
console.log("");
console.log("Next steps:");
console.log(`1. Import the token CSS once: import "${toImportPath(args.outDir ?? DEFAULT_OUT_DIR)}/tokens/codex-theme.css";`);
console.log(`2. Import components: import { AppShell, Sidebar, Composer } from "${toImportPath(args.outDir ?? DEFAULT_OUT_DIR)}";`);
console.log("3. Keep these copied files in your app and edit them like your own component system.");

function parseArgs(rawArgs) {
  const result = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--force") result.force = true;
    else if (arg === "--skip-install") result.skipInstall = true;
    else if (arg === "--target") result.target = readValue(rawArgs, ++index, arg);
    else if (arg === "--out-dir") result.outDir = readValue(rawArgs, ++index, arg);
    else if (arg === "--repo") result.repo = readValue(rawArgs, ++index, arg);
    else if (arg === "--ref") result.ref = readValue(rawArgs, ++index, arg);
    else if (arg === "--source") result.source = readValue(rawArgs, ++index, arg);
    else if (arg === "--package-manager") result.packageManager = readValue(rawArgs, ++index, arg);
    else fail(`Unknown option: ${arg}`);
  }

  return result;
}

function readValue(rawArgs, index, flag) {
  const value = rawArgs[index];
  if (value == null || value.startsWith("--")) fail(`Missing value for ${flag}.`);
  return value;
}

function resolveSourceRoot(options) {
  if (options.source != null) {
    return path.resolve(options.source);
  }

  const localRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  if (fs.existsSync(path.join(localRoot, "packages/ui/src/index.ts"))) {
    return localRoot;
  }

  return cloneFromGitHub(options.repo ?? DEFAULT_REPO, options.ref ?? DEFAULT_REF);
}

function cloneFromGitHub(repo, ref) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "open-shell-ui-"));
  const result = spawnSync(
    "git",
    ["clone", "--depth", "1", "--branch", ref, "--filter=blob:none", repo, tmpDir],
    { encoding: "utf8", stdio: "pipe" },
  );

  if (result.status !== 0) {
    fail(`Could not clone ${repo}#${ref}.\n${result.stderr || result.stdout}`);
  }

  return tmpDir;
}

function copyDirectory(from, to, { force: shouldForce }) {
  if (fs.existsSync(to) && shouldForce) {
    fs.rmSync(to, { force: true, recursive: true });
  }

  fs.mkdirSync(to, { recursive: true });

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const sourcePath = path.join(from, entry.name);
    const targetPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath, { force: false });
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function writeInstallNotes(targetRootPath, installedDir) {
  const notesPath = path.join(installedDir, "INSTALL.md");
  const importPath = toImportPath(path.relative(targetRootPath, installedDir));
  const content = `# Open Shell UI

These files were installed by \`scripts/install-open-shell-ui.mjs\`.

This is intentionally shadcn-style: the source is copied into your app, not imported from a published package.
You own these files now. Edit them, theme them, and wire them to your product data.

## Usage

\`\`\`tsx
import "${importPath}/tokens/codex-theme.css";
import { AppShell, Composer, Sidebar, ThreadSurface } from "${importPath}";
\`\`\`

## Required packages

${REQUIRED_DEPS.map((dep) => `- \`${dep}\``).join("\n")}

React and React DOM are expected to already exist in the target app.
`;

  fs.writeFileSync(notesPath, content);
}

function getMissingDependencies(packageJsonFile, deps) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf8"));
  const installed = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  };

  return deps.filter((dep) => installed[dep] == null);
}

function detectPackageManager(projectRoot) {
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(projectRoot, "bun.lockb")) || fs.existsSync(path.join(projectRoot, "bun.lock"))) return "bun";
  return "npm";
}

function installDependencies(packageManager, deps, cwd) {
  const command = getInstallCommand(packageManager, deps);
  console.log(`Installing dependencies with ${packageManager}: ${deps.join(" ")}`);

  const result = spawnSync(command.command, command.args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    fail(`Dependency install failed. Re-run with --skip-install and add manually: ${deps.join(" ")}`);
  }
}

function getInstallCommand(packageManager, deps) {
  if (packageManager === "pnpm") return { command: "pnpm", args: ["add", ...deps] };
  if (packageManager === "yarn") return { command: "yarn", args: ["add", ...deps] };
  if (packageManager === "bun") return { command: "bun", args: ["add", ...deps] };
  if (packageManager === "npm") return { command: "npm", args: ["install", ...deps] };
  fail(`Unsupported package manager: ${packageManager}`);
}

function assertDirectory(directory, label) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    fail(`${label} does not exist: ${directory}`);
  }
}

function relative(root, filePath) {
  return path.relative(root, filePath) || ".";
}

function toImportPath(filePath) {
  const normalized = filePath.replaceAll(path.sep, "/").replace(/^src\//, "@/");
  return normalized.startsWith(".") || normalized.startsWith("@/") ? normalized : `./${normalized}`;
}

function fail(message) {
  console.error(`open-shell-ui installer: ${message}`);
  process.exit(1);
}

function printHelp() {
  console.log(`Open Shell UI installer

Usage:
  node scripts/install-open-shell-ui.mjs [options]

Options:
  --target <dir>              Target project directory. Defaults to cwd.
  --out-dir <dir>             Component destination. Defaults to ${DEFAULT_OUT_DIR}.
  --source <dir>              Local open-shell repo root. Defaults to this repo when available.
  --repo <git-url>            GitHub repo to clone when no local source exists.
  --ref <branch-or-tag>       Git ref for GitHub install. Defaults to ${DEFAULT_REF}.
  --package-manager <pm>      npm, pnpm, yarn, or bun. Auto-detected by lockfile.
  --skip-install              Copy files but do not install Radix dependencies.
  --force                     Overwrite the destination directory.
  --help                      Show this help.

Examples:
  node scripts/install-open-shell-ui.mjs --target ../my-app
  node scripts/install-open-shell-ui.mjs --target ../my-app --out-dir src/components/ui/open-shell --force
  curl -fsSL https://raw.githubusercontent.com/AbhinavMishra32/open-shell/main/scripts/install-open-shell-ui.mjs | node - --target .
`);
}
