import download from "./download";

export default class Links {
  public static async getLinksToDownload(links: string[]) {
    let linksToDownload: string[] = [];

    for (let link of links) {
      if (link.slice(0, 3) === "PL:") {
        const l = link.split("PL:")[1];
        const playlist = await download.getLinksFromPlaylist(l);
        linksToDownload.push(...playlist);
      } else {
        linksToDownload.push(link);
      }
    }
    linksToDownload = linksToDownload.map((link) => link.split("&list")[0]);

    return linksToDownload;
  }
}
