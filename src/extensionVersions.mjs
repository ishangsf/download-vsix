// IncludeVersions | IncludeFiles | IncludeCategoryAndTags |
// IncludeVersionProperties | IncludeAssetUri. Version properties contain
// Microsoft.VisualStudio.Code.PreRelease, the Marketplace release-channel flag.
export const galleryQueryFlags = 1 | 2 | 4 | 16 | 128;

export function normalizeVersions(versions = []) {
  return versions.map(version => ({
    ...version,
    isPrerelease: version.properties?.some(property =>
      property.key === 'Microsoft.VisualStudio.Code.PreRelease' && property.value === 'true'
    ) ?? false
  })).sort((a, b) => {
    const partsA = a.version.split('.').map(Number);
    const partsB = b.version.split('.').map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const difference = (partsB[i] || 0) - (partsA[i] || 0);
      if (difference) return difference;
    }
    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
  });
}

export function getUniqueVersions(versions = []) {
  const uniqueVersions = new Map();
  for (const version of versions) {
    if (!uniqueVersions.has(version.version)) {
      uniqueVersions.set(version.version, version);
    }
  }
  return Array.from(uniqueVersions.values());
}

// Input is the sorted list from normalizeVersions.
export function getDefaultVersion(versions = []) {
  return (versions.find(version => !version.isPrerelease) ?? versions[0])?.version ?? '';
}
