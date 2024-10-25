import type {Config} from 'tailwindcss'

export default <Partial<Config>>{

  theme: {
    extend: {
      backgroundImage: {
        '5-color-gradient': 'linear-gradient(to right, rgba(122, 91, 46, 0.50) 0%, rgba(191, 155, 103, 0.50) 23.23%, rgba(255, 255, 255, 0.50) 50.56%, rgba(191, 155, 103, 0.50) 75.59%, rgba(122, 91, 46, 0.50) 100.12%)'
      },
      boxShadow: {
        'md': '0px 4px 4px rgba(0, 0, 0, 0.25)',
        'sir': '2px 4px 10px rgba(0, 0, 0, 0.5)',
      },
      blur: {
        '12px': '12px',
      },
      fontSize: {
        sm: '0.875rem',
        md: '1.125rem',
        lg: '1.5rem',
        xl: '2rem',
        '1/2xl': '2.5rem',
        '2xl': '3rem',
        '3xl': '3.5rem',
        '4xl': '4rem'
      },
      maxWidth: {
        md: '24.75rem',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      colors: {
        primary: 'white',
        gray: 'cool',
        darkGray: '#0A0A0F',
        midGray: '#25213C',
        softGray: '#414158',
        cyan: '#26DEC8',
        redAccent: 'rgba(252, 165, 165, 1)',
        'gradient-start': 'rgba(122, 91, 46, 0.5)',
        'gradient-mid': 'rgba(191, 155, 103, 0.5)',
        'gradient-end': 'rgba(255, 255, 255, 0.5)',
        'geyser': {
          '50': '#f5f7f9',
          '100': '#e8edf1',
          '200': '#ced8e1',
          '300': '#bbc9d5',
          '400': '#9aaec0',
          '500': '#8197b0',
          '600': '#6f83a1',
          '700': '#637392',
          '800': '#556078',
          '900': '#475061',
          '950': '#2e323d',
        },
        'harlequin': {
          '50': '#eeffe4',
          '100': '#d9ffc4',
          '200': '#b5ff90',
          '300': '#85ff50',
          '400': '#4bff0a',
          '500': '#37e600',
          '600': '#27b800',
          '700': '#1d8b00',
          '800': '#1c6d07',
          '900': '#1a5c0b',
          '950': '#073400',
        },
        'sea-buckthorn': {
          '50': '#fef8ec',
          '100': '#fde9c8',
          '200': '#fad18d',
          '300': '#f7b452',
          '400': '#f69f36',
          '500': '#ef7511',
          '600': '#d4540b',
          '700': '#b0380d',
          '800': '#8f2b11',
          '900': '#752512',
          '950': '#431005',
        },
        'green': {
          '50': '#f1fcfa',
          '100': '#cff8ee',
          '200': '#9ff0dd',
          '300': '#67e1ca',
          '400': '#37cab2',
          '500': '#1eae99',
          '600': '#15897b',
          '700': '#157066',
          '800': '#165953',
          '900': '#174a45',
          '950': '#072c2a',
        },
        'gray-suit': {
          '50': '#f5f6f8',
          '100': '#edeef2',
          '200': '#dedfe7',
          '300': '#c9cbd8',
          '400': '#b6b6c9',
          '500': '#9f9eb6',
          '600': '#8c88a3',
          '700': '#79758d',
          '800': '#636073',
          '900': '#52515e',
          '950': '#302f37',
        },
        'blue-bell': {
          '50': '#f8f9fa',
          '100': '#f1f2f6',
          '200': '#e5e6ef',
          '300': '#d0d1e2',
          '400': '#b5b6d0',
          '500': '#8f8fb7',
          '600': '#817ea9',
          '700': '#6f6b96',
          '800': '#5c597e',
          '900': '#4d4a68',
          '950': '#313045',
        },
        'black-russian': {
          '50': '#e9edff',
          '100': '#d7dfff',
          '200': '#b7c3ff',
          '300': '#8c9aff',
          '400': '#5e64ff',
          '500': '#443aff',
          '600': '#3718ff',
          '700': '#300ef4',
          '800': '#280fc4',
          '900': '#25169966',
          '950': '#090522',
        },
        'rob-roy': {
          '50': '#fdf8ed',
          '100': '#f9ebcc',
          '200': '#f3d694',
          '300': '#f0c777',
          '400': '#e9a436',
          '500': '#e1851f',
          '600': '#c76418',
          '700': '#a54618',
          '800': '#873719',
          '900': '#6f2e18',
          '950': '#3f1609',
        },
        'cameo': {
          '50': '#faf6f2',
          '100': '#f3ebe1',
          '200': '#e5d4c3',
          '300': '#cdaa89',
          '400': '#c39674',
          '500': '#b77d58',
          '600': '#a96a4d',
          '700': '#8d5541',
          '800': '#72473a',
          '900': '#5d3b31',
          '950': '#311d19',
        },
        'kumera': {
          '50': '#f8f7ee',
          '100': '#efedd2',
          '200': '#e1daa7',
          '300': '#cfc175',
          '400': '#c0a94f',
          '500': '#b19641',
          '600': '#987836',
          '700': '#7a5b2e',
          '800': '#674b2c',
          '900': '#59402a',
          '950': '#332215',
        },
        'twine': {
          '50': '#f8f5ee',
          '100': '#ede6d4',
          '200': '#ddcdab',
          '300': '#c9ac7b',
          '400': '#bf9b67',
          '500': '#a97e49',
          '600': '#91653d',
          '700': '#754c33',
          '800': '#634030',
          '900': '#56372d',
          '950': '#311d17',
        },
        'mercury': {
          '50': '#f9f8f7',
          '100': '#f1f0ef',
          '200': '#eae7e6',
          '300': '#d4cfcd',
          '400': '#bbb1ae',
          '500': '#a19692',
          '600': '#897d79',
          '700': '#726763',
          '800': '#605754',
          '900': '#524c4a',
          '950': '#2a2625',
        },
      }
    }
  }
}