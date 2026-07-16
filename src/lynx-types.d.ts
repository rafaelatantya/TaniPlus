import '@lynx-js/types';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      input: any;
      'scroll-view': any;
    }
  }
}
