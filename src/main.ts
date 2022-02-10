import chalk from "chalk";
import { MultiBar } from "cli-progress";
import cliSelect from "cli-select-2";
import { readFileSync } from "fs";
import Download from "./core/download";
import Files from "./core/files";
import Links from "./core/links";

async function main() {
  console.log(chalk.blue("Welcome to the YouTube Downloader!"));
  console.log(chalk.blueBright("You need to have ffmpeg installed to use this tool."));
  console.log(chalk.blueBright("Look inside the guide to get more information."));

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

      if (v.value === "mp3") {
        // adding all links to an array
        let linksToDownload: string[] = await Links.getLinksToDownload(links);

        let activeDownloads = 0;
        let i = 0;

        setInterval(async () => {
          if (activeDownloads <= 20 && i < linksToDownload.length) {
            Download.downloadMP3(bar, linksToDownload[i]).finally(() => {
              console.log("Hello Finished World :3");
              activeDownloads--;

              if (i == linksToDownload.length) {
                finish();
                return;
              }
            });

            i++;
            activeDownloads++;
          }
        }, 140);
      } else if (v.value === "mp4") {
        for (const link of links) {
          Download.downloadMP4(bar, link);
        }
      }
    })
    .catch(() => {
      console.log(chalk.red("An Error occurred"));
    });
}

async function finish() {
  // console.clear();
  console.log(chalk.green("Finished downloading"));
  console.log(chalk.yellow("cleaning up..."));
  await Files.removeFilesWhichAreNotMP3();
  console.log(chalk.green("Done!"));

  process.exit(0);
}

main();
