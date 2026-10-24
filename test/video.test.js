import { describe, expect, it } from "vitest";
import { isVideoFile } from "../dist/afrigov.js";

describe("isVideoFile", () => {
  it.each(["video.mp4", "video.webm", "video.ogv", "video.ogg", "video.m4v", "video.mov"])(
    "recognises direct video files: %s",
    (src) => {
      expect(isVideoFile(src)).toBe(true);
    },
  );

  it("recognises a video extension before a query or fragment", () => {
    expect(isVideoFile("/media/intro.MP4?download=1")).toBe(true);
    expect(isVideoFile("/media/intro.webm#player")).toBe(true);
  });

  it("does not mistake embedded player URLs or unrelated files for video files", () => {
    expect(isVideoFile("https://www.youtube-nocookie.com/embed/VIDEO_ID")).toBe(false);
    expect(isVideoFile("/media/video.mp4.txt")).toBe(false);
    expect(isVideoFile("/media/poster.jpg")).toBe(false);
  });
});
