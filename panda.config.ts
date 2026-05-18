import { defineConfig, defineGlobalStyles, defineKeyframes } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  'html, body': {
    padding: 0,
    margin: 0,
    fontSize: '16px',
    fontWeight: 500,
    backgroundColor: 'app.bg',
    color: 'app.text',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
    colorScheme: 'light dark',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  '*': {
    boxSizing: 'border-box',
    scrollbarWidth: 'thin',
    scrollbarColor: 'token(colors.app.scrollbar) transparent',
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
    fontFamily: 'inherit',
  },
  // iOS風スクロールバー
  '::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    background: 'app.scrollbar',
    borderRadius: '999px',
  },
  '::-webkit-scrollbar-thumb:hover': {
    background: 'app.scrollbarHover',
  },
  // Firefox scrollbar (merged with box-sizing rule above via the '*' key already defined)
})

const keyframes = defineKeyframes({
  outline: { '50%': { boxShadow: '0 0 2px 2px turquoise' } },
  loading: {
    '0%': { strokeDashoffset: '400px', fill: 'transparent' },
    '80%': { strokeDashoffset: '0', fill: 'transparent' },
    '90%': { strokeDashoffset: '0', fill: 'app.primary' },
    '100%': { strokeDashoffset: '0', fill: 'app.primary' },
  },
  dotsLoader: {
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 -34% 0 0)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
  wiggle: {
    '0%, 100%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(1deg)' },
    '75%': { transform: 'rotate(-1deg)' },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
})

