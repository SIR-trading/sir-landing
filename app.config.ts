export default defineAppConfig({
  ui: {
    primary: 'sea-buckthorn',
    secondary: 'green',
    gray: 'neutral',
    container: {
      constrained: 'max-w-5xl',
      padding: 'px-0 sm:px-0 lg:px-0'
    },
    progress: {
      progress: {
        indicator: {
          container: {
            base: 'absolute',
            width: 'min-w-fit',
            transition: 'transition-all',
          }
        },
        size: {
          '3xl': 'h-6',
          '4xl': 'h-8',
          '5xl': 'h-12',
        }
      }
    },
    avatar: {
      size: {
        '4xl': 'h-[100px] w-[100px] text-3xl',
      }
    },
    button: {
      color: {
        robRoy: {
          outline: 'ring-1 ring-inset ring-current text-gray-900 dark:text-white hover:bg-white dark:hover:bg-rob-roy-300 dark:hover:text-black focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-rob-roy-500 dark:focus-visible:ring-primary-400',
          solid: 'dark:bg-rob-roy-300 hover:bg-white dark:hover:bg-rob-roy-200 dark:text-black dark:hover:text-black focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-rob-roy-500 dark:focus-visible:ring-primary-400',
        }
      },
      variant: {
        prototype: 'ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent aria-disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400',
        solid: 'shadow-sm text-white font-semibold text-md ring-1 ring-white bg-{color}-600 hover:bg-{color}-500 disabled:bg-{color}-400 dark:bg-{color}-300 dark:hover:bg-{color}-400 dark:disabled:bg-{color}-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-100'
      }
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