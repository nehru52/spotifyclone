import { LangAudioFiles } from "../../src/types";

export type TrackModel = {
  id: string;
  title: string;
  subtitle: string;
  imageURL?: string;
  isSaved?: boolean;
  isDownloaded?: boolean;
  isPlaying?: boolean;
  explicit?: boolean;
  audioUrl?: string;
  audioFiles?: LangAudioFiles;
  description?: string;
  kidsMyth?: string;
  tips?: string[];
};
