import { describe, it, expect } from "bun:test";
import { compressImageFile } from "../app/utils/image";

describe("compressImageFile", () => {
  it("should safely return the original file if non-image format is passed", async () => {
    const textBlob = new Blob(["hello world"], { type: "text/plain" });
    const textFile = new File([textBlob], "sample.txt", { type: "text/plain" });

    const result = await compressImageFile(textFile);
    expect(result).toBe(textFile);
  });

  it("should safely return the file if running in non-DOM/SSR environment", async () => {
    const dummyBlob = new Blob(["fake-image-bytes"], { type: "image/jpeg" });
    const dummyFile = new File([dummyBlob], "photo.jpg", { type: "image/jpeg" });

    const result = await compressImageFile(dummyFile);
    expect(result.name).toBe("photo.jpg");
  });
});
