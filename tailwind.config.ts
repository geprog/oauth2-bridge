import type { Config } from 'tailwindcss'

function forDirectory(directory: string) {
  return `./${directory}/**/*.{html,js,ts,vue}`
}

export default {
  content: [forDirectory('components'), forDirectory('layouts'), forDirectory('pages')],
} satisfies Config
