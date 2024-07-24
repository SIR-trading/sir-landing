export default defineAppConfig({
  ui: {
    primary: 'sea-buckthorn',
    secondary: 'green',
    gray: 'neutral',
    container: {
      constrained: 'max-w-5xl',
    },
    progress: {
      progress: {
        size: {
          '3xl': 'h-6',
          '4xl': 'h-8',
          '5xl': 'h-12',
        }
      }
    },
    button: {
      variant: {
        solid: 'shadow-sm text-white font-semibold text-md ring-1 ring-white bg-{color}-600 hover:bg-{color}-500 disabled:bg-{color}-400 dark:bg-{color}-300 dark:hover:bg-{color}-400 dark:disabled:bg-{color}-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-100'}
    },
    badge: {
     size: {
       xl: 'text-md px-5 py-3',
     }
    }
  },
  variables: {
    dark: {
      background: '#000000'
    },
  }
})