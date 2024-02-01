export function hexToHls(hex: string) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;
  let sColor = hex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }

    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
    }
    const r = sColorChange[0] / 255;
    const g = sColorChange[1] / 255;
    const b = sColorChange[2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max === min) {
      h = 0;
      s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }
    return `${Math.floor(h * 360)} ${Math.floor(s * 100)}% ${Math.floor(
      l * 100
    )}%)`;
  }
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export function hslToHex(hsl: string) {
  let [h, s, l] = hsl
    .split(" ")
    .map((n) => n.split("%")[0])
    .map(Number);

  const h1 = h / 360;
  const s1 = s / 100;
  const l1 = l / 100;
  let r = 0;
  let g = 0;
  let b = 0;
  if (s1 === 0) {
    r = g = b = l1;
  } else {
    const q = l1 < 0.5 ? l1 * (1 + s1) : l1 + s1 - l1 * s1;
    const p = 2 * l1 - q;
    r = hue2rgb(p, q, h1 + 1 / 3);
    g = hue2rgb(p, q, h1);
    b = hue2rgb(p, q, h1 - 1 / 3);
  }
  const hex = `#${Math.floor(r * 255).toString(16)}${Math.floor(
    g * 255
  ).toString(16)}${Math.floor(b * 255).toString(16)}`;
  return hex;
}
