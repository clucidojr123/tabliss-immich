import { API } from "../../types";

export type Data = {};

export type Cache = {
    serverUrl?: string;
    apiKey?: string;
    selectedAlbumId?: string;
    assets?: any[];
    refreshedAt?: Date;
};

export type Props = API<Data, Cache>;

export const defaultCache: Cache = {};
