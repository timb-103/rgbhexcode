function intToHex(dec) {
  var result = (parseInt(dec).toString(16));
  if (result.length == 1)
    result = ("0" + result);
  return result.toUpperCase();
}

function rgbToHex(rgb) {
  return intToHex(rgb.r) + intToHex(rgb.g) + intToHex(rgb.b);
}

function getRGB(colors) {
  return `rgb(${colors.red}, ${colors.green}, ${colors.blue})`
}

function getRGBFromHsv(colors) {
  const { r, g, b } = hsvToRgb({
    h: colors.hue,
    s: colors.saturation,
    v: colors.brightness
  })
  return `rgb(${r}, ${g}, ${b})`
}

function hsvToRgb(hsv) {
  rgb = { r: 0, g: 0, b: 0 };

  var h = hsv.h;
  var s = hsv.s;
  var v = hsv.v;

  if (s == 0) {
    if (v == 0) {
      rgb.r = rgb.g = rgb.b = 0;
    } else {
      rgb.r = rgb.g = rgb.b = parseInt(v * 255 / 100);
    }
  } else {
    if (h == 360) {
      h = 0;
    }
    h /= 60;

    // 100 scale
    s = s / 100;
    v = v / 100;

    var i = parseInt(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - (s * f));
    var t = v * (1 - (s * (1 - f)));
    switch (i) {
      case 0:
        rgb.r = v;
        rgb.g = t;
        rgb.b = p;
        break;
      case 1:
        rgb.r = q;
        rgb.g = v;
        rgb.b = p;
        break;
      case 2:
        rgb.r = p;
        rgb.g = v;
        rgb.b = t;
        break;
      case 3:
        rgb.r = p;
        rgb.g = q;
        rgb.b = v;
        break;
      case 4:
        rgb.r = t;
        rgb.g = p;
        rgb.b = v;
        break;
      case 5:
        rgb.r = v;
        rgb.g = p;
        rgb.b = q;
        break;
    }

    rgb.r = parseInt(rgb.r * 255);
    rgb.g = parseInt(rgb.g * 255);
    rgb.b = parseInt(rgb.b * 255);
  }

  return rgb;
}

function rgbToHsv(rgb) {
  var r = rgb.r / 255;
  var g = rgb.g / 255;
  var b = rgb.b / 255;

  hsv = { h: 0, s: 0, v: 0 };

  var min = 0
  var max = 0;

  if (r >= g && r >= b) {
    max = r;
    min = (g > b) ? b : g;
  } else if (g >= b && g >= r) {
    max = g;
    min = (r > b) ? b : r;
  } else {
    max = b;
    min = (g > r) ? r : g;
  }

  hsv.v = max;
  hsv.s = (max) ? ((max - min) / max) : 0;

  if (!hsv.s) {
    hsv.h = 0;
  } else {
    delta = max - min;
    if (r == max) {
      hsv.h = (g - b) / delta;
    } else if (g == max) {
      hsv.h = 2 + (b - r) / delta;
    } else {
      hsv.h = 4 + (r - g) / delta;
    }

    hsv.h = parseInt(hsv.h * 60);
    if (hsv.h < 0) {
      hsv.h += 360;
    }
  }

  hsv.s = parseInt(hsv.s * 100);
  hsv.v = parseInt(hsv.v * 100);

  return hsv;
}

function calculateRGBOpaqueness(r, g, b, mode) {
  const opacityValues = {
    barL1: 0, // Lowest layer
    barL2: 0,
    barL3: 0,
    barL4: 0, // Topmost layer
  };

  let hValue = 0;
  let vValue = 0;

  if (mode === 'red') {
    hValue = b;
    vValue = g;
  } else if (mode === 'green') {
    hValue = b;
    vValue = r;
  } else if (mode === 'blue') {
    hValue = r;
    vValue = g;
  } else {
    throw new Error('Invalid mode: Only red, green, and blue are supported.');
  }

  const horzPer = (hValue / 255) * 100;
  const vertPer = (vValue / 255) * 100;

  const horzPerRev = ((255 - hValue) / 255) * 100;
  const vertPerRev = ((255 - vValue) / 255) * 100;

  opacityValues.barL4 = Math.min(vertPer, horzPerRev);
  opacityValues.barL3 = Math.min(vertPer, horzPer);
  opacityValues.barL2 = Math.min(vertPerRev, horzPer);
  opacityValues.barL1 = Math.min(vertPerRev, horzPerRev);

  return opacityValues;
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '').toUpperCase();
  
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function getComplementaryColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  
  return rgbToHex({r: compR, g: compG, b: compB })
}

function getSplitComplementaryFromHsv(h, s, v, angle = 90) {
  const hue1 = (h + angle) % 360;
  const hue2 = (h - angle + 360) % 360;

  return [
    rgbToHex(hsvToRgb({ h: hue1, s, v })),
    rgbToHex(hsvToRgb({ h, s, v})),
    rgbToHex(hsvToRgb({ h: hue2, s, v })),
  ];
}

function getTriadicColors(h, s, v) {
  const hue1 = (h + 120) % 360;
  const hue2 = (h - 120 + 360) % 360;

  return [
    rgbToHex(hsvToRgb({ h, s, v })),
    rgbToHex(hsvToRgb({ h: hue1, s, v })),
    rgbToHex(hsvToRgb({ h: hue2, s, v }))
  ];
}

function getTetradicColors(h, s, v, offset = 90) {
  const h2 = (h + 180) % 360;
  const h3 = (h + offset) % 360;
  const h4 = (h2 + offset) % 360;

  return [
    rgbToHex(hsvToRgb({ h, s, v })),
    rgbToHex(hsvToRgb({ h: h2, s, v })),
    rgbToHex(hsvToRgb({ h: h3, s, v })),
    rgbToHex(hsvToRgb({ h: h4, s, v })),
  ];
}

function getTonesFromHsv(h, s, v, steps = 10) {
  const tones = [];
  const stepSize = s / steps;

  for (let i = 0; i <= steps; i++) {
    const currentSaturation = Math.max(0, s - stepSize * i);
    tones.push(rgbToHex(hsvToRgb({ h, s: Math.round(currentSaturation), v })));
  }

  return tones;
}

function getShadesFromHsv(h, s, v, steps = 10) {
  const shades = [];
  const stepSize = v / steps;

  for (let i = 0; i <= steps; i++) {
    const currentValue = Math.max(0, v - stepSize * i);
    shades.push(rgbToHex(hsvToRgb({ h, s, v: Math.round(currentValue) })));
  }

  return shades;
}