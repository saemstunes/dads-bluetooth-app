
export interface MediaMetadata {
  title: string;
  artist: string;
  album: string;
  artwork: string;
}

export type PlaybackState = 'playing' | 'paused' | 'stopped' | 'buffering';

class MediaSessionService {
  private static instance: MediaSessionService;
  private mediaSession: any = null;

  static getInstance(): MediaSessionService {
    if (!MediaSessionService.instance) {
      MediaSessionService.instance = new MediaSessionService();
    }
    return MediaSessionService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Check if we're in Capacitor environment
      if ((window as any).Capacitor) {
        // In a real implementation, this would use a Capacitor plugin
        // to create a native MediaSession
        console.log('Initializing native MediaSession');
        this.mediaSession = {
          // Mock MediaSession for development
          setMetadata: (metadata: MediaMetadata) => {
            console.log('Setting metadata:', metadata);
          },
          setPlaybackState: (state: PlaybackState) => {
            console.log('Setting playback state:', state);
          }
        };
      } else {
        // Web MediaSession API
        if ('mediaSession' in navigator) {
          this.mediaSession = navigator.mediaSession;
          this.setupMediaSessionHandlers();
        }
      }
    } catch (error) {
      console.error('Failed to initialize MediaSession:', error);
    }
  }

  private setupMediaSessionHandlers(): void {
    if (!this.mediaSession) return;

    this.mediaSession.setActionHandler('play', () => {
      console.log('Media session play action');
      // Emit play event to app
    });

    this.mediaSession.setActionHandler('pause', () => {
      console.log('Media session pause action');
      // Emit pause event to app
    });

    this.mediaSession.setActionHandler('previoustrack', () => {
      console.log('Media session previous track action');
      // Emit previous event to app
    });

    this.mediaSession.setActionHandler('nexttrack', () => {
      console.log('Media session next track action');
      // Emit next event to app
    });
  }

  updateMetadata(metadata: MediaMetadata): void {
    if (!this.mediaSession) {
      this.initialize();
    }

    try {
      if (this.mediaSession?.setMetadata) {
        this.mediaSession.setMetadata(metadata);
      } else if ((window as any).navigator?.mediaSession) {
        (window as any).navigator.mediaSession.metadata = new MediaMetadata({
          title: metadata.title,
          artist: metadata.artist,
          album: metadata.album,
          artwork: metadata.artwork ? [{ src: metadata.artwork }] : []
        });
      }
    } catch (error) {
      console.error('Failed to update metadata:', error);
    }
  }

  updatePlaybackState(state: PlaybackState): void {
    if (!this.mediaSession) {
      this.initialize();
    }

    try {
      if (this.mediaSession?.setPlaybackState) {
        this.mediaSession.setPlaybackState(state);
      } else if ((window as any).navigator?.mediaSession) {
        (window as any).navigator.mediaSession.playbackState = state;
      }
    } catch (error) {
      console.error('Failed to update playback state:', error);
    }
  }
}

export default MediaSessionService;
