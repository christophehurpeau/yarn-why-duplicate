import { structUtils } from '@yarnpkg/core';
import { compare as compareRange } from 'semver';

export const identifyDuplicates = (yarnWhyResult) => {
  const groupByVersions = new Map();

  for (const line of yarnWhyResult) {
    const parsedValue = structUtils.parseDescriptor(line.value);

    if (structUtils.isVirtualDescriptor(parsedValue)) {
      // when looking for duplicates, we don't want to look at virtual packages
      continue;
    }

    for (const [key, child] of Object.entries(line.children)) {
      let byVersion = groupByVersions.get(key);
      if (!byVersion) {
        const childDescriptor = structUtils.parseDescriptor(key);

        if (structUtils.isVirtualDescriptor(childDescriptor)) {
          // when looking for duplicates, we don't want to look at virtual packages
          continue;
        }

        byVersion = {
          descriptor: childDescriptor,
          sources: [],
        };
        groupByVersions.set(key, byVersion);
      }
      byVersion.sources.push({
        source: parsedValue, // source of the dependency
        descriptor: structUtils.parseDescriptor(child.descriptor), // value parsed from package.json eg date-fns@npm:^1.29.0
        locator: structUtils.parseLocator(child.locator), // value resolved by yarn eg date-fns@npm:1.30.1
      });
    }
  }

  const groups = [...groupByVersions.values()];
  groups.sort((a, b) => {
    const aRange = structUtils.parseRange(a.descriptor.range);
    const bRange = structUtils.parseRange(b.descriptor.range);

    try {
      return -compareRange(aRange.selector, bRange.selector);
    } catch {
      return 0;
    }
  });

  return groups;
};
