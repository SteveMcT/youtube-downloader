import ffmpeg from "ffmpeg";
import { statSync, unlinkSync } from "fs";

export default class Files {
  public static getFilesize(fileName: string): number {
    try {
      var file = statSync("downloads/" + fileName);
      return file.size;
    } catch (e) {
      return -1;
    }
  }

  public static convertToMP3(name: string): Promise<boolean> {
    return new Promise((res) => {
      const process = new ffmpeg("downloads/" + name + ".webm");

      process.then((converter) => {
        converter.fnExtractSoundToMP3("downloads/" + name + ".mp3", (err) => {
          if (err) console.log(err);
          res(true);
        });
      });
    });
  }

  public static removeFile(name: string) {
    try {
      name += ".webm";
      var file = statSync("downloads/" + name);
      if (file.size > 0) {
        unlinkSync("downloads/" + name);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
