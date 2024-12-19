import { strictEqual } from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { Configuration } from "@yarnpkg/core";
import { displayDuplicates } from "../lib/displayDuplicates.js";
import { identifyDuplicates } from "../lib/identifyDuplicates.js";
import { parseYarnWhy } from "../lib/readAndParseYarnWhy.js";

const configuration = Configuration.create(process.cwd());
configuration.values.set("enableColors", false);

const loadAndAssert = (fileName, expected) => {
  const fileContent = fs.readFileSync(
    new URL(`./fixtures/${fileName}`, import.meta.url),
    "utf8",
  );
  const content = parseYarnWhy(fileContent);
  const duplicates = identifyDuplicates(content);
  const logs = [];
  displayDuplicates(duplicates, (log = "") => logs.push(log), configuration);
  strictEqual(logs.join("\n"), expected);
};

test("no duplicates", () => {
  loadAndAssert(
    "date-fns.txt",
    "Found 1 version:\n" +
      "\n" +
      "date-fns@npm:1.30.1\n" +
      "- @ornikar/learner-apps-shared@workspace:@ornikar/learner-apps-shared (date-fns@npm:1.30.1)\n" +
      "- @ornikar/learner-native-app@workspace:@ornikar/learner-native-app (date-fns@npm:1.30.1)\n" +
      "- @ornikar/learner-webapp@workspace:@ornikar/learner-webapp (date-fns@npm:1.30.1)\n" +
      "- date-fns-timezone@npm:0.1.4 (date-fns@npm:^1.29.0)\n" +
      "- listr-verbose-renderer@npm:0.5.0 (date-fns@npm:^1.27.2)\n",
  );
});

test("simple duplicates", () => {
  loadAndAssert(
    "type-fest.txt",
    "Found 14 versions:\n" +
      "\n" +
      "type-fest@npm:3.5.3\n" +
      "- @ornikar/api-helpers@npm:4.9.8 (type-fest@npm:^3.3.0)\n" +
      "- @ornikar/kitt-universal@npm:9.47.2 (type-fest@npm:^3.0.0)\n" +
      "- @ornikar/kitt@npm:34.6.4 (type-fest@npm:^3.0.0)\n" +
      "- @ornikar/react-forms@npm:13.4.12 (type-fest@npm:^3.3.0)\n" +
      "- @ornikar/react-header@npm:12.6.4 (type-fest@npm:^3.3.0)\n" +
      "- @ornikar/react-notification@npm:10.4.9 (type-fest@npm:^3.3.0)\n" +
      "- check-package-dependencies@npm:6.3.1 (type-fest@npm:^3.0.0)\n" +
      "\n" +
      "type-fest@npm:2.19.0\n" +
      "- @ornikar/learner-apps-shared@workspace:@ornikar/learner-apps-shared (type-fest@npm:2.19.0)\n" +
      "- @ornikar/learner-webapp@workspace:@ornikar/learner-webapp (type-fest@npm:2.19.0)\n" +
      "- @ornikar/react-apollo@npm:5.7.3 (type-fest@npm:^2.0.0)\n" +
      "- @ornikar/react-app-error-provider@npm:7.10.0 (type-fest@npm:^2.0.0)\n" +
      "- @ornikar/react-mixpanel@npm:1.1.2 (type-fest@npm:^2.0.0)\n" +
      "- @ornikar/webapp-configs@npm:4.2.3 (type-fest@npm:^2.0.0)\n" +
      "\n" +
      "type-fest@npm:1.4.0\n" +
      "- msw@npm:0.29.0 (type-fest@npm:^1.1.3)\n" +
      "\n" +
      "type-fest@npm:0.21.3\n" +
      "- ansi-escapes@npm:4.3.2 (type-fest@npm:^0.21.3)\n" +
      "\n" +
      "type-fest@npm:0.20.2\n" +
      "- boxen@npm:5.1.2 (type-fest@npm:^0.20.2)\n" +
      "- globals@npm:13.20.0 (type-fest@npm:^0.20.2)\n" +
      "\n" +
      "type-fest@npm:0.18.1\n" +
      "- meow@npm:8.1.2 (type-fest@npm:^0.18.0)\n" +
      "- meow@npm:9.0.0 (type-fest@npm:^0.18.0)\n" +
      "\n" +
      "type-fest@npm:0.16.0\n" +
      "- tempy@npm:0.7.1 (type-fest@npm:^0.16.0)\n" +
      "\n" +
      "type-fest@npm:0.13.1\n" +
      "- serialize-error@npm:7.0.1 (type-fest@npm:^0.13.1)\n" +
      "\n" +
      "type-fest@npm:0.12.0\n" +
      "- serialize-error@npm:6.0.0 (type-fest@npm:^0.12.0)\n" +
      "\n" +
      "type-fest@npm:0.8.1\n" +
      "- boxen@npm:4.2.0 (type-fest@npm:^0.8.1)\n" +
      "- read-pkg-up@npm:7.0.1 (type-fest@npm:^0.8.1)\n" +
      "\n" +
      "type-fest@npm:0.7.1\n" +
      "- stacktrace-parser@npm:0.1.10 (type-fest@npm:^0.7.1)\n" +
      "\n" +
      "type-fest@npm:0.6.0\n" +
      "- load-json-file@npm:6.2.0 (type-fest@npm:^0.6.0)\n" +
      "- read-pkg@npm:5.2.0 (type-fest@npm:^0.6.0)\n" +
      "\n" +
      "type-fest@npm:0.4.1\n" +
      "- write-pkg@npm:4.0.0 (type-fest@npm:^0.4.1)\n" +
      "\n" +
      "type-fest@npm:0.3.1\n" +
      "- load-json-file@npm:5.3.0 (type-fest@npm:^0.3.0)\n" +
      "- tempy@npm:0.3.0 (type-fest@npm:^0.3.1)\n",
  );
});

