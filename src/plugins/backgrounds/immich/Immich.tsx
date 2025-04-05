import React, { useState, useEffect, useRef } from "react";
import Backdrop from "../../../views/shared/Backdrop";
import "./Immich.sass";
import { Cache, defaultCache, Props } from "./types";

const getImageUrl = async (cache: Cache, assetId: string) => {
  const response = await fetch(
    `${cache.serverUrl}/api/assets/${assetId}/original`,
    {
      headers: {
        "X-Api-Key": cache.apiKey || "",
      },
    },
  );

  if (!response.ok) {
    console.error(`Failed to fetch image ${assetId}: `, response.statusText);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const Immich: React.FC<Props> = ({ cache = defaultCache, loader }) => {
  const didRun = useRef(false);
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    // prevent dupe call in dev (react strict mode)
    if (didRun.current) return;
    didRun.current = true;

    const fetchImage = async () => {
      const assetId = cache.assets?.length
        ? cache.assets[Math.floor(Math.random() * cache.assets?.length)]?.id
        : null;
      if (!assetId) {
        return;
      }

      const imageUrl = await getImageUrl(cache, assetId);
      setUrl(imageUrl);
    };

    if (cache.apiKey && cache.serverUrl && cache.selectedAlbumId) {
      loader.push();
      fetchImage().finally(() => loader.pop());
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  if (!url) return <div className="Image default fullscreen" />;

  return (
    <Backdrop
      className="Image fullscreen"
      style={{ backgroundImage: url ? `url(${url})` : undefined }}
    />
  );
};

export default Immich;
