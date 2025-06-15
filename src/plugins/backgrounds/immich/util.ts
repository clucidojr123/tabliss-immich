export const fetchAssetsInAlbum = async (serverUrl: string, apiKey: string, albumId: string) => {
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

    return normalizedAssets;
};