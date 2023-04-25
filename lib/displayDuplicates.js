import { structUtils, Configuration } from '@yarnpkg/core';

export const displayDuplicates = (
  groupByVersions,
  log = console.log,
  configuration = Configuration.create(process.cwd()),
) => {
  if (groupByVersions.length === 0) {
    log('No version found');
    return;
  }

  log(
    `Found ${groupByVersions.length} version${
      groupByVersions.length === 1 ? '' : 's'
    }:`,
  );
  log();

  for (const { descriptor, sources } of groupByVersions) {
    log(structUtils.prettyDescriptor(configuration, descriptor));
    for (const { source, descriptor } of sources.values()) {
      log(
        `- ${structUtils.prettyDescriptor(
          configuration,
          source,
        )} (${structUtils.prettyDescriptor(configuration, descriptor)})`,
      ); // TODO prettyDescriptor from structUtils
    }
    log();
  }
};
