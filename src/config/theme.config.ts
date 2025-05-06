export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    header: {
      background: string;
      text: string;
    };
    gradient: {
      start: string;
      middle: string;
      end: string;
      accent: string;
    };
  };
}

export const themes: Theme[] = [
  {
    name: 'Byju\'s Purple',
    colors: {
      primary: '#833388',
      secondary: '#9b4bb7',
      accent: '#a05bb7',
      background: '#ffffff',
      foreground: '#1d1d1f',
      header: {
        background: '#833388',
        text: '#ffffff'
      },
      gradient: {
        start: '#00c2ff',
        middle: '#a0faff',
        end: '#fcf9f8',
        accent: '#c46ffb'
      }
    }
  },
  {
    name: 'Apple Blue',
    colors: {
      primary: '#0071e3',
      secondary: '#0a84ff',
      accent: '#0077ed',
      background: '#ffffff',
      foreground: '#1d1d1f',
      header: {
        background: '#0071e3',
        text: '#ffffff'
      },
      gradient: {
        start: '#0071e3',
        middle: '#0a84ff',
        end: '#ffffff',
        accent: '#0077ed'
      }
    }
  },
  {
    name: 'Dark Mode',
    colors: {
      primary: '#0a84ff',
      secondary: '#1c1c1e',
      accent: '#2c2c2e',
      background: '#000000',
      foreground: '#f5f5f7',
      header: {
        background: '#1c1c1e',
        text: '#f5f5f7'
      },
      gradient: {
        start: '#0a84ff',
        middle: '#2c2c2e',
        end: '#1c1c1e',
        accent: '#0077ed'
      }
    }
  },
  {
    name: 'Nature Green',
    colors: {
      primary: '#34c759',
      secondary: '#30b350',
      accent: '#248a3d',
      background: '#ffffff',
      foreground: '#1d1d1f',
      header: {
        background: '#34c759',
        text: '#ffffff'
      },
      gradient: {
        start: '#34c759',
        middle: '#30b350',
        end: '#ffffff',
        accent: '#248a3d'
      }
    }
  }
];

export const defaultTheme = themes[0]; 