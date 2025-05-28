
declare namespace JSX {
  interface IntrinsicElements {
    'vapi-voice-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'public-key'?: string;
      'assistant-id'?: string;
      disabled?: boolean;
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vapi-voice-chat': import('../components/VapiWebComponent').VapiVoiceChat;
  }
}

export {};
