import path from "path";

export const MAX_FILE_SIZE_TEXT = 5;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_TEXT * 1024 * 1024;
export const ALLOWED_AUDIO_TYPES = ["audio/mp3", "audio/mpeg", "audio/mp4", "audio/wav", "audio/x-m4a", "audio/m4a"]
export const UPLOAD_DIR = path.join(process.cwd(), process.env.ROOT_PATH ? process.env.ROOT_PATH : "public/uploads");
