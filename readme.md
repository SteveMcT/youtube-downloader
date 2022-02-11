# How to use me?

## Installation

You need to have ffmpeg installed in order to use this software. Download it from https://ffmpeg.org/download.html or

- MAC: brew install ffmpeg
- Linux: use your package manager
- Windows:
  1. Run Get-ExecutionPolicy. If it returns Restricted, then run Set-ExecutionPolicy AllSigned or Set-ExecutionPolicy Bypass -Scope Process
  2. Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1%27))
  3. choco install ffmpeg

- make sure you have node installed
- go to your command line
- run 'npm i'
- run 'npm start'

## Add Links

You can find a "links.txt" where you, as you might guess, can put your links in it.
Just add it line by line or if you want to download a Playlist, just select the first song, paste it in a new line and put "PL:" in front of the link.

## Start the download

Just open the tool and select if you want to download all links as mp3 or mp4 and let it do it's work.

## Keep in mind

The downloader DOES NOT have a 100% success rate when downloading data.
It's just a tool to help you gettings music.
