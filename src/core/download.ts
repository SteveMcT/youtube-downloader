import { MultiBar } from "cli-progress";
import ffmpeg from "ffmpeg";
import Downloader from "nodejs-file-downloader";
import { default as youtubedl, default as youtubeDlExec } from "youtube-dl-exec";
import ytpl from "ytpl";
import Files from "./files";

class Download {
  OUTPUTSTRINGLENGTH: number = 0;

  public async downloadMP3(bar: MultiBar, link: string) {
    return new Promise((res, rej) => {
      if (link === undefined) return;

      // get mp3 from youtube and download
      youtubeDlExec(link, {
        ffmpegLocation: "node_modules/ffmpeg",
        dumpSingleJson: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        referer: "https://youtube.com",
      }).then(async (output) => {
        let goahead = true;

        for (let i = output.formats.length - 1; i >= 0; i--) {
          const element = output.formats[i];

          if (element.acodec === "opus" && element.filesize && goahead) {
            goahead = false;

            const barItem = bar.create(element.filesize, 0);
            const name = output.title.replace(/ /g, "-");

            // print current status of the download in console
            const int = setInterval(() => {
              barItem.update(Files.getFilesize(name + ".webm.download"));
            }, 100);

            // download video
            await this.download(element.url, name, ".webm");

            clearInterval(int);
            barItem.update(element.filesize);

            this.convertToMP3(name);

            res(true);
          }
        }
      });
    });
  }

  public async downloadMP4(bar: MultiBar, link: string) {
    if (link === undefined) return;

    // initialize Downloader
    youtubedl(link, {
      ffmpegLocation: "node_modules/ffmpeg",
      dumpSingleJson: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      referer: "https://youtube.com",
    }).then(async (output) => {
      let goahead = true;
      output.formats.forEach(async (element) => {
        if (element.acodec === "mp4a.40.2" && element.filesize && goahead) {
          goahead = false;
          const barItem = bar.create(element.filesize, 0);
          const name = output.title;

          // print current status of the download in console
          const int = setInterval(() => {
            barItem.update(Files.getFilesize(name + ".mp4.download"));
          }, 100);

          // download video
          await this.download(element.url, name, ".mp4");

          clearInterval(int);
          barItem.update(element.filesize);

          return;
        }
      });
    });
  }

  public async getLinksFromPlaylist(playlistID: string) {
    const links = await ytpl(playlistID);
    let urls: string[] = [];
    links.items.forEach((item) => {
      urls.push(item.url);
    });
    return urls;
  }

  private async download(url: string, name: string, type: string) {
    const downloader = new Downloader({
      url: url,
      directory: "downloads",
      fileName: name + type,
    });

    await downloader.download();
  }

  public convertToMP3(name: string) {
    const process = new ffmpeg("downloads/" + name + ".webm");

    process
      .then((converter) => {
        converter.fnExtractSoundToMP3("downloads/" + name + ".mp3", (err) => {
          return;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new Download();
