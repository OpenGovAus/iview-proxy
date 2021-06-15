# iview-proxy

A proxy web app that serves ABC iView content outside of the iView webplayer, avoiding intrusive data harvesting.

## Purpose

This project has two main goals:

- Avoid as much account authentication as possible to watch ABC iView content,

- Avoid providing as much data as possible to iView to stop data harvesting.

Despite being aptly warned, the ABC has taken a forceful approach to collecting ABC iView data. This app seeks to remedy this by obtaining iView medias' `m3u8` playlists, and isolating them to a locked-down media player, completely free of any analytics tracking.

## Setup

The actual app is contained in the `src` directory.

1. Install required dependencies

    ```sh
    npm install
    ```

2. Start the server

    ```sh
    npm start
    ```

    or 

    ```sh
    node .
    ```

3. Navigate to `localhost:1984` in a browser to access the app.