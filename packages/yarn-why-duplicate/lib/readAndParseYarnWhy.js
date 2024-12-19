import { spawnSync } from "node:child_process";

export const parseYarnWhy = (content) => {
  return content
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
};

export const readAndParseYarnWhy = (pkgName) => {
  const { stdout, stderr } = spawnSync("yarn", ["why", pkgName, "--json"], {
    encoding: "utf8",
    stdio: "pipe",
    pwd: process.cwd(),
  });
  if (stderr) {
    try {
      return parseYarnWhy(stderr);
    } catch {
      throw new Error(`yarn failed: ${stderr}`);
    }
  }
  return parseYarnWhy(stdout);
};
