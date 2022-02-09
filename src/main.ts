import chalk from "chalk";
import cliSelect from "cli-select-2";
import { readFileSync } from "fs";
import Download from "./core/download";

async function main() {
  cliSelect({
    values: ["mp3", "mp4"],
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.green.underline(value);
      }
      return value;
    },
  })
    .then(async (v) => {
      const file = readFileSync("./links.txt", "utf8");
      const links: string[] = file.split("\n");

      if (v.value == "mp3") {
        for await (const link of links.map(async (e) => await Download.downloadMP3(e))) {
        }
      }

      if (v.value == "mp4") {
        for await (const link of links.map(async (e) => await Download.downloadMP4(e))) {
        }
      }
    })
    .catch((e) => {
      chalk.red("An Error occurred");
    });
}

main();
