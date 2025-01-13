// utils.ts

import * as mime from "mime-types";
import * as path from "path";

export function getMimeType(filename: string): string {
  const mimeType = mime.lookup(filename);
  if (mimeType) {
    return mimeType;
  }

  const extension = path.extname(filename).toLowerCase();
  const mimeMap: { [key: string]: string } = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".tiff": "image/tiff",
    ".bmp": "image/bmp",
  };

  return mimeMap[extension] || "application/octet-stream";
}
