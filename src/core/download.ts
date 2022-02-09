import { MultiBar } from "cli-progress";
import ffmpeg from "ffmpeg";
import Downloader from "nodejs-file-downloader";
import { default as youtubedl, default as youtubeDlExec } from "youtube-dl-exec";
import Files from "./files";

class Download {
  OUTPUTSTRINGLENGTH: number = 0;

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
        if (element.acodec == "mp4a.40.2" && element.filesize && goahead) {
          goahead = false;
          const barItem = bar.create(element.filesize, 0);
          const name = output.title;

          // print current status of the download in console
          const int = setInterval(() => {
            barItem.update(Files.getFilesize(name + ".mp4.download"));
          }, 100);

          // download video
          const downloader = new Downloader({
            url: element.url,
            directory: "downloads",
            fileName: name + ".mp4",
          });
          await downloader.download();
          clearInterval(int);
          barItem.update(element.filesize);

          return;
        }
      });
    });
  }

  public async downloadMP3(bar: MultiBar, link: string) {
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

      // create reverse foreach
      for (let i = output.formats.length - 1; i >= 0; i--) {
        const element = output.formats[i];
        if (element.acodec == "opus" && element.filesize && goahead) {
          goahead = false;

          const barItem = bar.create(element.filesize, 0);
          const name = output.title.replace(" ", "-");

          // print current status of the download in console
          const int = setInterval(() => {
            barItem.update(Files.getFilesize(name + ".webm.download"));
          }, 100);

          // download video
          const downloader = new Downloader({
            url: element.url,
            directory: "downloads",
            fileName: name + ".webm",
          });

          await downloader.download();
          clearInterval(int);
          barItem.update(element.filesize);

          // use ffmpeg to convert webm to mp3
          const process = new ffmpeg("downloads/" + name + ".webm");

          process.then((converter) => {
            console.log("Start converting ", name);

            converter.fnExtractSoundToMP3("downloads/" + name + ".mp3", (err) => {
              console.log(name + err ? "was not converted" : "was converted");
              console.log(err);
              return;
            });

            // converter
            //   .setAudioCodec("libfaac")
            //   .setAudioBitRate(128)
            //   .setAudioChannels(2)
            //   .setVideoFormat("mp3")
            //   .save("downloads/" + name + ".mp3"
          });

          return;
        }
      }
    });
  }
}

export default new Download();
