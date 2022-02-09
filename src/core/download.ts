import chalk from "chalk";
import Downloader from "nodejs-file-downloader";
import youtubedl from "youtube-dl-exec";
import Files from "./files";

class Download {
  OUTPUTSTRINGLENGTH: number = 0;

  public async downloadMP4(link: string) {
    if (link === undefined) return;

    console.log(chalk.green("starting downloading " + link));

    // initialize Downloader
    youtubedl(link, {
      ffmpegLocation: "node_modules/ffmpeg",
      dumpSingleJson: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      referer: "https://youtube.com",
    }).then(async (output) => {
      const name = output.title;

      // print current status of the download in console
      const filesize = output.formats[output.formats.length - 1].filesize;
      setInterval(() => {
        this.syncProgress(filesize, Files.getFilesize(name + ".mp4.download"));
      }, 100);

      // download video
      const downloader = new Downloader({
        url: output.formats[output.formats.length - 1].url,
        directory: "/downloads",
        fileName: name + ".mp4",
      });
      await downloader.download();

      console.log(name + " Done");
      return;
    });
  }

  public async downloadMP3(link: string) {
    if (link === undefined) return;

    // console.log(chalk.green("starting downloading " + link));

    // ytdl(link).pipe(createWriteStream("../../downloads/" + link.split("=")[1] + ".mp3"));

    // ytdl(link).then(async (output) => {
    //   console.log(chalk.green("Downloaded ", output.title));

    // })

    youtubedl(link, {
      downloadArchive: "/downloads/",
      output: "/downloads/" + link,
    }).then(async (output) => {
      console.log(output);
    });
  }

  private async syncProgress(currentSize: number, maxSize: number) {
    let counter = this.OUTPUTSTRINGLENGTH;

    while (counter >= 0) {
      process.stdout.write("\b");
      counter--;
    }

    const str = maxSize === -1 ? "Starting..." : currentSize + " " + maxSize + " " + Math.round((maxSize / currentSize) * 100) + "%";
    this.OUTPUTSTRINGLENGTH = str.length;

    process.stdout.write(str);
  }
}

export default new Download();
