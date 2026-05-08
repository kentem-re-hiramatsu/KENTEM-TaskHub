import { defineConfig, defineGlobalStyles, defineKeyframes } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  'html, body': {
    padding: 0,
    margin: 0,
    fontSize: '16px',
    fontWeight: 500,
    backgroundColor: 'ksTheme.background',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  '*': {
    boxSizing: 'border-box',
  },
  button: {
    padding: 0,
    margin: 0,
    font: 'inherit',
    fontSize: '100%',
    color: 'inherit',
    cursor: 'pointer',
    background: 0,
    border: 0,
  },
  'h1, h2, h3': {
    padding: 0,
    margin: 0,
    fontWeight: 'normal',
    color: 'inherit',
  },
  textarea: {
    fontFamily: 'inherit'
  }
})

const keyframes = defineKeyframes({
  outline:{'50%':{boxShadow: '0 0 2px 2px turquoise'}},
  loading:{
    '0%':{strokeDashoffset:'400px',fill:'transparent' },
    '80%':{strokeDashoffset:'0', fill:'transparent'},
    '90%':{strokeDashoffset:'0',fill:'ksTheme.primary'},
    '100%':{strokeDashoffset:'0',fill:'ksTheme.primary'}
  },
  dotsLoader: {
    'from': { clipPath: 'inset(0 100% 0 0)' },
    'to': { clipPath: 'inset(0 -34% 0 0)' },
  }
})


export default defineConfig({
  globalCss,

  // Where to look for your css declarations
  include: [
    "./app/**/*.{ts,tsx}",
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './ks-react-components/src/**/*.{ts,tsx}'
  ],
  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          ksTheme: {
            primary: {
              DEFAULT: { value: '#2E7D32' },
              container: { value: '#A3F69C' },
              press: { value: '#1B6D24' },
            },
            secondary: {
              DEFAULT: { value: '#84967F' },
              container: { value: '#D6E8CE' },
              press: { value: '#B4D2A7' },
            },
            tertiary: {
              DEFAULT: { value: '#6B989D' },
              container: { value: '#BCEBF0' },
            },
            text: {
              active: { value: '#000000DE' },
              inactive: { value: '#00000099' },
              disabled: { value: '#00000061' },
              onFill: { value: '#FFFFFF' },
              link: { value: '#3979CE' },
              hover: { value: '#7AA9E8' },
              linkActive: { value: '#7AA9E8' },
              visited: { value: '#551A8B' },
            },
            background: {
              DEFAULT: { value: '#FCFDF6' },
              onBackground: { value: '#1A1C19' },
              surface: { value: '#FCFDF6' },
              surfaceVariant: { value: '#DEE5D8' },
              disabledBack: { value: '#EBEBEB' },
            },
            border: {
              outline: { value: '#D6D6D6' },
              divider: { value: '#D6D6D6' },
              disabled: { value: '#D6D6D6' },
              focused: { value: '#3979CE' },
              selected: { value: '#3979CE' },
              alert: { value: '#BA1A1A' },
            },
            status: {
              alert: {
                DEFAULT: { value: '#BA1A1A' },
                container: { value: '#FFDAD6' },
                press: { value: '#A60A0A' },
                pressContainer: { value: '#EEB6B0' },
              },
              warning: {
                DEFAULT: { value: '#FFCB11' },
                container: { value: '#FFEFCE' },
                containerPress: { value: '#FFE08E' },
                onWarning: { value: '#755B00' },
              },
            },
            table: {
              listThBg: { value: '#E9E9E9' },
              listThBg2: { value: '#F2F2F2' },
              listTdBg: { value: '#FAFAFA' },
              listTdBg2: { value: '#ECF3E6' },
              listSelected: { value: '#F6FFF0' },
              actionBg: { value: '#D6D6D6' },
              saturdayBg: { value: '#DEF1FF' },
              sundayBg: { value: '#FFDAD6' },
            },
          },
        },
      },
      tokens:{
        fonts:{
          notoSansJP: { value:'var(--font-noto-sans-jp)' },
        },
        animations:{
          outline: { value:'outline 1s ease-in-out' },
        },
        zIndex: {  
          // 相対的なz-index（コンポーネント内）- シンプルな値のみ
          relative: {
            hide: { value: '-1' },             // 背面（背景用）
            front: { value: '1' },             // 前面（軽微な重なり）
          },
          whiteboard: {
            list: {
              header: { value: '2' },
              selected: { value: '1' },
            },
            scheduleItem: {
              DEFAULT: { value: '1' },
              arrow: { value: '1' },
              comment: { value: '1' },
              selected: { value: '4' },
              controller: { value: '2' },
              menu: { value: '4' },
              leftTriangle: { value: '1' },
            },
            header: { value: '2' },
            body: {
              title: { value: '1' },
              outsideSchedule: { value: '1' },
            },
            magnet: { value: '1' },
            stickyNote: {
              DEFAULT : { value: '3' },
              selected: { value: '4' },
            },
          },
        }
      },
      keyframes
    },
  },

  utilities: {
    extend: {
      ellipsis: {
        className: 'ellipsis',
        values: { type: 'boolean' },
        transform() {
          return {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          };
        },
      },
    },
  },

  conditions: {
    ksHover: '&:not(:disabled):hover',
    ksGroupHover: '.group:not(:disabled):hover &',
    ksFocus: '&:is(:not(:disabled):hover:focus, :focus)',
    ksFocusWithin: '&:is(:not(:disabled):hover:focus-within, :focus-within)',
    ksFocusVisible: '&:is(:not(:disabled):hover:focus-visible, :focus-visible)',
    ksFocusVisibleWithin:
      '&:has( :is(:not(:disabled):hover:focus-visible, :focus-visible))',
    ksGroupFocus: '.group:is(:not(:disabled):hover:focus, :focus) &',
    ksGroupFocusVisible:
      '.group:is(:not(:disabled):hover:focus-visible, :focus-visible) &',
    ksActive:
      '&:is(:not(:disabled):hover:active, :focus:active, :focus-visible:active, :focus-within:active, :not(:disabled):active)',
    ksGroupActive:
      '.group:is(:not(:disabled):hover:active, :focus:active, :focus-visible:active, :focus-within:active, :not(:disabled):active) &',
    msReveal: '&::-ms-reveal',
  },

  // The output directory for your css system
  outdir: "styled-system",
  layers: {
    "reset": "ks_react_components_reset",
    "base": "ks_react_components_base",
    "tokens": "ks_react_components_tokens",
    "recipes": "ks_react_components_recipes",
    "utilities": "ks_react_components_utilities",
  },
  jsxFramework: 'react',
});
