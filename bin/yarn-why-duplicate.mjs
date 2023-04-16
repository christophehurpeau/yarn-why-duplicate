#!/usr/bin/env node

import { displayDuplicates } from '../lib/displayDuplicates.js';
import { identifyDuplicates } from '../lib/identifyDuplicates.js';
import { readAndParseYarnWhy } from '../lib/readAndParseYarnWhy.js';

const pkgName = process.argv.slice(2)[0];

const yarnWhyResult = readAndParseYarnWhy(pkgName);

for (const line of yarnWhyResult) {
  if (line.type === 'error') {
    console.error(`yarn error: ${line.data}`);
    process.exit(1);
  } else if (line.type === 'step') {
    console.error('yarn 1 is not supported, use yarn berry (>=2)');
    process.exit(1);
  }
}

const groupByVersions = identifyDuplicates(yarnWhyResult);
displayDuplicates(groupByVersions);
