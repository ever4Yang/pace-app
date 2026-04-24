import { useEffect, useState } from 'react';

import * as FileSystem from 'expo-file-system/legacy';

type StyleLayer = {
  layout?: Record<string, unknown>;
  [key: string]: unknown;
};

type MapStyle = {
  layers: StyleLayer[];
  [key: string]: unknown;
};

function localizeStyle(style: MapStyle, locale: string): MapStyle {
  const localNameProp = `name:${locale}`;
  return {
    ...style,
    layers: style.layers.map((layer) => {
      if (!layer.layout?.['text-field']) return layer;
      return {
        ...layer,
        layout: {
          ...layer.layout,
          'text-field': ['coalesce', ['get', localNameProp], ['get', 'name']],
        },
      };
    }),
  };
}

// Module-level cache so multiple components share the same result
const styleFileCache = new Map<string, string>();

export default function useLocalizedMapStyle(baseUrl: string, locale: string): string {
  const cacheKey = `${baseUrl}:${locale}`;

  const [styleUrl, setStyleUrl] = useState<string>(
    () => styleFileCache.get(cacheKey) ?? baseUrl,
  );

  useEffect(() => {
    if (locale === 'en') {
      setStyleUrl(baseUrl);
      return;
    }

    if (styleFileCache.has(cacheKey)) {
      setStyleUrl(styleFileCache.get(cacheKey)!);
      return;
    }

    if (!FileSystem.cacheDirectory) {
      return;
    }

    const urlSlug = baseUrl.includes('dark') ? 'dark' : 'light';
    const filePath = `${FileSystem.cacheDirectory}maptiler-${urlSlug}-${locale}.json`;

    fetch(baseUrl)
      .then((r) => r.json() as Promise<MapStyle>)
      .then((style) => {
        const localized = localizeStyle(style, locale);
        return FileSystem.writeAsStringAsync(filePath, JSON.stringify(localized));
      })
      .then(() => {
        styleFileCache.set(cacheKey, filePath);
        setStyleUrl(filePath);
      })
      .catch(() => {
        setStyleUrl(baseUrl);
      });
  }, [baseUrl, locale, cacheKey]);

  return styleUrl;
}
