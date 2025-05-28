
import { ScriptLoader } from '@/utils/scriptLoader';

declare global {
  interface Window {
    Vapi: any;
  }
}

export class VapiVoiceChat extends HTMLElement {
  private vapi: any = null;
  private isConnected = false;
  private isConnecting = false;
  private shadow: ShadowRoot;
  private button: HTMLButtonElement | null = null;
  private statusText: HTMLElement | null = null;
  private transcriptDiv: HTMLElement | null = null;
  private responseDiv: HTMLElement | null = null;
  
  static get observedAttributes() {
    return ['public-key', 'assistant-id', 'disabled'];
  }
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
    this.loadVapiSDK();
  }
  
  private async loadVapiSDK() {
    const cdnSources = [
      'https://unpkg.com/@vapi-ai/web-sdk@latest/dist/index.js',
      'https://cdn.jsdelivr.net/npm/@vapi-ai/web-sdk@latest/dist/index.js',
      'https://cdn.jsdelivr.net/npm/@vapi-ai/web-sdk@0.5.0/dist/index.js'
    ];
    
    try {
      this.updateStatus('Loading voice assistant...');
      await ScriptLoader.loadScript(cdnSources);
      
      if (!window.Vapi) {
        throw new Error('Vapi SDK not available after loading');
      }
      
      this.initializeVapi();
    } catch (error) {
      console.error('Failed to load Vapi SDK:', error);
      this.updateStatus('Voice assistant unavailable');
      this.dispatchEvent(new CustomEvent('vapi-error', { 
        detail: { error: error.message } 
      }));
    }
  }
  
  private initializeVapi() {
    const publicKey = this.getAttribute('public-key');
    if (!publicKey) {
      console.error('No public key provided');
      return;
    }
    
    try {
      this.vapi = new window.Vapi(publicKey);
      this.setupEventListeners();
      this.updateStatus('Tap to connect');
      this.enableButton();
      
      this.dispatchEvent(new CustomEvent('vapi-ready'));
    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
      this.updateStatus('Initialization failed');
    }
  }
  
  private setupEventListeners() {
    if (!this.vapi) return;
    
    this.vapi.on('call-start', () => {
      this.isConnected = true;
      this.isConnecting = false;
      this.updateStatus('Connected - Speak now');
      this.updateButtonState();
      this.dispatchEvent(new CustomEvent('vapi-call-start'));
    });
    
    this.vapi.on('call-end', () => {
      this.isConnected = false;
      this.isConnecting = false;
      this.updateStatus('Tap to connect');
      this.updateButtonState();
      this.dispatchEvent(new CustomEvent('vapi-call-end'));
    });
    
    this.vapi.on('speech-start', () => {
      this.updateTranscript('Listening...');
    });
    
    this.vapi.on('message', (message: any) => {
      if (message.type === 'transcript') {
        if (message.transcriptType === 'final') {
          this.updateTranscript(message.transcript);
          this.dispatchEvent(new CustomEvent('vapi-transcript', {
            detail: { transcript: message.transcript }
          }));
        }
      }
    });
    
    this.vapi.on('error', (error: any) => {
      this.isConnected = false;
      this.isConnecting = false;
      this.updateStatus('Connection error');
      this.updateButtonState();
      this.dispatchEvent(new CustomEvent('vapi-error', { detail: error }));
    });
  }
  
  private async toggleConnection() {
    if (!this.vapi) return;
    
    const assistantId = this.getAttribute('assistant-id');
    if (!assistantId) {
      console.error('No assistant ID provided');
      return;
    }
    
    if (this.isConnected) {
      this.vapi.stop();
    } else {
      this.isConnecting = true;
      this.updateStatus('Connecting...');
      this.updateButtonState();
      
      try {
        await this.vapi.start(assistantId);
      } catch (error) {
        console.error('Failed to start call:', error);
        this.isConnecting = false;
        this.updateStatus('Connection failed');
        this.updateButtonState();
      }
    }
  }
  
  private render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1rem;
          color: white;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .voice-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: none;
          background: #fff;
          color: #667eea;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        .voice-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(0,0,0,0.3);
        }
        
        .voice-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .voice-button.connected {
          background: #ef4444;
          color: white;
          animation: pulse 2s infinite;
        }
        
        .voice-button.connecting {
          animation: spin 1s linear infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .status {
          font-size: 0.9rem;
          text-align: center;
          opacity: 0.9;
        }
        
        .transcript, .response {
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
          width: 100%;
          min-height: 2rem;
          backdrop-filter: blur(10px);
        }
        
        .transcript {
          border-left: 3px solid #10b981;
        }
        
        .response {
          border-left: 3px solid #3b82f6;
        }
        
        .hidden {
          display: none;
        }
      </style>
      
      <div class="container">
        <button class="voice-button" disabled>
          🎤
        </button>
        <div class="status">Loading...</div>
        <div class="transcript hidden"></div>
        <div class="response hidden"></div>
      </div>
    `;
    
    this.button = this.shadow.querySelector('.voice-button');
    this.statusText = this.shadow.querySelector('.status');
    this.transcriptDiv = this.shadow.querySelector('.transcript');
    this.responseDiv = this.shadow.querySelector('.response');
    
    this.button?.addEventListener('click', () => this.toggleConnection());
  }
  
  private updateStatus(status: string) {
    if (this.statusText) {
      this.statusText.textContent = status;
    }
  }
  
  private updateButtonState() {
    if (!this.button) return;
    
    this.button.className = 'voice-button';
    
    if (this.isConnecting) {
      this.button.className += ' connecting';
      this.button.textContent = '⟳';
    } else if (this.isConnected) {
      this.button.className += ' connected';
      this.button.textContent = '📞';
    } else {
      this.button.textContent = '🎤';
    }
  }
  
  private enableButton() {
    if (this.button) {
      this.button.disabled = false;
    }
  }
  
  private updateTranscript(text: string) {
    if (this.transcriptDiv) {
      this.transcriptDiv.textContent = text;
      this.transcriptDiv.classList.remove('hidden');
    }
  }
  
  private updateResponse(text: string) {
    if (this.responseDiv) {
      this.responseDiv.textContent = text;
      this.responseDiv.classList.remove('hidden');
    }
  }
  
  // Public methods
  startCall() {
    if (!this.isConnected && !this.isConnecting) {
      this.toggleConnection();
    }
  }
  
  endCall() {
    if (this.isConnected) {
      this.toggleConnection();
    }
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'disabled') {
      if (this.button) {
        this.button.disabled = newValue !== null;
      }
    }
  }
}

// Register the custom element
customElements.define('vapi-voice-chat', VapiVoiceChat);