test("example with patch", () => {
  loadAndAssert(
    "native-base.txt",
    "Found 1 version:\n" +
      "\n" +
      "native-base@patch:native-base@npm%3A3.4.18#./.yarn/patches/native-base-npm-3.4.18-63dd34e5ad.patch::version=3.4.18&hash=f36c02&locator=%40ornikar%2Flearner-apps-monorepo%40workspace%3A.\n" +
      "- @ornikar/kitt-universal@npm:9.47.2 (native-base@patch:native-base@npm%3A3.4.18#./.yarn/patches/native-base-npm-3.4.18-63dd34e5ad.patch::locator=%40ornikar%2Flearner-apps-monorepo%40workspace%3A.)\n",
  );
});

test("complex duplicates", () => {
  loadAndAssert(
    "validators.txt",
    "Found 2 versions:\n" +
      "\n" +
      "@ornikar/validators@npm:7.3.0\n" +
      "- @ornikar/learner-apps-shared@workspace:@ornikar/learner-apps-shared (@ornikar/validators@npm:7.3.0)\n" +
      "- @ornikar/learner-native-app@workspace:@ornikar/learner-native-app (@ornikar/validators@npm:7.3.0)\n" +
      "- @ornikar/learner-webapp@workspace:@ornikar/learner-webapp (@ornikar/validators@npm:7.3.0)\n" +
      "- @ornikar/react-validators@npm:8.0.10 (@ornikar/validators@npm:^7.3.0)\n" +
      "\n" +
      "@ornikar/validators@npm:7.2.11\n" +
      "- @ornikar/react-forms-universal@npm:12.2.0 (@ornikar/validators@npm:^7.2.10)\n" +
      "- @ornikar/react-validators@npm:8.0.8 (@ornikar/validators@npm:^7.2.11)\n",
  );
});

test("virtual child", () => {
  loadAndAssert(
    "virtual-child.txt",
    "Found 2 versions:\n" +
      "\n" +
      "@storybook/api@npm:6.5.17-alpha.0\n" +
      "- @ornikar/kitt-monorepo@workspace:. (@storybook/api@npm:6.5.17-alpha.0 [c90c3])\n" +
      "- @storybook/addon-actions@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addon-backgrounds@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addon-controls@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addon-docs@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addon-essentials@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addon-measure@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addon-outline@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addon-toolbars@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addon-viewport@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/addons@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/builder-webpack4@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/builder-webpack5@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "- @storybook/ui@npm:6.5.17-alpha.0 (@storybook/api@npm:6.5.17-alpha.0)\n" +
      "\n" +
      "@storybook/api@npm:6.5.16\n" +
      "- @storybook/addons@npm:6.5.16 (@storybook/api@npm:6.5.16)\n" +
      "- @storybook/ui@npm:6.5.16 (@storybook/api@npm:6.5.16)\n",
  );
});

test("virtual only", () => {
  loadAndAssert(
    "virtual-only.txt",
    "Found 1 version:\n" +
      "\n" +
      "@ornikar/react-apollo@npm:5.17.1\n" +
      "- @ornikar/learner-apps-shared@workspace:@ornikar/learner-apps-shared (@ornikar/react-apollo@npm:5.17.1 [0be1b])\n" +
      "- @ornikar/learner-native-app@workspace:@ornikar/learner-native-app (@ornikar/react-apollo@npm:5.17.1 [74b4e])\n" +
      "- @ornikar/learner-webapp@workspace:@ornikar/learner-webapp (@ornikar/react-apollo@npm:5.17.1 [72efe])\n",
  );
});
