import { statSync } from "fs";

export default class Files {
  static getFilesize(fileName: string): number {
    try {
      var file = statSync("downloads/" + fileName);
      return file.size;
    } catch (e) {
      return -1;
    }
  }
}
