import { argbFromHex, hexFromArgb } from '@material/material-color-utilities';

import type { HexColor } from './types.ts';

export function argbToHex(argb: number): HexColor {
  return hexFromArgb(argb).toLowerCase() as HexColor;
}

export function hexWithAlpha(hex: HexColor, alpha: number): HexColor {
  const normalized = hex.replace('#', '');
  const suffix = Math.round(clamp(alpha, 0, 1) * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${normalized}${suffix}` as HexColor;
}

export function normalizeHex(hex: string): HexColor {
  return argbToHex(argbFromHex(hex));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
