import React, { useState, useCallback } from "react";
import "./ImmichSettings.sass";
import { defaultCache, Props } from "./types";

interface ImmichAlbum {
  id: string;
  albumName: string;
  assetCount: number;
}

const ImmichSettings: React.FC<Props> = ({
  cache = defaultCache,
  setCache,
  loader,
}) => {
  const [apiKey, setApiKey] = useState<string>(cache.apiKey || "");
  const [serverUrl, setServerUrl] = useState<string>(cache.serverUrl || "");
  const [albums, setAlbums] = useState<ImmichAlbum[]>([]);

  const fetchAlbums = useCallback(async () => {
    loader.push();
    try {
      // TODO: get shared albums as well
      const response = await fetch(`${serverUrl}/api/albums`, {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }

      const data = await response.json();
      setAlbums(data);
      setCache({ ...cache, serverUrl, apiKey });
    } catch (error) {
      console.error("Error fetching albums: ", error);
    }
    loader.pop();
  }, [serverUrl, apiKey, loader]);

  const fetchAssetsInAlbum = useCallback(
    async (albumId: string) => {
      loader.push();
      try {
        const response = await fetch(
          `${serverUrl}/api/albums/${albumId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": apiKey,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }

        const { assets } = await response.json();
        const normalizedAssets = assets
          ?.filter((a: Record<string, any>) => a.type === "IMAGE")
          .map((a: Record<string, any>) => ({
            id: a.id,
          }));

        setCache({ ...cache, assets: normalizedAssets });
      } catch (error) {
        console.error("Error fetching assets: ", error);
      }
      loader.pop();
    },
    [serverUrl, apiKey],
  );

  return (
    <div className="ImmichSettings">
      <div>
        <label htmlFor="serverUrl">Server URL</label>
        <input
          id="serverUrl"
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="apiKey">API Key</label>
        <input
          autoComplete="off"
          id="apiKey"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <button onClick={() => fetchAlbums()}>Fetch Albums</button>
      {albums.length > 0 ? (
        <select
          name="selectedAlbumId"
          id="selectedAlbumId"
          value={cache.selectedAlbumId}
          onChange={(e) => {
            fetchAssetsInAlbum(e.target.value);
            setCache({ ...cache, selectedAlbumId: e.target.value });
          }}
        >
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.albumName} ({album.assetCount} assets)
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
};

export default ImmichSettings;
