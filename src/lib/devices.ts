// Daniel's own screens: the About page list and the "What I tested" box on guides.
// `panel` is the manufacturer's published specification, not a measurement. Add a
// device here only when he actually owns it.

export interface TestDevice {
  name: string;
  panel: string;
}

export const DEVICES = {
  lg: {
    name: "LG UltraGear 32GP850-B",
    panel: "31.5-inch 2560 × 1440 Nano IPS monitor, 165 Hz (180 Hz overclocked), HDR10",
  },
  mbp: {
    name: "MacBook Pro 16-inch (M1, 2021)",
    panel: "16.2-inch 3456 × 2234 Mini-LED display, up to 120 Hz, 1,600 nits peak in HDR",
  },
  iphone17: {
    name: "iPhone 17",
    panel: "6.3-inch OLED, up to 120 Hz, 1,600 nits peak in HDR",
  },
  iphoneXs: {
    name: "iPhone XS",
    panel: "5.8-inch OLED from 2018, 60 Hz",
  },
  s22u: {
    name: "Samsung Galaxy S22 Ultra",
    panel: "6.8-inch AMOLED, up to 120 Hz",
  },
  ipadMini: {
    name: "iPad mini (6th generation)",
    panel: "8.3-inch IPS LCD, 60 Hz",
  },
} satisfies Record<string, TestDevice>;

export type DeviceKey = keyof typeof DEVICES;

export const ALL_DEVICES = Object.keys(DEVICES) as DeviceKey[];
