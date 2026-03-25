export type SpotifyNowPlayingApiResponse =
    | { configured: false }
    | { configured: true; playing: false }
    | {
          configured: true;
          playing: true;
          track: {
              id: string;
              name: string;
              artistLine: string;
              albumArtUrl: string;
              trackUrl: string;
          };
      };
