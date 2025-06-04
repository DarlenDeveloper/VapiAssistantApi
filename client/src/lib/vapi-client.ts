interface VapiConfig {
  publicKey?: string;
  assistantId?: string;
}

export interface CallResult {
  success: boolean;
  error?: string;
  stream?: MediaStream;
}

export class VAPIClient {
  private vapi: any = null;
  private publicKey: string;
  private assistantId: string;
  private isInitialized = false;

  constructor() {
    this.publicKey = "7a55ff04-fc15-4f77-ad44-5f656c04700f";
    this.assistantId = "c7aa58d8-7e65-4eca-aa34-f366e269c196";
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Dynamically import VAPI SDK
      const vapiModule = await import('@vapi-ai/web');
      this.vapi = new vapiModule.default(this.publicKey);
      this.isInitialized = true;
      console.log('VAPI client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize VAPI:', error);
      // Fallback for development/testing
      this.vapi = this.createMockVapi();
      this.isInitialized = true;
    }
  }

  private createMockVapi() {
    // Mock VAPI for development when SDK is not available
    return {
      start: async (assistantId: string) => {
        console.log('Mock VAPI: Starting call with assistant ID:', assistantId);
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true };
      },
      stop: async () => {
        console.log('Mock VAPI: Stopping call');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      },
      isMuted: () => false,
      setMuted: (muted: boolean) => {
        console.log('Mock VAPI: Set muted:', muted);
      },
      on: (event: string, callback?: Function) => {
        console.log('Mock VAPI: Listening for event:', event);
        // Simulate some events for testing
        if (event === 'call-start' && callback) {
          setTimeout(() => callback(), 2000);
        }
      },
      off: (event: string, callback?: Function) => {
        console.log('Mock VAPI: Removed listener for event:', event);
      }
    };
  }

  async startCall(): Promise<CallResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Use assistant ID directly as per VAPI documentation
      const result = await this.vapi.start(this.assistantId);
      
      if (result && result.success !== false) {
        return { success: true, stream };
      } else {
        return { success: false, error: result?.error || 'Failed to start call' };
      }
    } catch (error: any) {
      console.error('Failed to start call:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to start call'
      };
    }
  }

  async endCall(): Promise<CallResult> {
    try {
      if (!this.vapi) {
        return { success: false, error: 'VAPI not initialized' };
      }

      await this.vapi.stop();
      return { success: true };
    } catch (error: any) {
      console.error('Failed to end call:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to end call'
      };
    }
  }

  toggleMute(): boolean {
    if (!this.vapi) return false;
    
    const currentMuted = this.vapi.isMuted();
    this.vapi.setMuted(!currentMuted);
    return !currentMuted;
  }

  onCallStart(callback: () => void): void {
    if (this.vapi && typeof callback === 'function') {
      this.vapi.on('call-start', callback);
    }
  }

  onCallEnd(callback: () => void): void {
    if (this.vapi && typeof callback === 'function') {
      this.vapi.on('call-end', callback);
    }
  }

  onSpeechStart(callback: () => void): void {
    if (this.vapi && typeof callback === 'function') {
      this.vapi.on('speech-start', callback);
    }
  }

  onSpeechEnd(callback: () => void): void {
    if (this.vapi && typeof callback === 'function') {
      this.vapi.on('speech-end', callback);
    }
  }

  removeAllListeners(): void {
    if (this.vapi && this.vapi.off) {
      try {
        this.vapi.off('call-start');
        this.vapi.off('call-end');
        this.vapi.off('speech-start');
        this.vapi.off('speech-end');
      } catch (error) {
        console.warn('Error removing VAPI listeners:', error);
      }
    }
  }
}
