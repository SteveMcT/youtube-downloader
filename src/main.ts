import chalk from "chalk";
import { MultiBar } from "cli-progress";
import cliSelect from "cli-select-2";
import { readFileSync } from "fs";
import Download from "./core/download";

async function main() {
  console.log(chalk.blue("Welcome to the YouTube Downloader!"));
  console.log(chalk.blueBright("You need to have ffmpeg installed to use this tool."));
  console.log(chalk.blueBright("On Windows you can install ffmpeg from https://ffmpeg.zeranoe.com/builds/"));
  console.log(chalk.blueBright("On Linux you can install ffmpeg from https://ffmpeg.org/download.html"));
  console.log(chalk.blueBright("On MacOS you can install ffmpeg from https://ffmpeg.zeranoe.com/builds/"));

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
      // read file
      const file = readFileSync("./links.txt", "utf8");
      const links: string[] = file.split("\n");

      // create console output
      const bar = new MultiBar({
        format: "Downloading [{bar}] {percentage}% | {value}/{total}",
        barCompleteChar: "=",
        barIncompleteChar: " ",
        hideCursor: true,
        clearOnComplete: false,
        stopOnComplete: true,
      });

      if (v.value == "mp3") {
        for (const link of links) {
          Download.downloadMP3(bar, link);
        }
      }

      if (v.value == "mp4") {
        for (const link of links) {
          Download.downloadMP4(bar, link);
        }
      }
    })
    .catch(() => {
      console.log(chalk.red("An Error occurred"));
    });
}

main();
