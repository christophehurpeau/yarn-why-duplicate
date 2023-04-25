import { structUtils } from '@yarnpkg/core';
import { compare as compareRange } from 'semver';

export const identifyDuplicates = (yarnWhyResult) => {
  const groupByVersions = new Map();

  for (const line of yarnWhyResult) {
    const descriptor = structUtils.parseDescriptor(line.value);
    const devirtualizedDescriptor = structUtils.isVirtualDescriptor(descriptor)
      ? structUtils.devirtualizeDescriptor(descriptor)
      : descriptor;

    for (const [key, child] of Object.entries(line.children)) {
      const childDescriptor = structUtils.parseDescriptor(key);
      const devirtualizedChildDescriptor = structUtils.isVirtualDescriptor(
        childDescriptor,
      )
        ? structUtils.devirtualizeDescriptor(childDescriptor)
        : childDescriptor;

      let byVersion = groupByVersions.get(
        devirtualizedChildDescriptor.descriptorHash,
      );
      if (!byVersion) {
        byVersion = {
          descriptor: devirtualizedChildDescriptor,
          sources: new Map(),
        };
        groupByVersions.set(
          devirtualizedChildDescriptor.descriptorHash,
          byVersion,
        );
      }

      if (!byVersion.sources.has(devirtualizedDescriptor.descriptorHash)) {
        byVersion.sources.set(devirtualizedDescriptor.descriptorHash, {
          source: devirtualizedDescriptor, // source of the dependency
          descriptor: structUtils.parseDescriptor(child.descriptor), // value parsed from package.json eg date-fns@npm:^1.29.0
          locator: structUtils.parseLocator(child.locator), // value resolved by yarn eg date-fns@npm:1.30.1
        });
      }
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
