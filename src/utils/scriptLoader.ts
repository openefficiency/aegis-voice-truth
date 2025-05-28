
export interface ScriptLoaderOptions {
  src: string;
  timeout?: number;
  retries?: number;
}

export class ScriptLoader {
  private static loadedScripts = new Set<string>();
  
  static async loadScript(sources: string[], timeout = 10000): Promise<void> {
    for (const src of sources) {
      if (this.loadedScripts.has(src)) {
        return Promise.resolve();
      }
      
      try {
        await this.loadSingleScript(src, timeout);
        this.loadedScripts.add(src);
        return;
      } catch (error) {
        console.warn(`Failed to load script from ${src}:`, error);
        continue;
      }
    }
    
    throw new Error('Failed to load script from all CDN sources');
  }
  
  private static loadSingleScript(src: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      
      const timeoutId = setTimeout(() => {
        script.remove();
        reject(new Error(`Script load timeout: ${src}`));
      }, timeout);
      
      script.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeoutId);
        script.remove();
        reject(new Error(`Script load error: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  }
}
