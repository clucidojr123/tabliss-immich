import { Config } from "../../types";
import Immich from "./Immich";
import ImmichSettings from "./ImmichSettings";

const config: Config = {
  key: "background/immich",
  name: "Immich Album",
  description: "Use an Immich album as the source of rotating background wallpapers.",
  dashboardComponent: Immich,
  settingsComponent: ImmichSettings,
  supportsBackdrop: true,
};

export default config;
