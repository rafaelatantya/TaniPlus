import { defineConfig } from '@lynx-js/rspeedy'

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'

const pluginWebPreviewLink = () => ({
  name: 'plugin-web-preview-link',
  setup(api: any) {
    api.onAfterStartDevServer(({ port }: { port: number }) => {
      console.log(`\n  > Web Preview: http://localhost:${port}/__web_preview?casename=main.web.bundle\n`)
    })
  }
})

export default defineConfig({
  environments: {
    lynx: {},
    web: {}
  },
  output: {
    dataUriLimit: 0,
    assetPrefix: 'auto',
  },
  plugins: [
    pluginQRCode({
      schema(url) {
        return `${url}?fullscreen=true`
      },
    }),
    pluginReactLynx(),
    pluginTypeCheck(),
    pluginWebPreviewLink(),
  ],
})
