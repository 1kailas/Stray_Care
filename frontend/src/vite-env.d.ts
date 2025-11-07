/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_ENABLE_MOCK_API: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend Window interface for global variables
interface Window {
  __APP_VERSION__?: string;
  gtag?: (...args: any[]) => void;
}

// Module declarations for non-TypeScript imports
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.sass' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

// Leaflet types enhancement
declare module 'leaflet' {
  interface MarkerOptions {
    autoPan?: boolean;
  }
}

// Groq SDK types (if not properly typed)
declare module 'groq-sdk' {
  export default class Groq {
    constructor(config: { apiKey: string });
    chat: {
      completions: {
        create: (params: any) => Promise<any>;
      };
    };
  }
}