export default defineConfig({
  globalCss,

  include: [
    "./app/**/*.{ts,tsx}",
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './ks-react-components/src/**/*.{ts,tsx}',
  ],
  exclude: [
    './app/api/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      semanticTokens: {
        colors: {
          // iOS-inspired design tokens with dark mode support
          app: {
            // Primary: iOS System Green
            primary: {
              DEFAULT: {
                value: { base: '#28A745', _dark: '#30D158' },
              },
              pressed: {
                value: { base: '#1E8C3A', _dark: '#24A042' },
              },
              subtle: {
                value: { base: '#D1F5DC', _dark: '#0D3320' },
              },
              text: {
                value: { base: '#FFFFFF', _dark: '#000000' },
              },
            },
            // Backgrounds
            bg: {
              value: { base: '#F2F2F7', _dark: '#1C1C1E' },
            },
            bgElevated: {
              value: { base: '#FFFFFF', _dark: '#2C2C2E' },
            },
            bgElevated2: {
              value: { base: '#F2F2F7', _dark: '#3A3A3C' },
            },
            // Text
            text: {
              value: { base: '#000000', _dark: '#FFFFFF' },
            },
            textSecondary: {
              value: { base: '#3C3C43CC', _dark: '#EBEBF599' },
            },
            textTertiary: {
              value: { base: '#3C3C4399', _dark: '#EBEBF566' },
            },
            textDisabled: {
              value: { base: '#3C3C4361', _dark: '#EBEBF529' },
            },
            textLink: {
              value: { base: '#007AFF', _dark: '#0A84FF' },
            },
            // Separators / Borders
            separator: {
              value: { base: '#3C3C434A', _dark: '#5454584A' },
            },
            border: {
              value: { base: '#D1D1D6', _dark: '#3A3A3C' },
            },
            borderFocused: {
              value: { base: '#007AFF', _dark: '#0A84FF' },
            },
            borderError: {
              value: { base: '#FF3B30', _dark: '#FF453A' },
            },
            // Fill colors
            fill: {
              value: { base: '#78788033', _dark: '#7878804A' },
            },
            fillSecondary: {
              value: { base: '#7878802E', _dark: '#78788045' },
            },
            // Status
            error: {
              DEFAULT: {
                value: { base: '#FF3B30', _dark: '#FF453A' },
              },
              subtle: {
                value: { base: '#FFE5E3', _dark: '#3D0A08' },
              },
            },
            warning: {
              DEFAULT: {
                value: { base: '#FF9500', _dark: '#FF9F0A' },
              },
              subtle: {
                value: { base: '#FFF3E0', _dark: '#3D2300' },
              },
            },
            success: {
              DEFAULT: {
                value: { base: '#34C759', _dark: '#30D158' },
              },
              subtle: {
                value: { base: '#E8FBEd', _dark: '#0A2D15' },
              },
            },
            info: {
              DEFAULT: {
                value: { base: '#007AFF', _dark: '#0A84FF' },
              },
              subtle: {
                value: { base: '#E5F2FF', _dark: '#001C3D' },
              },
            },
            // Scrollbar
            scrollbar: {
              value: { base: 'rgba(0,0,0,0.18)', _dark: 'rgba(255,255,255,0.18)' },
            },
            scrollbarHover: {
              value: { base: 'rgba(0,0,0,0.32)', _dark: 'rgba(255,255,255,0.32)' },
            },
            // Legacy ksTheme aliases (keep for files not yet migrated)
            ksTheme: {
              primary: {
                DEFAULT: { value: { base: '#34C759', _dark: '#30D158' } },
                container: { value: { base: '#D1F5DC', _dark: '#0D3320' } },
              },
              text: {
                active: { value: { base: '#000000', _dark: '#FFFFFF' } },
                inactive: { value: { base: '#3C3C43CC', _dark: '#EBEBF599' } },
                disabled: { value: { base: '#3C3C4361', _dark: '#EBEBF529' } },
                link: { value: { base: '#007AFF', _dark: '#0A84FF' } },
                hover: { value: { base: '#0A84FF', _dark: '#409CFF' } },
              },
              background: {
                DEFAULT: { value: { base: '#F2F2F7', _dark: '#1C1C1E' } },
                surface: { value: { base: '#FFFFFF', _dark: '#2C2C2E' } },
                surfaceVariant: { value: { base: '#F2F2F7', _dark: '#3A3A3C' } },
                disabledBack: { value: { base: '#EBEBEB', _dark: '#2C2C2E' } },
                canvas: { value: { base: '#F2F2F7', _dark: '#1C1C1E' } },
                white: { value: { base: '#FFFFFF', _dark: '#2C2C2E' } },
                onBackground: { value: { base: '#1A1C19', _dark: '#F2F2F7' } },
              },
              border: {
                outline: { value: { base: '#D1D1D6', _dark: '#3A3A3C' } },
                divider: { value: { base: '#D1D1D6', _dark: '#3A3A3C' } },
                disabled: { value: { base: '#D1D1D6', _dark: '#3A3A3C' } },
                focused: { value: { base: '#007AFF', _dark: '#0A84FF' } },
                selected: { value: { base: '#007AFF', _dark: '#0A84FF' } },
                alert: { value: { base: '#FF3B30', _dark: '#FF453A' } },
              },
              status: {
                alert: {
                  DEFAULT: { value: { base: '#FF3B30', _dark: '#FF453A' } },
                  container: { value: { base: '#FFE5E3', _dark: '#3D0A08' } },
                },
                warning: {
                  DEFAULT: { value: { base: '#FF9500', _dark: '#FF9F0A' } },
                },
              },
              table: {
                listThBg: { value: { base: '#E9E9E9', _dark: '#2C2C2E' } },
                listThBg2: { value: { base: '#F2F2F2', _dark: '#3A3A3C' } },
                listTdBg: { value: { base: '#FAFAFA', _dark: '#2C2C2E' } },
                listTdBg2: { value: { base: '#F0FBF3', _dark: '#0D3320' } },
                listSelected: { value: { base: '#F0FBF3', _dark: '#0D3320' } },
                actionBg: { value: { base: '#D6D6D6', _dark: '#3A3A3C' } },
                saturdayBg: { value: { base: '#DEF1FF', _dark: '#001A33' } },
                sundayBg: { value: { base: '#FFE5E3', _dark: '#3D0A08' } },
              },
            },
          },
        },
      },
      tokens: {
        fonts: {
          notoSansJP: { value: 'var(--font-noto-sans-jp)' },
        },
        animations: {
          outline: { value: 'outline 1s ease-in-out' },
        },
        radii: {
          ios: { value: '12px' },
          iosSm: { value: '8px' },
          iosXs: { value: '6px' },
        },
        zIndex: {
          relative: {
            hide: { value: '-1' },
            front: { value: '1' },
          },
          whiteboard: {
            list: {
              header: { value: '2' },
              selected: { value: '1' },
            },
            header: { value: '2' },
            body: {
              title: { value: '1' },
              outsideSchedule: { value: '1' },
            },
          },
        },
      },
      keyframes,
    },
  },

  conditions: {
    extend: {
      dark: '[data-theme="dark"] &',
      light: '[data-theme="light"] &',
    },
    ksHover: '&:not(:disabled):hover',
    ksGroupHover: '.group:not(:disabled):hover &',
    ksFocus: '&:is(:not(:disabled):hover:focus, :focus)',
    ksFocusWithin: '&:is(:not(:disabled):hover:focus-within, :focus-within)',
    ksFocusVisible: '&:is(:not(:disabled):hover:focus-visible, :focus-visible)',
    ksFocusVisibleWithin: '&:has( :is(:not(:disabled):hover:focus-visible, :focus-visible))',
    ksGroupFocus: '.group:is(:not(:disabled):hover:focus, :focus) &',
    ksGroupFocusVisible: '.group:is(:not(:disabled):hover:focus-visible, :focus-visible) &',
    ksActive: '&:is(:not(:disabled):hover:active, :focus:active, :focus-visible:active, :focus-within:active, :not(:disabled):active)',
    ksGroupActive: '.group:is(:not(:disabled):hover:active, :focus:active, :focus-visible:active, :focus-within:active, :not(:disabled):active) &',
    msReveal: '&::-ms-reveal',
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

  outdir: "styled-system",
  layers: {
    reset: "ks_react_components_reset",
    base: "ks_react_components_base",
    tokens: "ks_react_components_tokens",
    recipes: "ks_react_components_recipes",
    utilities: "ks_react_components_utilities",
  },
  jsxFramework: 'react',
});
