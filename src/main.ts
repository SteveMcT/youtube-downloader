import chalk from "chalk";
import cliSelect from "cli-select-2";
import { readFileSync } from "fs";
import Download from "./core/download";

async function main() {
  cliSelect({
    values: ["mp3", "mp4"],
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.underline(value);
      }
      return value;
    },
  }).then(async (v) => {
    console.log(v);

    const file = readFileSync("./links.txt", "utf8");
    const links: string[] = file.split("\n");

    for await (const link of links.map(async (e) => await Download.download(e))) {
      console.log(link);
    }
  });
}

main();
