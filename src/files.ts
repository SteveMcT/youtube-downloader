import fs from "fs";

export default class Files {
  static getFilesize(fileName: string): number {
    try {
      var file = fs.statSync("/downloads/" + fileName);
      return file.size;
    } catch (e) {
      return -1;
    }
  }
}
