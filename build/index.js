#!/usr/bin/env node
import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 512:
/***/ ((module) => {


const ansiEscapes = module.exports;
// TODO: remove this in the next major version
module.exports["default"] = ansiEscapes;

const ESC = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';
const isTerminalApp = process.env.TERM_PROGRAM === 'Apple_Terminal';

ansiEscapes.cursorTo = (x, y) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	if (typeof y !== 'number') {
		return ESC + (x + 1) + 'G';
	}

	return ESC + (y + 1) + ';' + (x + 1) + 'H';
};

ansiEscapes.cursorMove = (x, y) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	let ret = '';

	if (x < 0) {
		ret += ESC + (-x) + 'D';
	} else if (x > 0) {
		ret += ESC + x + 'C';
	}

	if (y < 0) {
		ret += ESC + (-y) + 'A';
	} else if (y > 0) {
		ret += ESC + y + 'B';
	}

	return ret;
};

ansiEscapes.cursorUp = (count = 1) => ESC + count + 'A';
ansiEscapes.cursorDown = (count = 1) => ESC + count + 'B';
ansiEscapes.cursorForward = (count = 1) => ESC + count + 'C';
ansiEscapes.cursorBackward = (count = 1) => ESC + count + 'D';

ansiEscapes.cursorLeft = ESC + 'G';
ansiEscapes.cursorSavePosition = isTerminalApp ? '\u001B7' : ESC + 's';
ansiEscapes.cursorRestorePosition = isTerminalApp ? '\u001B8' : ESC + 'u';
ansiEscapes.cursorGetPosition = ESC + '6n';
ansiEscapes.cursorNextLine = ESC + 'E';
ansiEscapes.cursorPrevLine = ESC + 'F';
ansiEscapes.cursorHide = ESC + '?25l';
ansiEscapes.cursorShow = ESC + '?25h';

ansiEscapes.eraseLines = count => {
	let clear = '';

	for (let i = 0; i < count; i++) {
		clear += ansiEscapes.eraseLine + (i < count - 1 ? ansiEscapes.cursorUp() : '');
	}

	if (count) {
		clear += ansiEscapes.cursorLeft;
	}

	return clear;
};

ansiEscapes.eraseEndLine = ESC + 'K';
ansiEscapes.eraseStartLine = ESC + '1K';
ansiEscapes.eraseLine = ESC + '2K';
ansiEscapes.eraseDown = ESC + 'J';
ansiEscapes.eraseUp = ESC + '1J';
ansiEscapes.eraseScreen = ESC + '2J';
ansiEscapes.scrollUp = ESC + 'S';
ansiEscapes.scrollDown = ESC + 'T';

ansiEscapes.clearScreen = '\u001Bc';

ansiEscapes.clearTerminal = process.platform === 'win32' ?
	`${ansiEscapes.eraseScreen}${ESC}0f` :
	// 1. Erases the screen (Only done in case `2` is not supported)
	// 2. Erases the whole screen including scrollback buffer
	// 3. Moves cursor to the top-left position
	// More info: https://www.real-world-systems.com/docs/ANSIcode.html
	`${ansiEscapes.eraseScreen}${ESC}3J${ESC}H`;

ansiEscapes.beep = BEL;

ansiEscapes.link = (text, url) => {
	return [
		OSC,
		'8',
		SEP,
		SEP,
		url,
		BEL,
		text,
		OSC,
		'8',
		SEP,
		SEP,
		BEL
	].join('');
};

ansiEscapes.image = (buffer, options = {}) => {
	let ret = `${OSC}1337;File=inline=1`;

	if (options.width) {
		ret += `;width=${options.width}`;
	}

	if (options.height) {
		ret += `;height=${options.height}`;
	}

	if (options.preserveAspectRatio === false) {
		ret += ';preserveAspectRatio=0';
	}

	return ret + ':' + buffer.toString('base64') + BEL;
};

ansiEscapes.iTerm = {
	setCwd: (cwd = process.cwd()) => `${OSC}50;CurrentDir=${cwd}${BEL}`,

	annotation: (message, options = {}) => {
		let ret = `${OSC}1337;`;

		const hasX = typeof options.x !== 'undefined';
		const hasY = typeof options.y !== 'undefined';
		if ((hasX || hasY) && !(hasX && hasY && typeof options.length !== 'undefined')) {
			throw new Error('`x`, `y` and `length` must be defined when `x` or `y` is defined');
		}

		message = message.replace(/\|/g, '');

		ret += options.isHidden ? 'AddHiddenAnnotation=' : 'AddAnnotation=';

		if (options.length > 0) {
			ret +=
					(hasX ?
						[message, options.length, options.x, options.y] :
						[options.length, message]).join('|');
		} else {
			ret += message;
		}

		return ret + BEL;
	}
};


/***/ }),

/***/ 63:
/***/ ((module) => {



module.exports = ({onlyFirst = false} = {}) => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ 68:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* module decorator */ module = __nccwpck_require__.nmd(module);


const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = __nccwpck_require__(931);
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ 31:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const spinners = Object.assign({}, __nccwpck_require__(374)); // eslint-disable-line import/extensions

const spinnersList = Object.keys(spinners);

Object.defineProperty(spinners, 'random', {
	get() {
		const randomIndex = Math.floor(Math.random() * spinnersList.length);
		const spinnerName = spinnersList[randomIndex];
		return spinners[spinnerName];
	}
});

module.exports = spinners;


/***/ }),

/***/ 455:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = cliWidth;

function normalizeOpts(options) {
  const defaultOpts = {
    defaultWidth: 0,
    output: process.stdout,
    tty: __nccwpck_require__(224),
  };

  if (!options) {
    return defaultOpts;
  }

  Object.keys(defaultOpts).forEach(function (key) {
    if (!options[key]) {
      options[key] = defaultOpts[key];
    }
  });

  return options;
}

function cliWidth(options) {
  const opts = normalizeOpts(options);

  if (opts.output.getWindowSize) {
    return opts.output.getWindowSize()[0] || opts.defaultWidth;
  }

  if (opts.tty.getWindowSize) {
    return opts.tty.getWindowSize()[1] || opts.defaultWidth;
  }

  if (opts.output.columns) {
    return opts.output.columns;
  }

  if (process.env.CLI_WIDTH) {
    const width = parseInt(process.env.CLI_WIDTH, 10);

    if (!isNaN(width) && width !== 0) {
      return width;
    }
  }

  return opts.defaultWidth;
}


/***/ }),

/***/ 391:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __nccwpck_require__(510);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const conversions = __nccwpck_require__(391);
const route = __nccwpck_require__(880);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 880:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const conversions = __nccwpck_require__(391);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 510:
/***/ ((module) => {



module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 212:
/***/ ((module) => {



module.exports = function () {
  // https://mths.be/emoji
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};


/***/ }),

/***/ 882:
/***/ ((module) => {

/* eslint-disable yoda */


const isFullwidthCodePoint = codePoint => {
	if (Number.isNaN(codePoint)) {
		return false;
	}

	// Code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		codePoint >= 0x1100 && (
			codePoint <= 0x115F || // Hangul Jamo
			codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= codePoint && codePoint <= 0x4DBF) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
			// Hangul Jamo Extended-A
			(0xA960 <= codePoint && codePoint <= 0xA97C) ||
			// Hangul Syllables
			(0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
			// CJK Compatibility Ideographs
			(0xF900 <= codePoint && codePoint <= 0xFAFF) ||
			// Vertical Forms
			(0xFE10 <= codePoint && codePoint <= 0xFE19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
			// Halfwidth and Fullwidth Forms
			(0xFF01 <= codePoint && codePoint <= 0xFF60) ||
			(0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
			// Kana Supplement
			(0x1B000 <= codePoint && codePoint <= 0x1B001) ||
			// Enclosed Ideographic Supplement
			(0x1F200 <= codePoint && codePoint <= 0x1F251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= codePoint && codePoint <= 0x3FFFD)
		)
	) {
		return true;
	}

	return false;
};

module.exports = isFullwidthCodePoint;
module.exports["default"] = isFullwidthCodePoint;


/***/ }),

/***/ 533:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Stream = __nccwpck_require__(781)

class MuteStream extends Stream {
  #isTTY = null

  constructor (opts = {}) {
    super(opts)
    this.writable = this.readable = true
    this.muted = false
    this.on('pipe', this._onpipe)
    this.replace = opts.replace

    // For readline-type situations
    // This much at the start of a line being redrawn after a ctrl char
    // is seen (such as backspace) won't be redrawn as the replacement
    this._prompt = opts.prompt || null
    this._hadControl = false
  }

  #destSrc (key, def) {
    if (this._dest) {
      return this._dest[key]
    }
    if (this._src) {
      return this._src[key]
    }
    return def
  }

  #proxy (method, ...args) {
    if (typeof this._dest?.[method] === 'function') {
      this._dest[method](...args)
    }
    if (typeof this._src?.[method] === 'function') {
      this._src[method](...args)
    }
  }

  get isTTY () {
    if (this.#isTTY !== null) {
      return this.#isTTY
    }
    return this.#destSrc('isTTY', false)
  }

  // basically just get replace the getter/setter with a regular value
  set isTTY (val) {
    this.#isTTY = val
  }

  get rows () {
    return this.#destSrc('rows')
  }

  get columns () {
    return this.#destSrc('columns')
  }

  mute () {
    this.muted = true
  }

  unmute () {
    this.muted = false
  }

  _onpipe (src) {
    this._src = src
  }

  pipe (dest, options) {
    this._dest = dest
    return super.pipe(dest, options)
  }

  pause () {
    if (this._src) {
      return this._src.pause()
    }
  }

  resume () {
    if (this._src) {
      return this._src.resume()
    }
  }

  write (c) {
    if (this.muted) {
      if (!this.replace) {
        return true
      }
      // eslint-disable-next-line no-control-regex
      if (c.match(/^\u001b/)) {
        if (c.indexOf(this._prompt) === 0) {
          c = c.slice(this._prompt.length)
          c = c.replace(/./g, this.replace)
          c = this._prompt + c
        }
        this._hadControl = true
        return this.emit('data', c)
      } else {
        if (this._prompt && this._hadControl &&
          c.indexOf(this._prompt) === 0) {
          this._hadControl = false
          this.emit('data', this._prompt)
          c = c.slice(this._prompt.length)
        }
        c = c.toString().replace(/./g, this.replace)
      }
    }
    this.emit('data', c)
  }

  end (c) {
    if (this.muted) {
      if (c && this.replace) {
        c = c.toString().replace(/./g, this.replace)
      } else {
        c = null
      }
    }
    if (c) {
      this.emit('data', c)
    }
    this.emit('end')
  }

  destroy (...args) {
    return this.#proxy('destroy', ...args)
  }

  destroySoon (...args) {
    return this.#proxy('destroySoon', ...args)
  }

  close (...args) {
    return this.#proxy('close', ...args)
  }
}

module.exports = MuteStream


/***/ }),

/***/ 577:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const stripAnsi = __nccwpck_require__(591);
const isFullwidthCodePoint = __nccwpck_require__(882);
const emojiRegex = __nccwpck_require__(212);

const stringWidth = string => {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	string = stripAnsi(string);

	if (string.length === 0) {
		return 0;
	}

	string = string.replace(emojiRegex(), '  ');

	let width = 0;

	for (let i = 0; i < string.length; i++) {
		const code = string.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};

module.exports = stringWidth;
// TODO: remove this in the next major version
module.exports["default"] = stringWidth;


/***/ }),

/***/ 591:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const ansiRegex = __nccwpck_require__(63);

module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;


/***/ }),

/***/ 824:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const stringWidth = __nccwpck_require__(577);
const stripAnsi = __nccwpck_require__(591);
const ansiStyles = __nccwpck_require__(68);

const ESCAPES = new Set([
	'\u001B',
	'\u009B'
]);

const END_CODE = 39;

const wrapAnsi = code => `${ESCAPES.values().next().value}[${code}m`;

// Calculate the length of words split on ' ', ignoring
// the extra characters added by ansi escape codes
const wordLengths = string => string.split(' ').map(character => stringWidth(character));

// Wrap a long word across multiple rows
// Ansi escape codes do not count towards length
const wrapWord = (rows, word, columns) => {
	const characters = [...word];

	let isInsideEscape = false;
	let visible = stringWidth(stripAnsi(rows[rows.length - 1]));

	for (const [index, character] of characters.entries()) {
		const characterLength = stringWidth(character);

		if (visible + characterLength <= columns) {
			rows[rows.length - 1] += character;
		} else {
			rows.push(character);
			visible = 0;
		}

		if (ESCAPES.has(character)) {
			isInsideEscape = true;
		} else if (isInsideEscape && character === 'm') {
			isInsideEscape = false;
			continue;
		}

		if (isInsideEscape) {
			continue;
		}

		visible += characterLength;

		if (visible === columns && index < characters.length - 1) {
			rows.push('');
			visible = 0;
		}
	}

	// It's possible that the last row we copy over is only
	// ansi escape characters, handle this edge-case
	if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
		rows[rows.length - 2] += rows.pop();
	}
};

// Trims spaces from a string ignoring invisible sequences
const stringVisibleTrimSpacesRight = str => {
	const words = str.split(' ');
	let last = words.length;

	while (last > 0) {
		if (stringWidth(words[last - 1]) > 0) {
			break;
		}

		last--;
	}

	if (last === words.length) {
		return str;
	}

	return words.slice(0, last).join(' ') + words.slice(last).join('');
};

// The wrap-ansi module can be invoked in either 'hard' or 'soft' wrap mode
//
// 'hard' will never allow a string to take up more than columns characters
//
// 'soft' allows long words to expand past the column length
const exec = (string, columns, options = {}) => {
	if (options.trim !== false && string.trim() === '') {
		return '';
	}

	let pre = '';
	let ret = '';
	let escapeCode;

	const lengths = wordLengths(string);
	let rows = [''];

	for (const [index, word] of string.split(' ').entries()) {
		if (options.trim !== false) {
			rows[rows.length - 1] = rows[rows.length - 1].trimLeft();
		}

		let rowLength = stringWidth(rows[rows.length - 1]);

		if (index !== 0) {
			if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
				// If we start with a new word but the current row length equals the length of the columns, add a new row
				rows.push('');
				rowLength = 0;
			}

			if (rowLength > 0 || options.trim === false) {
				rows[rows.length - 1] += ' ';
				rowLength++;
			}
		}

		// In 'hard' wrap mode, the length of a line is never allowed to extend past 'columns'
		if (options.hard && lengths[index] > columns) {
			const remainingColumns = (columns - rowLength);
			const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
			const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns);
			if (breaksStartingNextLine < breaksStartingThisLine) {
				rows.push('');
			}

			wrapWord(rows, word, columns);
			continue;
		}

		if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
			if (options.wordWrap === false && rowLength < columns) {
				wrapWord(rows, word, columns);
				continue;
			}

			rows.push('');
		}

		if (rowLength + lengths[index] > columns && options.wordWrap === false) {
			wrapWord(rows, word, columns);
			continue;
		}

		rows[rows.length - 1] += word;
	}

	if (options.trim !== false) {
		rows = rows.map(stringVisibleTrimSpacesRight);
	}

	pre = rows.join('\n');

	for (const [index, character] of [...pre].entries()) {
		ret += character;

		if (ESCAPES.has(character)) {
			const code = parseFloat(/\d[^m]*/.exec(pre.slice(index, index + 4)));
			escapeCode = code === END_CODE ? null : code;
		}

		const code = ansiStyles.codes.get(Number(escapeCode));

		if (escapeCode && code) {
			if (pre[index + 1] === '\n') {
				ret += wrapAnsi(code);
			} else if (character === '\n') {
				ret += wrapAnsi(escapeCode);
			}
		}
	}

	return ret;
};

// For each newline, invoke the method separately
module.exports = (string, columns, options) => {
	return String(string)
		.normalize()
		.replace(/\r\n/g, '\n')
		.split('\n')
		.map(line => exec(line, columns, options))
		.join('\n');
};


/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:tty");

/***/ }),

/***/ 781:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("stream");

/***/ }),

/***/ 224:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tty");

/***/ }),

/***/ 88:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const tty = __nccwpck_require__(997);

// eslint-disable-next-line no-warning-comments
// TODO: Use a better method when it's added to Node.js (https://github.com/nodejs/node/pull/40240)
// Lots of optionals here to support Deno.
const hasColors = tty?.WriteStream?.prototype?.hasColors?.() ?? false;

const format = (open, close) => {
	if (!hasColors) {
		return input => input;
	}

	const openCode = `\u001B[${open}m`;
	const closeCode = `\u001B[${close}m`;

	return input => {
		const string = input + ''; // eslint-disable-line no-implicit-coercion -- This is faster.
		let index = string.indexOf(closeCode);

		if (index === -1) {
			// Note: Intentionally not using string interpolation for performance reasons.
			return openCode + string + closeCode;
		}

		// Handle nested colors.

		// We could have done this, but it's too slow (as of Node.js 22).
		// return openCode + string.replaceAll(closeCode, openCode) + closeCode;

		let result = openCode;
		let lastIndex = 0;

		while (index !== -1) {
			result += string.slice(lastIndex, index) + openCode;
			lastIndex = index + closeCode.length;
			index = string.indexOf(closeCode, lastIndex);
		}

		result += string.slice(lastIndex) + closeCode;

		return result;
	};
};

const colors = {};

colors.reset = format(0, 0);
colors.bold = format(1, 22);
colors.dim = format(2, 22);
colors.italic = format(3, 23);
colors.underline = format(4, 24);
colors.overline = format(53, 55);
colors.inverse = format(7, 27);
colors.hidden = format(8, 28);
colors.strikethrough = format(9, 29);

colors.black = format(30, 39);
colors.red = format(31, 39);
colors.green = format(32, 39);
colors.yellow = format(33, 39);
colors.blue = format(34, 39);
colors.magenta = format(35, 39);
colors.cyan = format(36, 39);
colors.white = format(37, 39);
colors.gray = format(90, 39);

colors.bgBlack = format(40, 49);
colors.bgRed = format(41, 49);
colors.bgGreen = format(42, 49);
colors.bgYellow = format(43, 49);
colors.bgBlue = format(44, 49);
colors.bgMagenta = format(45, 49);
colors.bgCyan = format(46, 49);
colors.bgWhite = format(47, 49);
colors.bgGray = format(100, 49);

colors.redBright = format(91, 39);
colors.greenBright = format(92, 39);
colors.yellowBright = format(93, 39);
colors.blueBright = format(94, 39);
colors.magentaBright = format(95, 39);
colors.cyanBright = format(96, 39);
colors.whiteBright = format(97, 39);

colors.bgRedBright = format(101, 49);
colors.bgGreenBright = format(102, 49);
colors.bgYellowBright = format(103, 49);
colors.bgBlueBright = format(104, 49);
colors.bgMagentaBright = format(105, 49);
colors.bgCyanBright = format(106, 49);
colors.bgWhiteBright = format(107, 49);

module.exports = colors;


/***/ }),

/***/ 374:
/***/ ((module) => {

module.exports = JSON.parse('{"dots":{"interval":80,"frames":["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"]},"dots2":{"interval":80,"frames":["⣾","⣽","⣻","⢿","⡿","⣟","⣯","⣷"]},"dots3":{"interval":80,"frames":["⠋","⠙","⠚","⠞","⠖","⠦","⠴","⠲","⠳","⠓"]},"dots4":{"interval":80,"frames":["⠄","⠆","⠇","⠋","⠙","⠸","⠰","⠠","⠰","⠸","⠙","⠋","⠇","⠆"]},"dots5":{"interval":80,"frames":["⠋","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋"]},"dots6":{"interval":80,"frames":["⠁","⠉","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠤","⠄","⠄","⠤","⠴","⠲","⠒","⠂","⠂","⠒","⠚","⠙","⠉","⠁"]},"dots7":{"interval":80,"frames":["⠈","⠉","⠋","⠓","⠒","⠐","⠐","⠒","⠖","⠦","⠤","⠠","⠠","⠤","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋","⠉","⠈"]},"dots8":{"interval":80,"frames":["⠁","⠁","⠉","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠤","⠄","⠄","⠤","⠠","⠠","⠤","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋","⠉","⠈","⠈"]},"dots9":{"interval":80,"frames":["⢹","⢺","⢼","⣸","⣇","⡧","⡗","⡏"]},"dots10":{"interval":80,"frames":["⢄","⢂","⢁","⡁","⡈","⡐","⡠"]},"dots11":{"interval":100,"frames":["⠁","⠂","⠄","⡀","⢀","⠠","⠐","⠈"]},"dots12":{"interval":80,"frames":["⢀⠀","⡀⠀","⠄⠀","⢂⠀","⡂⠀","⠅⠀","⢃⠀","⡃⠀","⠍⠀","⢋⠀","⡋⠀","⠍⠁","⢋⠁","⡋⠁","⠍⠉","⠋⠉","⠋⠉","⠉⠙","⠉⠙","⠉⠩","⠈⢙","⠈⡙","⢈⠩","⡀⢙","⠄⡙","⢂⠩","⡂⢘","⠅⡘","⢃⠨","⡃⢐","⠍⡐","⢋⠠","⡋⢀","⠍⡁","⢋⠁","⡋⠁","⠍⠉","⠋⠉","⠋⠉","⠉⠙","⠉⠙","⠉⠩","⠈⢙","⠈⡙","⠈⠩","⠀⢙","⠀⡙","⠀⠩","⠀⢘","⠀⡘","⠀⠨","⠀⢐","⠀⡐","⠀⠠","⠀⢀","⠀⡀"]},"dots13":{"interval":80,"frames":["⣼","⣹","⢻","⠿","⡟","⣏","⣧","⣶"]},"dots8Bit":{"interval":80,"frames":["⠀","⠁","⠂","⠃","⠄","⠅","⠆","⠇","⡀","⡁","⡂","⡃","⡄","⡅","⡆","⡇","⠈","⠉","⠊","⠋","⠌","⠍","⠎","⠏","⡈","⡉","⡊","⡋","⡌","⡍","⡎","⡏","⠐","⠑","⠒","⠓","⠔","⠕","⠖","⠗","⡐","⡑","⡒","⡓","⡔","⡕","⡖","⡗","⠘","⠙","⠚","⠛","⠜","⠝","⠞","⠟","⡘","⡙","⡚","⡛","⡜","⡝","⡞","⡟","⠠","⠡","⠢","⠣","⠤","⠥","⠦","⠧","⡠","⡡","⡢","⡣","⡤","⡥","⡦","⡧","⠨","⠩","⠪","⠫","⠬","⠭","⠮","⠯","⡨","⡩","⡪","⡫","⡬","⡭","⡮","⡯","⠰","⠱","⠲","⠳","⠴","⠵","⠶","⠷","⡰","⡱","⡲","⡳","⡴","⡵","⡶","⡷","⠸","⠹","⠺","⠻","⠼","⠽","⠾","⠿","⡸","⡹","⡺","⡻","⡼","⡽","⡾","⡿","⢀","⢁","⢂","⢃","⢄","⢅","⢆","⢇","⣀","⣁","⣂","⣃","⣄","⣅","⣆","⣇","⢈","⢉","⢊","⢋","⢌","⢍","⢎","⢏","⣈","⣉","⣊","⣋","⣌","⣍","⣎","⣏","⢐","⢑","⢒","⢓","⢔","⢕","⢖","⢗","⣐","⣑","⣒","⣓","⣔","⣕","⣖","⣗","⢘","⢙","⢚","⢛","⢜","⢝","⢞","⢟","⣘","⣙","⣚","⣛","⣜","⣝","⣞","⣟","⢠","⢡","⢢","⢣","⢤","⢥","⢦","⢧","⣠","⣡","⣢","⣣","⣤","⣥","⣦","⣧","⢨","⢩","⢪","⢫","⢬","⢭","⢮","⢯","⣨","⣩","⣪","⣫","⣬","⣭","⣮","⣯","⢰","⢱","⢲","⢳","⢴","⢵","⢶","⢷","⣰","⣱","⣲","⣳","⣴","⣵","⣶","⣷","⢸","⢹","⢺","⢻","⢼","⢽","⢾","⢿","⣸","⣹","⣺","⣻","⣼","⣽","⣾","⣿"]},"sand":{"interval":80,"frames":["⠁","⠂","⠄","⡀","⡈","⡐","⡠","⣀","⣁","⣂","⣄","⣌","⣔","⣤","⣥","⣦","⣮","⣶","⣷","⣿","⡿","⠿","⢟","⠟","⡛","⠛","⠫","⢋","⠋","⠍","⡉","⠉","⠑","⠡","⢁"]},"line":{"interval":130,"frames":["-","\\\\","|","/"]},"line2":{"interval":100,"frames":["⠂","-","–","—","–","-"]},"pipe":{"interval":100,"frames":["┤","┘","┴","└","├","┌","┬","┐"]},"simpleDots":{"interval":400,"frames":[".  ",".. ","...","   "]},"simpleDotsScrolling":{"interval":200,"frames":[".  ",".. ","..."," ..","  .","   "]},"star":{"interval":70,"frames":["✶","✸","✹","✺","✹","✷"]},"star2":{"interval":80,"frames":["+","x","*"]},"flip":{"interval":70,"frames":["_","_","_","-","`","`","\'","´","-","_","_","_"]},"hamburger":{"interval":100,"frames":["☱","☲","☴"]},"growVertical":{"interval":120,"frames":["▁","▃","▄","▅","▆","▇","▆","▅","▄","▃"]},"growHorizontal":{"interval":120,"frames":["▏","▎","▍","▌","▋","▊","▉","▊","▋","▌","▍","▎"]},"balloon":{"interval":140,"frames":[" ",".","o","O","@","*"," "]},"balloon2":{"interval":120,"frames":[".","o","O","°","O","o","."]},"noise":{"interval":100,"frames":["▓","▒","░"]},"bounce":{"interval":120,"frames":["⠁","⠂","⠄","⠂"]},"boxBounce":{"interval":120,"frames":["▖","▘","▝","▗"]},"boxBounce2":{"interval":100,"frames":["▌","▀","▐","▄"]},"triangle":{"interval":50,"frames":["◢","◣","◤","◥"]},"binary":{"interval":80,"frames":["010010","001100","100101","111010","111101","010111","101011","111000","110011","110101"]},"arc":{"interval":100,"frames":["◜","◠","◝","◞","◡","◟"]},"circle":{"interval":120,"frames":["◡","⊙","◠"]},"squareCorners":{"interval":180,"frames":["◰","◳","◲","◱"]},"circleQuarters":{"interval":120,"frames":["◴","◷","◶","◵"]},"circleHalves":{"interval":50,"frames":["◐","◓","◑","◒"]},"squish":{"interval":100,"frames":["╫","╪"]},"toggle":{"interval":250,"frames":["⊶","⊷"]},"toggle2":{"interval":80,"frames":["▫","▪"]},"toggle3":{"interval":120,"frames":["□","■"]},"toggle4":{"interval":100,"frames":["■","□","▪","▫"]},"toggle5":{"interval":100,"frames":["▮","▯"]},"toggle6":{"interval":300,"frames":["ဝ","၀"]},"toggle7":{"interval":80,"frames":["⦾","⦿"]},"toggle8":{"interval":100,"frames":["◍","◌"]},"toggle9":{"interval":100,"frames":["◉","◎"]},"toggle10":{"interval":100,"frames":["㊂","㊀","㊁"]},"toggle11":{"interval":50,"frames":["⧇","⧆"]},"toggle12":{"interval":120,"frames":["☗","☖"]},"toggle13":{"interval":80,"frames":["=","*","-"]},"arrow":{"interval":100,"frames":["←","↖","↑","↗","→","↘","↓","↙"]},"arrow2":{"interval":80,"frames":["⬆️ ","↗️ ","➡️ ","↘️ ","⬇️ ","↙️ ","⬅️ ","↖️ "]},"arrow3":{"interval":120,"frames":["▹▹▹▹▹","▸▹▹▹▹","▹▸▹▹▹","▹▹▸▹▹","▹▹▹▸▹","▹▹▹▹▸"]},"bouncingBar":{"interval":80,"frames":["[    ]","[=   ]","[==  ]","[=== ]","[====]","[ ===]","[  ==]","[   =]","[    ]","[   =]","[  ==]","[ ===]","[====]","[=== ]","[==  ]","[=   ]"]},"bouncingBall":{"interval":80,"frames":["( ●    )","(  ●   )","(   ●  )","(    ● )","(     ●)","(    ● )","(   ●  )","(  ●   )","( ●    )","(●     )"]},"smiley":{"interval":200,"frames":["😄 ","😝 "]},"monkey":{"interval":300,"frames":["🙈 ","🙈 ","🙉 ","🙊 "]},"hearts":{"interval":100,"frames":["💛 ","💙 ","💜 ","💚 ","❤️ "]},"clock":{"interval":100,"frames":["🕛 ","🕐 ","🕑 ","🕒 ","🕓 ","🕔 ","🕕 ","🕖 ","🕗 ","🕘 ","🕙 ","🕚 "]},"earth":{"interval":180,"frames":["🌍 ","🌎 ","🌏 "]},"material":{"interval":17,"frames":["█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁","███████▁▁▁▁▁▁▁▁▁▁▁▁▁","████████▁▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","██████████▁▁▁▁▁▁▁▁▁▁","███████████▁▁▁▁▁▁▁▁▁","█████████████▁▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁▁██████████████▁▁▁▁","▁▁▁██████████████▁▁▁","▁▁▁▁█████████████▁▁▁","▁▁▁▁██████████████▁▁","▁▁▁▁██████████████▁▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁▁██████████████","▁▁▁▁▁▁██████████████","▁▁▁▁▁▁▁█████████████","▁▁▁▁▁▁▁█████████████","▁▁▁▁▁▁▁▁████████████","▁▁▁▁▁▁▁▁████████████","▁▁▁▁▁▁▁▁▁███████████","▁▁▁▁▁▁▁▁▁███████████","▁▁▁▁▁▁▁▁▁▁██████████","▁▁▁▁▁▁▁▁▁▁██████████","▁▁▁▁▁▁▁▁▁▁▁▁████████","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","██████▁▁▁▁▁▁▁▁▁▁▁▁▁█","████████▁▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","███████████▁▁▁▁▁▁▁▁▁","████████████▁▁▁▁▁▁▁▁","████████████▁▁▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁▁▁█████████████▁▁▁▁","▁▁▁▁▁████████████▁▁▁","▁▁▁▁▁████████████▁▁▁","▁▁▁▁▁▁███████████▁▁▁","▁▁▁▁▁▁▁▁█████████▁▁▁","▁▁▁▁▁▁▁▁█████████▁▁▁","▁▁▁▁▁▁▁▁▁█████████▁▁","▁▁▁▁▁▁▁▁▁█████████▁▁","▁▁▁▁▁▁▁▁▁▁█████████▁","▁▁▁▁▁▁▁▁▁▁▁████████▁","▁▁▁▁▁▁▁▁▁▁▁████████▁","▁▁▁▁▁▁▁▁▁▁▁▁███████▁","▁▁▁▁▁▁▁▁▁▁▁▁███████▁","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁"]},"moon":{"interval":80,"frames":["🌑 ","🌒 ","🌓 ","🌔 ","🌕 ","🌖 ","🌗 ","🌘 "]},"runner":{"interval":140,"frames":["🚶 ","🏃 "]},"pong":{"interval":80,"frames":["▐⠂       ▌","▐⠈       ▌","▐ ⠂      ▌","▐ ⠠      ▌","▐  ⡀     ▌","▐  ⠠     ▌","▐   ⠂    ▌","▐   ⠈    ▌","▐    ⠂   ▌","▐    ⠠   ▌","▐     ⡀  ▌","▐     ⠠  ▌","▐      ⠂ ▌","▐      ⠈ ▌","▐       ⠂▌","▐       ⠠▌","▐       ⡀▌","▐      ⠠ ▌","▐      ⠂ ▌","▐     ⠈  ▌","▐     ⠂  ▌","▐    ⠠   ▌","▐    ⡀   ▌","▐   ⠠    ▌","▐   ⠂    ▌","▐  ⠈     ▌","▐  ⠂     ▌","▐ ⠠      ▌","▐ ⡀      ▌","▐⠠       ▌"]},"shark":{"interval":120,"frames":["▐|\\\\____________▌","▐_|\\\\___________▌","▐__|\\\\__________▌","▐___|\\\\_________▌","▐____|\\\\________▌","▐_____|\\\\_______▌","▐______|\\\\______▌","▐_______|\\\\_____▌","▐________|\\\\____▌","▐_________|\\\\___▌","▐__________|\\\\__▌","▐___________|\\\\_▌","▐____________|\\\\▌","▐____________/|▌","▐___________/|_▌","▐__________/|__▌","▐_________/|___▌","▐________/|____▌","▐_______/|_____▌","▐______/|______▌","▐_____/|_______▌","▐____/|________▌","▐___/|_________▌","▐__/|__________▌","▐_/|___________▌","▐/|____________▌"]},"dqpb":{"interval":100,"frames":["d","q","p","b"]},"weather":{"interval":100,"frames":["☀️ ","☀️ ","☀️ ","🌤 ","⛅️ ","🌥 ","☁️ ","🌧 ","🌨 ","🌧 ","🌨 ","🌧 ","🌨 ","⛈ ","🌨 ","🌧 ","🌨 ","☁️ ","🌥 ","⛅️ ","🌤 ","☀️ ","☀️ "]},"christmas":{"interval":400,"frames":["🌲","🎄"]},"grenade":{"interval":80,"frames":["،  ","′  "," ´ "," ‾ ","  ⸌","  ⸊","  |","  ⁎","  ⁕"," ෴ ","  ⁓","   ","   ","   "]},"point":{"interval":125,"frames":["∙∙∙","●∙∙","∙●∙","∙∙●","∙∙∙"]},"layer":{"interval":150,"frames":["-","=","≡"]},"betaWave":{"interval":80,"frames":["ρββββββ","βρβββββ","ββρββββ","βββρβββ","ββββρββ","βββββρβ","ββββββρ"]},"fingerDance":{"interval":160,"frames":["🤘 ","🤟 ","🖖 ","✋ ","🤚 ","👆 "]},"fistBump":{"interval":80,"frames":["🤜　　　　🤛 ","🤜　　　　🤛 ","🤜　　　　🤛 ","　🤜　　🤛　 ","　　🤜🤛　　 ","　🤜✨🤛　　 ","🤜　✨　🤛　 "]},"soccerHeader":{"interval":80,"frames":[" 🧑⚽️       🧑 ","🧑  ⚽️      🧑 ","🧑   ⚽️     🧑 ","🧑    ⚽️    🧑 ","🧑     ⚽️   🧑 ","🧑      ⚽️  🧑 ","🧑       ⚽️🧑  ","🧑      ⚽️  🧑 ","🧑     ⚽️   🧑 ","🧑    ⚽️    🧑 ","🧑   ⚽️     🧑 ","🧑  ⚽️      🧑 "]},"mindblown":{"interval":160,"frames":["😐 ","😐 ","😮 ","😮 ","😦 ","😦 ","😧 ","😧 ","🤯 ","💥 ","✨ ","　 ","　 ","　 "]},"speaker":{"interval":160,"frames":["🔈 ","🔉 ","🔊 ","🔉 "]},"orangePulse":{"interval":100,"frames":["🔸 ","🔶 ","🟠 ","🟠 ","🔶 "]},"bluePulse":{"interval":100,"frames":["🔹 ","🔷 ","🔵 ","🔵 ","🔷 "]},"orangeBluePulse":{"interval":100,"frames":["🔸 ","🔶 ","🟠 ","🟠 ","🔶 ","🔹 ","🔷 ","🔵 ","🔵 ","🔷 "]},"timeTravel":{"interval":100,"frames":["🕛 ","🕚 ","🕙 ","🕘 ","🕗 ","🕖 ","🕕 ","🕔 ","🕓 ","🕒 ","🕑 ","🕐 "]},"aesthetic":{"interval":80,"frames":["▰▱▱▱▱▱▱","▰▰▱▱▱▱▱","▰▰▰▱▱▱▱","▰▰▰▰▱▱▱","▰▰▰▰▰▱▱","▰▰▰▰▰▰▱","▰▰▰▰▰▰▰","▰▱▱▱▱▱▱"]},"dwarfFortress":{"interval":80,"frames":[" ██████£££  ","☺██████£££  ","☺██████£££  ","☺▓█████£££  ","☺▓█████£££  ","☺▒█████£££  ","☺▒█████£££  ","☺░█████£££  ","☺░█████£££  ","☺ █████£££  "," ☺█████£££  "," ☺█████£££  "," ☺▓████£££  "," ☺▓████£££  "," ☺▒████£££  "," ☺▒████£££  "," ☺░████£££  "," ☺░████£££  "," ☺ ████£££  ","  ☺████£££  ","  ☺████£££  ","  ☺▓███£££  ","  ☺▓███£££  ","  ☺▒███£££  ","  ☺▒███£££  ","  ☺░███£££  ","  ☺░███£££  ","  ☺ ███£££  ","   ☺███£££  ","   ☺███£££  ","   ☺▓██£££  ","   ☺▓██£££  ","   ☺▒██£££  ","   ☺▒██£££  ","   ☺░██£££  ","   ☺░██£££  ","   ☺ ██£££  ","    ☺██£££  ","    ☺██£££  ","    ☺▓█£££  ","    ☺▓█£££  ","    ☺▒█£££  ","    ☺▒█£££  ","    ☺░█£££  ","    ☺░█£££  ","    ☺ █£££  ","     ☺█£££  ","     ☺█£££  ","     ☺▓£££  ","     ☺▓£££  ","     ☺▒£££  ","     ☺▒£££  ","     ☺░£££  ","     ☺░£££  ","     ☺ £££  ","      ☺£££  ","      ☺£££  ","      ☺▓££  ","      ☺▓££  ","      ☺▒££  ","      ☺▒££  ","      ☺░££  ","      ☺░££  ","      ☺ ££  ","       ☺££  ","       ☺££  ","       ☺▓£  ","       ☺▓£  ","       ☺▒£  ","       ☺▒£  ","       ☺░£  ","       ☺░£  ","       ☺ £  ","        ☺£  ","        ☺£  ","        ☺▓  ","        ☺▓  ","        ☺▒  ","        ☺▒  ","        ☺░  ","        ☺░  ","        ☺   ","        ☺  &","        ☺ ☼&","       ☺ ☼ &","       ☺☼  &","      ☺☼  & ","      ‼   & ","     ☺   &  ","    ‼    &  ","   ☺    &   ","  ‼     &   "," ☺     &    ","‼      &    ","      &     ","      &     ","     &   ░  ","     &   ▒  ","    &    ▓  ","    &    £  ","   &    ░£  ","   &    ▒£  ","  &     ▓£  ","  &     ££  "," &     ░££  "," &     ▒££  ","&      ▓££  ","&      £££  ","      ░£££  ","      ▒£££  ","      ▓£££  ","      █£££  ","     ░█£££  ","     ▒█£££  ","     ▓█£££  ","     ██£££  ","    ░██£££  ","    ▒██£££  ","    ▓██£££  ","    ███£££  ","   ░███£££  ","   ▒███£££  ","   ▓███£££  ","   ████£££  ","  ░████£££  ","  ▒████£££  ","  ▓████£££  ","  █████£££  "," ░█████£££  "," ▒█████£££  "," ▓█████£££  "," ██████£££  "," ██████£££  "]}}');

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/node module decorator */
/******/ (() => {
/******/ 	__nccwpck_require__.nmd = (module) => {
/******/ 		module.paths = [];
/******/ 		if (!module.children) module.children = [];
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/yoctocolors-cjs/index.js
var yoctocolors_cjs = __nccwpck_require__(88);
;// CONCATENATED MODULE: external "node:process"
const external_node_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:process");
;// CONCATENATED MODULE: ./node_modules/@inquirer/figures/dist/esm/index.mjs
// process.env dot-notation access prints:
// Property 'TERM' comes from an index signature, so it must be accessed with ['TERM'].ts(4111)
/* eslint dot-notation: ["off"] */

// Ported from is-unicode-supported
function isUnicodeSupported() {
    if (external_node_process_namespaceObject.platform !== 'win32') {
        return external_node_process_namespaceObject.env.TERM !== 'linux'; // Linux console (kernel)
    }
    return (Boolean(external_node_process_namespaceObject.env.WT_SESSION) || // Windows Terminal
        Boolean(external_node_process_namespaceObject.env.TERMINUS_SUBLIME) || // Terminus (<0.2.27)
        external_node_process_namespaceObject.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
        external_node_process_namespaceObject.env.TERM_PROGRAM === 'Terminus-Sublime' ||
        external_node_process_namespaceObject.env.TERM_PROGRAM === 'vscode' ||
        external_node_process_namespaceObject.env.TERM === 'xterm-256color' ||
        external_node_process_namespaceObject.env.TERM === 'alacritty' ||
        external_node_process_namespaceObject.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm');
}
// Ported from figures
const common = {
    circleQuestionMark: '(?)',
    questionMarkPrefix: '(?)',
    square: '█',
    squareDarkShade: '▓',
    squareMediumShade: '▒',
    squareLightShade: '░',
    squareTop: '▀',
    squareBottom: '▄',
    squareLeft: '▌',
    squareRight: '▐',
    squareCenter: '■',
    bullet: '●',
    dot: '․',
    ellipsis: '…',
    pointerSmall: '›',
    triangleUp: '▲',
    triangleUpSmall: '▴',
    triangleDown: '▼',
    triangleDownSmall: '▾',
    triangleLeftSmall: '◂',
    triangleRightSmall: '▸',
    home: '⌂',
    heart: '♥',
    musicNote: '♪',
    musicNoteBeamed: '♫',
    arrowUp: '↑',
    arrowDown: '↓',
    arrowLeft: '←',
    arrowRight: '→',
    arrowLeftRight: '↔',
    arrowUpDown: '↕',
    almostEqual: '≈',
    notEqual: '≠',
    lessOrEqual: '≤',
    greaterOrEqual: '≥',
    identical: '≡',
    infinity: '∞',
    subscriptZero: '₀',
    subscriptOne: '₁',
    subscriptTwo: '₂',
    subscriptThree: '₃',
    subscriptFour: '₄',
    subscriptFive: '₅',
    subscriptSix: '₆',
    subscriptSeven: '₇',
    subscriptEight: '₈',
    subscriptNine: '₉',
    oneHalf: '½',
    oneThird: '⅓',
    oneQuarter: '¼',
    oneFifth: '⅕',
    oneSixth: '⅙',
    oneEighth: '⅛',
    twoThirds: '⅔',
    twoFifths: '⅖',
    threeQuarters: '¾',
    threeFifths: '⅗',
    threeEighths: '⅜',
    fourFifths: '⅘',
    fiveSixths: '⅚',
    fiveEighths: '⅝',
    sevenEighths: '⅞',
    line: '─',
    lineBold: '━',
    lineDouble: '═',
    lineDashed0: '┄',
    lineDashed1: '┅',
    lineDashed2: '┈',
    lineDashed3: '┉',
    lineDashed4: '╌',
    lineDashed5: '╍',
    lineDashed6: '╴',
    lineDashed7: '╶',
    lineDashed8: '╸',
    lineDashed9: '╺',
    lineDashed10: '╼',
    lineDashed11: '╾',
    lineDashed12: '−',
    lineDashed13: '–',
    lineDashed14: '‐',
    lineDashed15: '⁃',
    lineVertical: '│',
    lineVerticalBold: '┃',
    lineVerticalDouble: '║',
    lineVerticalDashed0: '┆',
    lineVerticalDashed1: '┇',
    lineVerticalDashed2: '┊',
    lineVerticalDashed3: '┋',
    lineVerticalDashed4: '╎',
    lineVerticalDashed5: '╏',
    lineVerticalDashed6: '╵',
    lineVerticalDashed7: '╷',
    lineVerticalDashed8: '╹',
    lineVerticalDashed9: '╻',
    lineVerticalDashed10: '╽',
    lineVerticalDashed11: '╿',
    lineDownLeft: '┐',
    lineDownLeftArc: '╮',
    lineDownBoldLeftBold: '┓',
    lineDownBoldLeft: '┒',
    lineDownLeftBold: '┑',
    lineDownDoubleLeftDouble: '╗',
    lineDownDoubleLeft: '╖',
    lineDownLeftDouble: '╕',
    lineDownRight: '┌',
    lineDownRightArc: '╭',
    lineDownBoldRightBold: '┏',
    lineDownBoldRight: '┎',
    lineDownRightBold: '┍',
    lineDownDoubleRightDouble: '╔',
    lineDownDoubleRight: '╓',
    lineDownRightDouble: '╒',
    lineUpLeft: '┘',
    lineUpLeftArc: '╯',
    lineUpBoldLeftBold: '┛',
    lineUpBoldLeft: '┚',
    lineUpLeftBold: '┙',
    lineUpDoubleLeftDouble: '╝',
    lineUpDoubleLeft: '╜',
    lineUpLeftDouble: '╛',
    lineUpRight: '└',
    lineUpRightArc: '╰',
    lineUpBoldRightBold: '┗',
    lineUpBoldRight: '┖',
    lineUpRightBold: '┕',
    lineUpDoubleRightDouble: '╚',
    lineUpDoubleRight: '╙',
    lineUpRightDouble: '╘',
    lineUpDownLeft: '┤',
    lineUpBoldDownBoldLeftBold: '┫',
    lineUpBoldDownBoldLeft: '┨',
    lineUpDownLeftBold: '┥',
    lineUpBoldDownLeftBold: '┩',
    lineUpDownBoldLeftBold: '┪',
    lineUpDownBoldLeft: '┧',
    lineUpBoldDownLeft: '┦',
    lineUpDoubleDownDoubleLeftDouble: '╣',
    lineUpDoubleDownDoubleLeft: '╢',
    lineUpDownLeftDouble: '╡',
    lineUpDownRight: '├',
    lineUpBoldDownBoldRightBold: '┣',
    lineUpBoldDownBoldRight: '┠',
    lineUpDownRightBold: '┝',
    lineUpBoldDownRightBold: '┡',
    lineUpDownBoldRightBold: '┢',
    lineUpDownBoldRight: '┟',
    lineUpBoldDownRight: '┞',
    lineUpDoubleDownDoubleRightDouble: '╠',
    lineUpDoubleDownDoubleRight: '╟',
    lineUpDownRightDouble: '╞',
    lineDownLeftRight: '┬',
    lineDownBoldLeftBoldRightBold: '┳',
    lineDownLeftBoldRightBold: '┯',
    lineDownBoldLeftRight: '┰',
    lineDownBoldLeftBoldRight: '┱',
    lineDownBoldLeftRightBold: '┲',
    lineDownLeftRightBold: '┮',
    lineDownLeftBoldRight: '┭',
    lineDownDoubleLeftDoubleRightDouble: '╦',
    lineDownDoubleLeftRight: '╥',
    lineDownLeftDoubleRightDouble: '╤',
    lineUpLeftRight: '┴',
    lineUpBoldLeftBoldRightBold: '┻',
    lineUpLeftBoldRightBold: '┷',
    lineUpBoldLeftRight: '┸',
    lineUpBoldLeftBoldRight: '┹',
    lineUpBoldLeftRightBold: '┺',
    lineUpLeftRightBold: '┶',
    lineUpLeftBoldRight: '┵',
    lineUpDoubleLeftDoubleRightDouble: '╩',
    lineUpDoubleLeftRight: '╨',
    lineUpLeftDoubleRightDouble: '╧',
    lineUpDownLeftRight: '┼',
    lineUpBoldDownBoldLeftBoldRightBold: '╋',
    lineUpDownBoldLeftBoldRightBold: '╈',
    lineUpBoldDownLeftBoldRightBold: '╇',
    lineUpBoldDownBoldLeftRightBold: '╊',
    lineUpBoldDownBoldLeftBoldRight: '╉',
    lineUpBoldDownLeftRight: '╀',
    lineUpDownBoldLeftRight: '╁',
    lineUpDownLeftBoldRight: '┽',
    lineUpDownLeftRightBold: '┾',
    lineUpBoldDownBoldLeftRight: '╂',
    lineUpDownLeftBoldRightBold: '┿',
    lineUpBoldDownLeftBoldRight: '╃',
    lineUpBoldDownLeftRightBold: '╄',
    lineUpDownBoldLeftBoldRight: '╅',
    lineUpDownBoldLeftRightBold: '╆',
    lineUpDoubleDownDoubleLeftDoubleRightDouble: '╬',
    lineUpDoubleDownDoubleLeftRight: '╫',
    lineUpDownLeftDoubleRightDouble: '╪',
    lineCross: '╳',
    lineBackslash: '╲',
    lineSlash: '╱',
};
const specialMainSymbols = {
    tick: '✔',
    info: 'ℹ',
    warning: '⚠',
    cross: '✘',
    squareSmall: '◻',
    squareSmallFilled: '◼',
    circle: '◯',
    circleFilled: '◉',
    circleDotted: '◌',
    circleDouble: '◎',
    circleCircle: 'ⓞ',
    circleCross: 'ⓧ',
    circlePipe: 'Ⓘ',
    radioOn: '◉',
    radioOff: '◯',
    checkboxOn: '☒',
    checkboxOff: '☐',
    checkboxCircleOn: 'ⓧ',
    checkboxCircleOff: 'Ⓘ',
    pointer: '❯',
    triangleUpOutline: '△',
    triangleLeft: '◀',
    triangleRight: '▶',
    lozenge: '◆',
    lozengeOutline: '◇',
    hamburger: '☰',
    smiley: '㋡',
    mustache: '෴',
    star: '★',
    play: '▶',
    nodejs: '⬢',
    oneSeventh: '⅐',
    oneNinth: '⅑',
    oneTenth: '⅒',
};
const specialFallbackSymbols = {
    tick: '√',
    info: 'i',
    warning: '‼',
    cross: '×',
    squareSmall: '□',
    squareSmallFilled: '■',
    circle: '( )',
    circleFilled: '(*)',
    circleDotted: '( )',
    circleDouble: '( )',
    circleCircle: '(○)',
    circleCross: '(×)',
    circlePipe: '(│)',
    radioOn: '(*)',
    radioOff: '( )',
    checkboxOn: '[×]',
    checkboxOff: '[ ]',
    checkboxCircleOn: '(×)',
    checkboxCircleOff: '( )',
    pointer: '>',
    triangleUpOutline: '∆',
    triangleLeft: '◄',
    triangleRight: '►',
    lozenge: '♦',
    lozengeOutline: '◊',
    hamburger: '≡',
    smiley: '☺',
    mustache: '┌─┐',
    star: '✶',
    play: '►',
    nodejs: '♦',
    oneSeventh: '1/7',
    oneNinth: '1/9',
    oneTenth: '1/10',
};
const mainSymbols = { ...common, ...specialMainSymbols };
const fallbackSymbols = {
    ...common,
    ...specialFallbackSymbols,
};
const shouldUseMain = isUnicodeSupported();
const figures = shouldUseMain ? mainSymbols : fallbackSymbols;
/* harmony default export */ const esm = (figures);
const replacements = Object.entries(specialMainSymbols);
// On terminals which do not support Unicode symbols, substitute them to other symbols
const replaceSymbols = (string, { useFallback = !shouldUseMain } = {}) => {
    if (useFallback) {
        for (const [key, mainSymbol] of replacements) {
            const fallbackSymbol = fallbackSymbols[key];
            if (!fallbackSymbol) {
                throw new Error(`Unable to find fallback for ${key}`);
            }
            string = string.replaceAll(mainSymbol, fallbackSymbol);
        }
    }
    return string;
};

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/Separator.mjs


/**
 * Separator object
 * Used to space/separate choices group
 */
class Separator {
    separator = yoctocolors_cjs.dim(Array.from({ length: 15 }).join(esm.line));
    type = 'separator';
    constructor(separator) {
        if (separator) {
            this.separator = separator;
        }
    }
    static isSeparator(choice) {
        return Boolean(choice && choice.type === 'separator');
    }
}

;// CONCATENATED MODULE: external "node:readline"
const external_node_readline_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:readline");
;// CONCATENATED MODULE: external "node:async_hooks"
const external_node_async_hooks_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:async_hooks");
;// CONCATENATED MODULE: ./node_modules/@inquirer/type/dist/esm/inquirer.mjs
class CancelablePromise extends Promise {
    cancel = () => { };
}

// EXTERNAL MODULE: ./node_modules/mute-stream/lib/index.js
var lib = __nccwpck_require__(533);
;// CONCATENATED MODULE: ./node_modules/signal-exit/dist/mjs/signals.js
/**
 * This is not the set of all possible signals.
 *
 * It IS, however, the set of all signals that trigger
 * an exit on either Linux or BSD systems.  Linux is a
 * superset of the signal names supported on BSD, and
 * the unknown signals just fail to register, so we can
 * catch that easily enough.
 *
 * Windows signals are a different set, since there are
 * signals that terminate Windows processes, but don't
 * terminate (or don't even exist) on Posix systems.
 *
 * Don't bother with SIGKILL.  It's uncatchable, which
 * means that we can't fire any callbacks anyway.
 *
 * If a user does happen to register a handler on a non-
 * fatal signal like SIGWINCH or something, and then
 * exit, it'll end up firing `process.emit('exit')`, so
 * the handler will be fired anyway.
 *
 * SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
 * artificially, inherently leave the process in a
 * state from which it is not safe to try and enter JS
 * listeners.
 */
const signals = [];
signals.push('SIGHUP', 'SIGINT', 'SIGTERM');
if (process.platform !== 'win32') {
    signals.push('SIGALRM', 'SIGABRT', 'SIGVTALRM', 'SIGXCPU', 'SIGXFSZ', 'SIGUSR2', 'SIGTRAP', 'SIGSYS', 'SIGQUIT', 'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
    );
}
if (process.platform === 'linux') {
    signals.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT');
}
//# sourceMappingURL=signals.js.map
;// CONCATENATED MODULE: ./node_modules/signal-exit/dist/mjs/index.js
// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
// grab a reference to node's real process object right away


const processOk = (process) => !!process &&
    typeof process === 'object' &&
    typeof process.removeListener === 'function' &&
    typeof process.emit === 'function' &&
    typeof process.reallyExit === 'function' &&
    typeof process.listeners === 'function' &&
    typeof process.kill === 'function' &&
    typeof process.pid === 'number' &&
    typeof process.on === 'function';
const kExitEmitter = Symbol.for('signal-exit emitter');
const global = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);
// teeny special purpose ee
class Emitter {
    emitted = {
        afterExit: false,
        exit: false,
    };
    listeners = {
        afterExit: [],
        exit: [],
    };
    count = 0;
    id = Math.random();
    constructor() {
        if (global[kExitEmitter]) {
            return global[kExitEmitter];
        }
        ObjectDefineProperty(global, kExitEmitter, {
            value: this,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    }
    on(ev, fn) {
        this.listeners[ev].push(fn);
    }
    removeListener(ev, fn) {
        const list = this.listeners[ev];
        const i = list.indexOf(fn);
        /* c8 ignore start */
        if (i === -1) {
            return;
        }
        /* c8 ignore stop */
        if (i === 0 && list.length === 1) {
            list.length = 0;
        }
        else {
            list.splice(i, 1);
        }
    }
    emit(ev, code, signal) {
        if (this.emitted[ev]) {
            return false;
        }
        this.emitted[ev] = true;
        let ret = false;
        for (const fn of this.listeners[ev]) {
            ret = fn(code, signal) === true || ret;
        }
        if (ev === 'exit') {
            ret = this.emit('afterExit', code, signal) || ret;
        }
        return ret;
    }
}
class SignalExitBase {
}
const signalExitWrap = (handler) => {
    return {
        onExit(cb, opts) {
            return handler.onExit(cb, opts);
        },
        load() {
            return handler.load();
        },
        unload() {
            return handler.unload();
        },
    };
};
class SignalExitFallback extends SignalExitBase {
    onExit() {
        return () => { };
    }
    load() { }
    unload() { }
}
class SignalExit extends SignalExitBase {
    // "SIGHUP" throws an `ENOSYS` error on Windows,
    // so use a supported signal instead
    /* c8 ignore start */
    #hupSig = mjs_process.platform === 'win32' ? 'SIGINT' : 'SIGHUP';
    /* c8 ignore stop */
    #emitter = new Emitter();
    #process;
    #originalProcessEmit;
    #originalProcessReallyExit;
    #sigListeners = {};
    #loaded = false;
    constructor(process) {
        super();
        this.#process = process;
        // { <signal>: <listener fn>, ... }
        this.#sigListeners = {};
        for (const sig of signals) {
            this.#sigListeners[sig] = () => {
                // If there are no other listeners, an exit is coming!
                // Simplest way: remove us and then re-send the signal.
                // We know that this will kill the process, so we can
                // safely emit now.
                const listeners = this.#process.listeners(sig);
                let { count } = this.#emitter;
                // This is a workaround for the fact that signal-exit v3 and signal
                // exit v4 are not aware of each other, and each will attempt to let
                // the other handle it, so neither of them do. To correct this, we
                // detect if we're the only handler *except* for previous versions
                // of signal-exit, and increment by the count of listeners it has
                // created.
                /* c8 ignore start */
                const p = process;
                if (typeof p.__signal_exit_emitter__ === 'object' &&
                    typeof p.__signal_exit_emitter__.count === 'number') {
                    count += p.__signal_exit_emitter__.count;
                }
                /* c8 ignore stop */
                if (listeners.length === count) {
                    this.unload();
                    const ret = this.#emitter.emit('exit', null, sig);
                    /* c8 ignore start */
                    const s = sig === 'SIGHUP' ? this.#hupSig : sig;
                    if (!ret)
                        process.kill(process.pid, s);
                    /* c8 ignore stop */
                }
            };
        }
        this.#originalProcessReallyExit = process.reallyExit;
        this.#originalProcessEmit = process.emit;
    }
    onExit(cb, opts) {
        /* c8 ignore start */
        if (!processOk(this.#process)) {
            return () => { };
        }
        /* c8 ignore stop */
        if (this.#loaded === false) {
            this.load();
        }
        const ev = opts?.alwaysLast ? 'afterExit' : 'exit';
        this.#emitter.on(ev, cb);
        return () => {
            this.#emitter.removeListener(ev, cb);
            if (this.#emitter.listeners['exit'].length === 0 &&
                this.#emitter.listeners['afterExit'].length === 0) {
                this.unload();
            }
        };
    }
    load() {
        if (this.#loaded) {
            return;
        }
        this.#loaded = true;
        // This is the number of onSignalExit's that are in play.
        // It's important so that we can count the correct number of
        // listeners on signals, and don't wait for the other one to
        // handle it instead of us.
        this.#emitter.count += 1;
        for (const sig of signals) {
            try {
                const fn = this.#sigListeners[sig];
                if (fn)
                    this.#process.on(sig, fn);
            }
            catch (_) { }
        }
        this.#process.emit = (ev, ...a) => {
            return this.#processEmit(ev, ...a);
        };
        this.#process.reallyExit = (code) => {
            return this.#processReallyExit(code);
        };
    }
    unload() {
        if (!this.#loaded) {
            return;
        }
        this.#loaded = false;
        signals.forEach(sig => {
            const listener = this.#sigListeners[sig];
            /* c8 ignore start */
            if (!listener) {
                throw new Error('Listener not defined for signal: ' + sig);
            }
            /* c8 ignore stop */
            try {
                this.#process.removeListener(sig, listener);
                /* c8 ignore start */
            }
            catch (_) { }
            /* c8 ignore stop */
        });
        this.#process.emit = this.#originalProcessEmit;
        this.#process.reallyExit = this.#originalProcessReallyExit;
        this.#emitter.count -= 1;
    }
    #processReallyExit(code) {
        /* c8 ignore start */
        if (!processOk(this.#process)) {
            return 0;
        }
        this.#process.exitCode = code || 0;
        /* c8 ignore stop */
        this.#emitter.emit('exit', this.#process.exitCode, null);
        return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
    }
    #processEmit(ev, ...args) {
        const og = this.#originalProcessEmit;
        if (ev === 'exit' && processOk(this.#process)) {
            if (typeof args[0] === 'number') {
                this.#process.exitCode = args[0];
                /* c8 ignore start */
            }
            /* c8 ignore start */
            const ret = og.call(this.#process, ev, ...args);
            /* c8 ignore start */
            this.#emitter.emit('exit', this.#process.exitCode, null);
            /* c8 ignore stop */
            return ret;
        }
        else {
            return og.call(this.#process, ev, ...args);
        }
    }
}
const mjs_process = globalThis.process;
// wrap so that we call the method on the actual handler, without
// exporting it directly.
const { 
/**
 * Called when the process is exiting, whether via signal, explicit
 * exit, or running out of stuff to do.
 *
 * If the global process object is not suitable for instrumentation,
 * then this will be a no-op.
 *
 * Returns a function that may be used to unload signal-exit.
 */
onExit: mjs_onExit, 
/**
 * Load the listeners.  Likely you never need to call this, unless
 * doing a rather deep integration with signal-exit functionality.
 * Mostly exposed for the benefit of testing.
 *
 * @internal
 */
load, 
/**
 * Unload the listeners.  Likely you never need to call this, unless
 * doing a rather deep integration with signal-exit functionality.
 * Mostly exposed for the benefit of testing.
 *
 * @internal
 */
unload, } = signalExitWrap(processOk(mjs_process) ? new SignalExit(mjs_process) : new SignalExitFallback());
//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ./node_modules/strip-ansi/index.js
var strip_ansi = __nccwpck_require__(591);
// EXTERNAL MODULE: ./node_modules/ansi-escapes/index.js
var ansi_escapes = __nccwpck_require__(512);
// EXTERNAL MODULE: ./node_modules/cli-width/index.js
var cli_width = __nccwpck_require__(455);
// EXTERNAL MODULE: ./node_modules/wrap-ansi/index.js
var wrap_ansi = __nccwpck_require__(824);
;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/errors.mjs
class CancelPromptError extends Error {
    name = 'CancelPromptError';
    message = 'Prompt was canceled';
}
class ExitPromptError extends Error {
    name = 'ExitPromptError';
}
class HookError extends Error {
    name = 'HookError';
}
class ValidationError extends Error {
    name = 'ValidationError';
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/hook-engine.mjs
/* eslint @typescript-eslint/no-explicit-any: ["off"] */


const hookStorage = new external_node_async_hooks_namespaceObject.AsyncLocalStorage();
function createStore(rl) {
    const store = {
        rl,
        hooks: [],
        hooksCleanup: [],
        hooksEffect: [],
        index: 0,
        handleChange() { },
    };
    return store;
}
// Run callback in with the hook engine setup.
function withHooks(rl, cb) {
    const store = createStore(rl);
    return hookStorage.run(store, () => {
        function cycle(render) {
            store.handleChange = () => {
                store.index = 0;
                render();
            };
            store.handleChange();
        }
        cb(cycle);
    });
}
// Safe getStore utility that'll return the store or throw if undefined.
function getStore() {
    const store = hookStorage.getStore();
    if (!store) {
        throw new HookError('[Inquirer] Hook functions can only be called from within a prompt');
    }
    return store;
}
function readline() {
    return getStore().rl;
}
// Merge state updates happening within the callback function to avoid multiple renders.
function withUpdates(fn) {
    const wrapped = (...args) => {
        const store = getStore();
        let shouldUpdate = false;
        const oldHandleChange = store.handleChange;
        store.handleChange = () => {
            shouldUpdate = true;
        };
        const returnValue = fn(...args);
        if (shouldUpdate) {
            oldHandleChange();
        }
        store.handleChange = oldHandleChange;
        return returnValue;
    };
    return external_node_async_hooks_namespaceObject.AsyncResource.bind(wrapped);
}
function withPointer(cb) {
    const store = getStore();
    const { index } = store;
    const pointer = {
        get() {
            return store.hooks[index];
        },
        set(value) {
            store.hooks[index] = value;
        },
        initialized: index in store.hooks,
    };
    const returnValue = cb(pointer);
    store.index++;
    return returnValue;
}
function handleChange() {
    getStore().handleChange();
}
const effectScheduler = {
    queue(cb) {
        const store = getStore();
        const { index } = store;
        store.hooksEffect.push(() => {
            store.hooksCleanup[index]?.();
            const cleanFn = cb(readline());
            if (cleanFn != null && typeof cleanFn !== 'function') {
                throw new ValidationError('useEffect return value must be a cleanup function or nothing.');
            }
            store.hooksCleanup[index] = cleanFn;
        });
    },
    run() {
        const store = getStore();
        withUpdates(() => {
            store.hooksEffect.forEach((effect) => {
                effect();
            });
            // Warning: Clean the hooks before exiting the `withUpdates` block.
            // Failure to do so means an updates would hit the same effects again.
            store.hooksEffect.length = 0;
        })();
    },
    clearAll() {
        const store = getStore();
        store.hooksCleanup.forEach((cleanFn) => {
            cleanFn?.();
        });
        store.hooksEffect.length = 0;
        store.hooksCleanup.length = 0;
    },
};

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/utils.mjs



/**
 * Force line returns at specific width. This function is ANSI code friendly and it'll
 * ignore invisible codes during width calculation.
 * @param {string} content
 * @param {number} width
 * @return {string}
 */
function breakLines(content, width) {
    return content
        .split('\n')
        .flatMap((line) => wrap_ansi(line, width, { trim: false, hard: true })
        .split('\n')
        .map((str) => str.trimEnd()))
        .join('\n');
}
/**
 * Returns the width of the active readline, or 80 as default value.
 * @returns {number}
 */
function readlineWidth() {
    return cli_width({ defaultWidth: 80, output: readline().output });
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/screen-manager.mjs



const height = (content) => content.split('\n').length;
const lastLine = (content) => content.split('\n').pop() ?? '';
function cursorDown(n) {
    return n > 0 ? ansi_escapes.cursorDown(n) : '';
}
class ScreenManager {
    rl;
    // These variables are keeping information to allow correct prompt re-rendering
    height = 0;
    extraLinesUnderPrompt = 0;
    cursorPos;
    constructor(rl) {
        this.rl = rl;
        this.rl = rl;
        this.cursorPos = rl.getCursorPos();
    }
    write(content) {
        this.rl.output.unmute();
        this.rl.output.write(content);
        this.rl.output.mute();
    }
    render(content, bottomContent = '') {
        // Write message to screen and setPrompt to control backspace
        const promptLine = lastLine(content);
        const rawPromptLine = strip_ansi(promptLine);
        // Remove the rl.line from our prompt. We can't rely on the content of
        // rl.line (mainly because of the password prompt), so just rely on it's
        // length.
        let prompt = rawPromptLine;
        if (this.rl.line.length > 0) {
            prompt = prompt.slice(0, -this.rl.line.length);
        }
        this.rl.setPrompt(prompt);
        // SetPrompt will change cursor position, now we can get correct value
        this.cursorPos = this.rl.getCursorPos();
        const width = readlineWidth();
        content = breakLines(content, width);
        bottomContent = breakLines(bottomContent, width);
        // Manually insert an extra line if we're at the end of the line.
        // This prevent the cursor from appearing at the beginning of the
        // current line.
        if (rawPromptLine.length % width === 0) {
            content += '\n';
        }
        let output = content + (bottomContent ? '\n' + bottomContent : '');
        /**
         * Re-adjust the cursor at the correct position.
         */
        // We need to consider parts of the prompt under the cursor as part of the bottom
        // content in order to correctly cleanup and re-render.
        const promptLineUpDiff = Math.floor(rawPromptLine.length / width) - this.cursorPos.rows;
        const bottomContentHeight = promptLineUpDiff + (bottomContent ? height(bottomContent) : 0);
        // Return cursor to the input position (on top of the bottomContent)
        if (bottomContentHeight > 0)
            output += ansi_escapes.cursorUp(bottomContentHeight);
        // Return cursor to the initial left offset.
        output += ansi_escapes.cursorTo(this.cursorPos.cols);
        /**
         * Render and store state for future re-rendering
         */
        this.write(cursorDown(this.extraLinesUnderPrompt) +
            ansi_escapes.eraseLines(this.height) +
            output);
        this.extraLinesUnderPrompt = bottomContentHeight;
        this.height = height(output);
    }
    checkCursorPos() {
        const cursorPos = this.rl.getCursorPos();
        if (cursorPos.cols !== this.cursorPos.cols) {
            this.write(ansi_escapes.cursorTo(cursorPos.cols));
            this.cursorPos = cursorPos;
        }
    }
    done({ clearContent }) {
        this.rl.setPrompt('');
        let output = cursorDown(this.extraLinesUnderPrompt);
        output += clearContent ? ansi_escapes.eraseLines(this.height) : '\n';
        output += ansi_escapes.cursorShow;
        this.write(output);
        this.rl.close();
    }
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/create-prompt.mjs








function createPrompt(view) {
    const prompt = (config, context) => {
        // Default `input` to stdin
        const input = context?.input ?? process.stdin;
        // Add mute capabilities to the output
        const output = new lib();
        output.pipe(context?.output ?? process.stdout);
        const rl = external_node_readline_namespaceObject.createInterface({
            terminal: true,
            input,
            output,
        });
        const screen = new ScreenManager(rl);
        let cancel = () => { };
        const answer = new CancelablePromise((resolve, reject) => {
            withHooks(rl, (cycle) => {
                function checkCursorPos() {
                    screen.checkCursorPos();
                }
                const removeExitListener = mjs_onExit((code, signal) => {
                    onExit();
                    reject(new ExitPromptError(`User force closed the prompt with ${code} ${signal}`));
                });
                const hooksCleanup = external_node_async_hooks_namespaceObject.AsyncResource.bind(() => {
                    try {
                        effectScheduler.clearAll();
                    }
                    catch (error) {
                        reject(error);
                    }
                });
                function onExit() {
                    hooksCleanup();
                    screen.done({ clearContent: Boolean(context?.clearPromptOnDone) });
                    removeExitListener();
                    rl.input.removeListener('keypress', checkCursorPos);
                    rl.removeListener('close', hooksCleanup);
                    output.end();
                }
                cancel = () => {
                    onExit();
                    reject(new CancelPromptError());
                };
                function done(value) {
                    // Delay execution to let time to the hookCleanup functions to registers.
                    setImmediate(() => {
                        onExit();
                        // Finally we resolve our promise
                        resolve(value);
                    });
                }
                cycle(() => {
                    try {
                        const nextView = view(config, done);
                        const [content, bottomContent] = typeof nextView === 'string' ? [nextView] : nextView;
                        screen.render(content, bottomContent);
                        effectScheduler.run();
                    }
                    catch (error) {
                        onExit();
                        reject(error);
                    }
                });
                // Re-renders only happen when the state change; but the readline cursor could change position
                // and that also requires a re-render (and a manual one because we mute the streams).
                // We set the listener after the initial workLoop to avoid a double render if render triggered
                // by a state change sets the cursor to the right position.
                rl.input.on('keypress', checkCursorPos);
                // The close event triggers immediately when the user press ctrl+c. SignalExit on the other hand
                // triggers after the process is done (which happens after timeouts are done triggering.)
                // We triggers the hooks cleanup phase on rl `close` so active timeouts can be cleared.
                rl.on('close', hooksCleanup);
            });
        });
        answer.cancel = cancel;
        return answer;
    };
    return prompt;
}

// EXTERNAL MODULE: ./node_modules/cli-spinners/index.js
var cli_spinners = __nccwpck_require__(31);
;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/theme.mjs


const defaultTheme = {
    prefix: yoctocolors_cjs.green('?'),
    spinner: {
        interval: cli_spinners.dots.interval,
        frames: cli_spinners.dots.frames.map((frame) => yoctocolors_cjs.yellow(frame)),
    },
    style: {
        answer: yoctocolors_cjs.cyan,
        message: yoctocolors_cjs.bold,
        error: (text) => yoctocolors_cjs.red(`> ${text}`),
        defaultAnswer: (text) => yoctocolors_cjs.dim(`(${text})`),
        help: yoctocolors_cjs.dim,
        highlight: yoctocolors_cjs.cyan,
        key: (text) => yoctocolors_cjs.cyan(yoctocolors_cjs.bold(`<${text}>`)),
    },
};

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/make-theme.mjs

function isPlainObject(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
}
function deepMerge(...objects) {
    const output = {};
    for (const obj of objects) {
        for (const [key, value] of Object.entries(obj)) {
            const prevValue = output[key];
            output[key] =
                isPlainObject(prevValue) && isPlainObject(value)
                    ? deepMerge(prevValue, value)
                    : value;
        }
    }
    return output;
}
function makeTheme(...themes) {
    const themesToMerge = [
        defaultTheme,
        ...themes.filter((theme) => theme != null),
    ];
    return deepMerge(...themesToMerge);
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/use-state.mjs

function useState(defaultValue) {
    return withPointer((pointer) => {
        const setFn = (newValue) => {
            // Noop if the value is still the same.
            if (pointer.get() !== newValue) {
                pointer.set(newValue);
                // Trigger re-render
                handleChange();
            }
        };
        if (pointer.initialized) {
            return [pointer.get(), setFn];
        }
        const value = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        pointer.set(value);
        return [value, setFn];
    });
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/use-effect.mjs

function useEffect(cb, depArray) {
    withPointer((pointer) => {
        const oldDeps = pointer.get();
        const hasChanged = !Array.isArray(oldDeps) || depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
        if (hasChanged) {
            effectScheduler.queue(cb);
        }
        pointer.set(depArray);
    });
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/use-prefix.mjs




function usePrefix({ isLoading = false, theme, }) {
    const [showLoader, setShowLoader] = useState(false);
    const [tick, setTick] = useState(0);
    const { prefix, spinner } = makeTheme(theme);
    useEffect(() => {
        if (isLoading) {
            let tickInterval;
            let inc = -1;
            // Delay displaying spinner by 300ms, to avoid flickering
            const delayTimeout = setTimeout(external_node_async_hooks_namespaceObject.AsyncResource.bind(() => {
                setShowLoader(true);
                tickInterval = setInterval(external_node_async_hooks_namespaceObject.AsyncResource.bind(() => {
                    inc = inc + 1;
                    setTick(inc % spinner.frames.length);
                }), spinner.interval);
            }), 300);
            return () => {
                clearTimeout(delayTimeout);
                clearInterval(tickInterval);
            };
        }
        else {
            setShowLoader(false);
        }
    }, [isLoading]);
    if (showLoader) {
        return spinner.frames[tick];
    }
    return prefix;
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/use-ref.mjs

function useRef(val) {
    return useState({ current: val })[0];
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/use-memo.mjs

function useMemo(fn, dependencies) {
    return withPointer((pointer) => {
        const prev = pointer.get();
        if (!prev ||
            prev.dependencies.length !== dependencies.length ||
            prev.dependencies.some((dep, i) => dep !== dependencies[i])) {
            const value = fn();
            pointer.set({ value, dependencies });
            return value;
        }
        return prev.value;
    });
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/use-keypress.mjs



function useKeypress(userHandler) {
    const signal = useRef(userHandler);
    signal.current = userHandler;
    useEffect((rl) => {
        let ignore = false;
        const handler = withUpdates((_input, event) => {
            if (ignore)
                return;
            void signal.current(event, rl);
        });
        rl.input.on('keypress', handler);
        return () => {
            ignore = true;
            rl.input.removeListener('keypress', handler);
        };
    }, []);
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/key.mjs
const isUpKey = (key) => 
// The up key
key.name === 'up' ||
    // Vim keybinding
    key.name === 'k' ||
    // Emacs keybinding
    (key.ctrl && key.name === 'p');
const isDownKey = (key) => 
// The down key
key.name === 'down' ||
    // Vim keybinding
    key.name === 'j' ||
    // Emacs keybinding
    (key.ctrl && key.name === 'n');
const isSpaceKey = (key) => key.name === 'space';
const isBackspaceKey = (key) => key.name === 'backspace';
const isNumberKey = (key) => '123456789'.includes(key.name);
const isEnterKey = (key) => key.name === 'enter' || key.name === 'return';

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/pagination/lines.mjs

function split(content, width) {
    return breakLines(content, width).split('\n');
}
/**
 * Rotates an array of items by an integer number of positions.
 * @param {number} count The number of positions to rotate by
 * @param {T[]} items The items to rotate
 */
function rotate(count, items) {
    const max = items.length;
    const offset = ((count % max) + max) % max;
    return [...items.slice(offset), ...items.slice(0, offset)];
}
/**
 * Renders a page of items as lines that fit within the given width ensuring
 * that the number of lines is not greater than the page size, and the active
 * item renders at the provided position, while prioritizing that as many lines
 * of the active item get rendered as possible.
 */
function lines({ items, width, renderItem, active, position: requested, pageSize, }) {
    const layouts = items.map((item, index) => ({
        item,
        index,
        isActive: index === active,
    }));
    const layoutsInPage = rotate(active - requested, layouts).slice(0, pageSize);
    const renderItemAt = (index) => layoutsInPage[index] == null ? [] : split(renderItem(layoutsInPage[index]), width);
    // Create a blank array of lines for the page
    const pageBuffer = Array.from({ length: pageSize });
    // Render the active item to decide the position
    const activeItem = renderItemAt(requested).slice(0, pageSize);
    const position = requested + activeItem.length <= pageSize ? requested : pageSize - activeItem.length;
    // Add the lines of the active item into the page
    pageBuffer.splice(position, activeItem.length, ...activeItem);
    // Fill the page under the active item
    let bufferPointer = position + activeItem.length;
    let layoutPointer = requested + 1;
    while (bufferPointer < pageSize && layoutPointer < layoutsInPage.length) {
        for (const line of renderItemAt(layoutPointer)) {
            pageBuffer[bufferPointer++] = line;
            if (bufferPointer >= pageSize)
                break;
        }
        layoutPointer++;
    }
    // Fill the page over the active item
    bufferPointer = position - 1;
    layoutPointer = requested - 1;
    while (bufferPointer >= 0 && layoutPointer >= 0) {
        for (const line of renderItemAt(layoutPointer).reverse()) {
            pageBuffer[bufferPointer--] = line;
            if (bufferPointer < 0)
                break;
        }
        layoutPointer--;
    }
    return pageBuffer.filter((line) => typeof line === 'string');
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/pagination/position.mjs
/**
 * Creates the next position for the active item considering a finite list of
 * items to be rendered on a page.
 */
function finite({ active, pageSize, total, }) {
    const middle = Math.floor(pageSize / 2);
    if (total <= pageSize || active < middle)
        return active;
    if (active >= total - middle)
        return active + pageSize - total;
    return middle;
}
/**
 * Creates the next position for the active item considering an infinitely
 * looping list of items to be rendered on the page.
 */
function infinite({ active, lastActive, total, pageSize, pointer, }) {
    if (total <= pageSize)
        return active;
    // Move the position only when the user moves down, and when the
    // navigation fits within a single page
    if (lastActive < active && active - lastActive < pageSize) {
        // Limit it to the middle of the list
        return Math.min(Math.floor(pageSize / 2), pointer + active - lastActive);
    }
    return pointer;
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/core/dist/esm/lib/pagination/use-pagination.mjs




function usePagination({ items, active, renderItem, pageSize, loop = true, }) {
    const state = useRef({ position: 0, lastActive: 0 });
    const position = loop
        ? infinite({
            active,
            lastActive: state.current.lastActive,
            total: items.length,
            pageSize,
            pointer: state.current.position,
        })
        : finite({
            active,
            total: items.length,
            pageSize,
        });
    state.current.position = position;
    state.current.lastActive = active;
    return lines({
        items,
        width: readlineWidth(),
        renderItem,
        active,
        position,
        pageSize,
    }).join('\n');
}

;// CONCATENATED MODULE: ./node_modules/@inquirer/checkbox/dist/esm/index.mjs




const checkboxTheme = {
    icon: {
        checked: yoctocolors_cjs.green(esm.circleFilled),
        unchecked: esm.circle,
        cursor: esm.pointer,
    },
    style: {
        disabledChoice: (text) => yoctocolors_cjs.dim(`- ${text}`),
        renderSelectedChoices: (selectedChoices) => selectedChoices
            .map((choice) => choice.short ?? choice.name ?? choice.value)
            .join(', '),
    },
    helpMode: 'auto',
};
function isSelectable(item) {
    return !Separator.isSeparator(item) && !item.disabled;
}
function isChecked(item) {
    return isSelectable(item) && Boolean(item.checked);
}
function toggle(item) {
    return isSelectable(item) ? { ...item, checked: !item.checked } : item;
}
function check(checked) {
    return function (item) {
        return isSelectable(item) ? { ...item, checked } : item;
    };
}
/* harmony default export */ const dist_esm = (createPrompt((config, done) => {
    const { instructions, pageSize = 7, loop = true, choices, required, validate = () => true, } = config;
    const theme = makeTheme(checkboxTheme, config.theme);
    const prefix = usePrefix({ theme });
    const firstRender = useRef(true);
    const [status, setStatus] = useState('pending');
    const [items, setItems] = useState(choices.map((choice) => ({ ...choice })));
    const bounds = useMemo(() => {
        const first = items.findIndex(isSelectable);
        const last = items.findLastIndex(isSelectable);
        if (first < 0) {
            throw new ValidationError('[checkbox prompt] No selectable choices. All choices are disabled.');
        }
        return { first, last };
    }, [items]);
    const [active, setActive] = useState(bounds.first);
    const [showHelpTip, setShowHelpTip] = useState(true);
    const [errorMsg, setError] = useState();
    useKeypress(async (key) => {
        if (isEnterKey(key)) {
            const selection = items.filter(isChecked);
            const isValid = await validate([...selection]);
            if (required && !items.some(isChecked)) {
                setError('At least one choice must be selected');
            }
            else if (isValid === true) {
                setStatus('done');
                done(selection.map((choice) => choice.value));
            }
            else {
                setError(isValid || 'You must select a valid value');
            }
        }
        else if (isUpKey(key) || isDownKey(key)) {
            if (loop ||
                (isUpKey(key) && active !== bounds.first) ||
                (isDownKey(key) && active !== bounds.last)) {
                const offset = isUpKey(key) ? -1 : 1;
                let next = active;
                do {
                    next = (next + offset + items.length) % items.length;
                } while (!isSelectable(items[next]));
                setActive(next);
            }
        }
        else if (isSpaceKey(key)) {
            setError(undefined);
            setShowHelpTip(false);
            setItems(items.map((choice, i) => (i === active ? toggle(choice) : choice)));
        }
        else if (key.name === 'a') {
            const selectAll = items.some((choice) => isSelectable(choice) && !choice.checked);
            setItems(items.map(check(selectAll)));
        }
        else if (key.name === 'i') {
            setItems(items.map(toggle));
        }
        else if (isNumberKey(key)) {
            // Adjust index to start at 1
            const position = Number(key.name) - 1;
            const item = items[position];
            if (item != null && isSelectable(item)) {
                setActive(position);
                setItems(items.map((choice, i) => (i === position ? toggle(choice) : choice)));
            }
        }
    });
    const message = theme.style.message(config.message);
    const page = usePagination({
        items,
        active,
        renderItem({ item, isActive }) {
            if (Separator.isSeparator(item)) {
                return ` ${item.separator}`;
            }
            const line = String(item.name || item.value);
            if (item.disabled) {
                const disabledLabel = typeof item.disabled === 'string' ? item.disabled : '(disabled)';
                return theme.style.disabledChoice(`${line} ${disabledLabel}`);
            }
            const checkbox = item.checked ? theme.icon.checked : theme.icon.unchecked;
            const color = isActive ? theme.style.highlight : (x) => x;
            const cursor = isActive ? theme.icon.cursor : ' ';
            return color(`${cursor}${checkbox} ${line}`);
        },
        pageSize,
        loop,
    });
    if (status === 'done') {
        const selection = items.filter(isChecked);
        const answer = theme.style.answer(theme.style.renderSelectedChoices(selection, items));
        return `${prefix} ${message} ${answer}`;
    }
    let helpTipTop = '';
    let helpTipBottom = '';
    if (theme.helpMode === 'always' ||
        (theme.helpMode === 'auto' &&
            showHelpTip &&
            (instructions === undefined || instructions))) {
        if (typeof instructions === 'string') {
            helpTipTop = instructions;
        }
        else {
            const keys = [
                `${theme.style.key('space')} to select`,
                `${theme.style.key('a')} to toggle all`,
                `${theme.style.key('i')} to invert selection`,
                `and ${theme.style.key('enter')} to proceed`,
            ];
            helpTipTop = ` (Press ${keys.join(', ')})`;
        }
        if (items.length > pageSize &&
            (theme.helpMode === 'always' ||
                (theme.helpMode === 'auto' && firstRender.current))) {
            helpTipBottom = `\n${theme.style.help('(Use arrow keys to reveal more choices)')}`;
            firstRender.current = false;
        }
    }
    let error = '';
    if (errorMsg) {
        error = `\n${theme.style.error(errorMsg)}`;
    }
    return `${prefix} ${message}${helpTipTop}\n${page}${helpTipBottom}${error}${ansi_escapes.cursorHide}`;
}));


;// CONCATENATED MODULE: ./node_modules/@inquirer/select/dist/esm/index.mjs




const selectTheme = {
    icon: { cursor: esm.pointer },
    style: {
        disabled: (text) => yoctocolors_cjs.dim(`- ${text}`),
        description: (text) => yoctocolors_cjs.cyan(text),
    },
    helpMode: 'auto',
};
function esm_isSelectable(item) {
    return !Separator.isSeparator(item) && !item.disabled;
}
/* harmony default export */ const select_dist_esm = (createPrompt((config, done) => {
    const { choices: items, loop = true, pageSize = 7 } = config;
    const firstRender = useRef(true);
    const theme = makeTheme(selectTheme, config.theme);
    const prefix = usePrefix({ theme });
    const [status, setStatus] = useState('pending');
    const searchTimeoutRef = useRef();
    const bounds = useMemo(() => {
        const first = items.findIndex(esm_isSelectable);
        const last = items.findLastIndex(esm_isSelectable);
        if (first < 0) {
            throw new ValidationError('[select prompt] No selectable choices. All choices are disabled.');
        }
        return { first, last };
    }, [items]);
    const defaultItemIndex = useMemo(() => {
        if (!('default' in config))
            return -1;
        return items.findIndex((item) => esm_isSelectable(item) && item.value === config.default);
    }, [config.default, items]);
    const [active, setActive] = useState(defaultItemIndex === -1 ? bounds.first : defaultItemIndex);
    // Safe to assume the cursor position always point to a Choice.
    const selectedChoice = items[active];
    useKeypress((key, rl) => {
        clearTimeout(searchTimeoutRef.current);
        if (isEnterKey(key)) {
            setStatus('done');
            done(selectedChoice.value);
        }
        else if (isUpKey(key) || isDownKey(key)) {
            rl.clearLine(0);
            if (loop ||
                (isUpKey(key) && active !== bounds.first) ||
                (isDownKey(key) && active !== bounds.last)) {
                const offset = isUpKey(key) ? -1 : 1;
                let next = active;
                do {
                    next = (next + offset + items.length) % items.length;
                } while (!esm_isSelectable(items[next]));
                setActive(next);
            }
        }
        else if (isNumberKey(key)) {
            rl.clearLine(0);
            const position = Number(key.name) - 1;
            const item = items[position];
            if (item != null && esm_isSelectable(item)) {
                setActive(position);
            }
        }
        else if (isBackspaceKey(key)) {
            rl.clearLine(0);
        }
        else {
            // Default to search
            const searchTerm = rl.line.toLowerCase();
            const matchIndex = items.findIndex((item) => {
                if (Separator.isSeparator(item) || !esm_isSelectable(item))
                    return false;
                return String(item.name || item.value)
                    .toLowerCase()
                    .startsWith(searchTerm);
            });
            if (matchIndex >= 0) {
                setActive(matchIndex);
            }
            searchTimeoutRef.current = setTimeout(() => {
                rl.clearLine(0);
            }, 700);
        }
    });
    useEffect(() => () => {
        clearTimeout(searchTimeoutRef.current);
    }, []);
    const message = theme.style.message(config.message);
    let helpTipTop = '';
    let helpTipBottom = '';
    if (theme.helpMode === 'always' ||
        (theme.helpMode === 'auto' && firstRender.current)) {
        firstRender.current = false;
        if (items.length > pageSize) {
            helpTipBottom = `\n${theme.style.help('(Use arrow keys to reveal more choices)')}`;
        }
        else {
            helpTipTop = theme.style.help('(Use arrow keys)');
        }
    }
    const page = usePagination({
        items,
        active,
        renderItem({ item, isActive }) {
            if (Separator.isSeparator(item)) {
                return ` ${item.separator}`;
            }
            const line = String(item.name || item.value);
            if (item.disabled) {
                const disabledLabel = typeof item.disabled === 'string' ? item.disabled : '(disabled)';
                return theme.style.disabled(`${line} ${disabledLabel}`);
            }
            const color = isActive ? theme.style.highlight : (x) => x;
            const cursor = isActive ? theme.icon.cursor : ` `;
            return color(`${cursor} ${line}`);
        },
        pageSize,
        loop,
    });
    if (status === 'done') {
        const answer = selectedChoice.short ??
            selectedChoice.name ??
            // TODO: Could we enforce that at the type level? Name should be defined for non-string values.
            String(selectedChoice.value);
        return `${prefix} ${message} ${theme.style.answer(answer)}`;
    }
    const choiceDescription = selectedChoice.description
        ? `\n${theme.style.description(selectedChoice.description)}`
        : ``;
    return `${[prefix, message, helpTipTop].filter(Boolean).join(' ')}\n${page}${helpTipBottom}${choiceDescription}${ansi_escapes.cursorHide}`;
}));


;// CONCATENATED MODULE: ./node_modules/@inquirer/input/dist/esm/index.mjs

/* harmony default export */ const input_dist_esm = (createPrompt((config, done) => {
    const { required, validate = () => true } = config;
    const theme = makeTheme(config.theme);
    const [status, setStatus] = useState('pending');
    const [defaultValue = '', setDefaultValue] = useState(config.default);
    const [errorMsg, setError] = useState();
    const [value, setValue] = useState('');
    const isLoading = status === 'loading';
    const prefix = usePrefix({ isLoading, theme });
    useKeypress(async (key, rl) => {
        // Ignore keypress while our prompt is doing other processing.
        if (status !== 'pending') {
            return;
        }
        if (isEnterKey(key)) {
            const answer = value || defaultValue;
            setStatus('loading');
            const isValid = required && !answer ? 'You must provide a value' : await validate(answer);
            if (isValid === true) {
                setValue(answer);
                setStatus('done');
                done(answer);
            }
            else {
                // Reset the readline line value to the previous value. On line event, the value
                // get cleared, forcing the user to re-enter the value instead of fixing it.
                rl.write(value);
                setError(isValid || 'You must provide a valid value');
                setStatus('pending');
            }
        }
        else if (isBackspaceKey(key) && !value) {
            setDefaultValue(undefined);
        }
        else if (key.name === 'tab' && !value) {
            setDefaultValue(undefined);
            rl.clearLine(0); // Remove the tab character.
            rl.write(defaultValue);
            setValue(defaultValue);
        }
        else {
            setValue(rl.line);
            setError(undefined);
        }
    });
    const message = theme.style.message(config.message);
    let formattedValue = value;
    if (typeof config.transformer === 'function') {
        formattedValue = config.transformer(value, { isFinal: status === 'done' });
    }
    else if (status === 'done') {
        formattedValue = theme.style.answer(value);
    }
    let defaultStr;
    if (defaultValue && status !== 'done' && !value) {
        defaultStr = theme.style.defaultAnswer(defaultValue);
    }
    let error = '';
    if (errorMsg) {
        error = theme.style.error(errorMsg);
    }
    return [
        [prefix, message, defaultStr, formattedValue]
            .filter((v) => v !== undefined)
            .join(' '),
        error,
    ];
}));

;// CONCATENATED MODULE: external "fs"
const external_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");
;// CONCATENATED MODULE: external "path"
const external_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");
;// CONCATENATED MODULE: external "os"
const external_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");
;// CONCATENATED MODULE: ./Subjects.js
const subjectsByTrack = {
  first: {
    Semester_1: [
      { en: "Math", ar: "الرياضيات" },
      { en: "English", ar: "اللغة الإنجليزية" },
      { en: "The Holy Quran and Interpretation", ar: "القرآن الكريم وتفسيره" },
      { en: "Arabic Language", ar: "كفايات لغوية" },
      { en: "Biology", ar: "علم الأحياء" },
      { en: "Digital Technology", ar: "التقنية الرقمية" },
      { en: "Critical Thinking", ar: "التفكير النقدي" },
    ],
    Semester_2: [
      { en: "Math", ar: "الرياضيات" },
      { en: "English", ar: "اللغة الإنجليزية" },
      { en: "Vocational Education", ar: "التعليم المهني" },
      { en: "Arabic Language", ar: "كفايات لغوية" },
      { en: "Physics", ar: "الفيزياء" },
      { en: "Digital Technology", ar: "التقنية الرقمية" },
      { en: "PE", ar: "التربية البدنية" },
    ],
    Semester_3: [
      { en: "Math", ar: "الرياضيات" },
      { en: "English", ar: "اللغة الإنجليزية" },
      { en: "Chemistry", ar: "الكيمياء" },
      { en: "Digital Technology", ar: "التقنية الرقمية" },
      { en: "Hadith", ar: "الحديث" },
      { en: "Financial Knowledge", ar: "المعرفة المالية" },
      { en: "PE", ar: "التربية البدنية" },
      { en: "Social Studies and History", ar: "الدراسات الاجتماعية والتاريخ" },
    ],
  },
  second: {
    general: {
      Semester_1: [
        { en: "Math", ar: "الرياضيات" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Arts", ar: "الفنون" },
        { en: "PE", ar: "التربية البدنية" },
      ],
      Semester_2: [
        { en: "Math", ar: "الرياضيات" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "History", ar: "التاريخ" },
      ],
      Semester_3: [
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Math", ar: "الرياضيات" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "Physics", ar: "الفيزياء" },
      ],
    },

    cs: {
      Semester_1: [
        { en: "Math", ar: "الرياضيات" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Engineering", ar: "الهندسة" },
        { en: "Data Science", ar: "علم البيانات" },
      ],
      Semester_2: [
        { en: "Math", ar: "الرياضيات" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "IoT", ar: "إنترنت الأشياء" },
        { en: "PE", ar: "التربية البدنية" },
      ],
      Semester_3: [
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Math", ar: "الرياضيات" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "IoT", ar: "إنترنت الأشياء" },
        { en: "Physics", ar: "الفيزياء" },
      ],
    },
    health: {
      Semester_1: [
        { en: "Math", ar: "الرياضيات" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Arts", ar: "الفنون" },
        { en: "PE", ar: "التربية البدنية" },
      ],
      Semester_2: [
        { en: "Math", ar: "الرياضيات" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "Fundamentals of Health Science", ar: "أساسيات العلوم الصحية" },
      ],
      Semester_3: [
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Chemistry", ar: "الكيمياء" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Math", ar: "الرياضيات" },
        { en: "Biology", ar: "علم الأحياء" },
        { en: "Fundamentals of Health Science", ar: "أساسيات العلوم الصحية" },
        { en: "Physics", ar: "الفيزياء" },
      ],
    },

    business: {
      Semester_1: [
        { en: "Quran Interpretation", ar: "تفسير القرآن" },
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Making Decisions in Business", ar: "اتخاذ القرارات في الأعمال" },
        { en: "Starting in Business", ar: "البدء في الأعمال" },
        { en: "Financial Management", ar: "إدارة المالية" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "PE", ar: "التربية البدنية" },
      ],
      Semester_2: [
        { en: "History", ar: "التاريخ" },
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Making Decisions in Business", ar: "اتخاذ القرارات في الأعمال" },
        { en: "Starting in Business", ar: "البدء في الأعمال" },
        { en: "Financial Management", ar: "إدارة المالية" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "English", ar: "اللغة الإنجليزية" },
      ],
      Semester_3: [
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Linguistic Studies", ar: "الدراسات اللغوية" },
        { en: "Making Decisions in Business", ar: "اتخاذ القرارات في الأعمال" },
        { en: "Fundamentals of Management", ar: "أساسيات الإدارة" },
        { en: "Arts", ar: "الفنون" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "English", ar: "اللغة الإنجليزية" },
      ],
    },

    shariah: {
      Semester_1: [
        { en: "Hadith", ar: "الحديث" },
        { en: "Holy Quran", ar: "القرآن الكريم" },
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Elective", ar: "اختياري" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "PE", ar: "التربية البدنية" },
      ],
      Semester_2: [
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Holy Quran", ar: "القرآن الكريم" },
        { en: "Elective", ar: "اختياري" },
        { en: "Arabic Language", ar: "كفايات لغوية" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "History", ar: "التاريخ" },
        { en: "English", ar: "اللغة الإنجليزية" },
      ],
      Semester_3: [
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Holy Quran", ar: "القرآن الكريم" },
        { en: "Quranic Studies", ar: "علوم القرآن" },
        { en: "Linguistic Studies", ar: "الدراسات اللغوية" },
        { en: "Quran Interpretation", ar: "تفسير القرآن" },
        { en: "Arts", ar: "الفنون" },
        { en: "English", ar: "اللغة الإنجليزية" },
      ],
    },
  },

  third: {
    general: {
      Semester_1: [
        { en: "Chemistry", ar: "الكيمياء" },
        {
          en: "Research and Information Sources",
          ar: "البحث ومصادر المعلومات",
        },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Mathematics", ar: "الرياضيات" },
        { en: "Physics", ar: "الفيزياء" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "Elective", ar: "اختياري" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_2: [
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Life Skills", ar: "مهارات الحياة" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Mathematics", ar: "الرياضيات" },
        { en: "Physics", ar: "الفيزياء" },
        { en: "Digital Citizenship", ar: "المواطنة الرقمية" },
        { en: "Earth and Space Sciences", ar: "علوم الأرض والفضاء" },
        { en: "Elective", ar: "اختياري" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_3: [
        { en: "Literary Studies", ar: "الدراسات الأدبية" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Mathematics", ar: "الرياضيات" },
        { en: "Physics", ar: "الفيزياء" },
        {
          en: "Psychological and Social Studies",
          ar: "الدراسات النفسية والاجتماعية",
        },
        { en: "Earth and Space Sciences", ar: "علوم الأرض والفضاء" },
        { en: "Elective", ar: "اختياري" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
    },
    cs: {
      Semester_1: [
        { en: "Software Engineering", ar: "هندسة البرمجيات" },
        {
          en: "Research and Information Sources",
          ar: "البحث ومصادر المعلومات",
        },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Mathematics", ar: "الرياضيات" },
        { en: "Physics", ar: "الفيزياء" },
        { en: "AI", ar: "الذكاء الاصطناعي" },
        { en: "Chemistry 3", ar: "الكيمياء 3" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_2: [
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Earth and Space Sciences", ar: "علوم الأرض والفضاء" },
        { en: "English (2-3)", ar: "اللغة الإنجليزية (2-3)" },
        { en: "Mathematics (2-3)", ar: "الرياضيات (2-3)" },
        { en: "Physics (2-3)", ar: "الفيزياء (2-3)" },
        { en: "AI", ar: "الذكاء الاصطناعي" },
        { en: "Engineering Design", ar: "تصميم هندسي" },
        { en: "Life Skills", ar: "مهارات الحياة" },
      ],
      Semester_3: [
        { en: "Project Graduation", ar: "مشروع التخرج" },
        { en: "Earth and Space Sciences", ar: "علوم الأرض والفضاء" },
        { en: "English (3-3)", ar: "اللغة الإنجليزية (3-3)" },
        { en: "Mathematics (3-3)", ar: "الرياضيات (3-3)" },
        { en: "Physics (3-3)", ar: "الفيزياء (3-3)" },
        { en: "Cybersecurity", ar: "الأمن السيبراني" },
        { en: "Literary Studies", ar: "الدراسات الأدبية" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
    },
    health: {
      Semester_1: [
        {
          en: "Research and Information Sources",
          ar: "البحث ومصادر المعلومات",
        },
        { en: "English (1-3)", ar: "اللغة الإنجليزية (1-3)" },
        { en: "Mathematics (1-3)", ar: "الرياضيات (1-3)" },
        { en: "Physics (1-3)", ar: "الفيزياء (1-3)" },
        { en: "Health Sciences (Innovation)", ar: "الأبتكار في العلوم الصحية" },
        { en: "Human Body Systems", ar: "أنظمة الجسم البشري" },
        { en: "Chemistry (3)", ar: "الكيمياء (3)" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_2: [
        { en: "Tawhid", ar: "التوحيد" },
        { en: "English (2-3)", ar: "اللغة الإنجليزية (2-3)" },
        { en: "Mathematics (2-3)", ar: "الرياضيات (2-3)" },
        { en: "Physics (2-3)", ar: "الفيزياء (2-3)" },
        { en: "Health Sciences (Innovation)", ar: "الأبتكار في العلوم الصحية" },
        { en: "Earth and Space Sciences", ar: "علوم الأرض والفضاء" },
        { en: "Engineering Design", ar: "تصميم هندسي" },
        { en: "Life Skills", ar: "مهارات الحياة" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_3: [
        { en: "Literary Studies", ar: "الدراسات الأدبية" },
        { en: "English (3-3)", ar: "اللغة الإنجليزية (3-3)" },
        { en: "Mathematics (3-3)", ar: "الرياضيات (3-3)" },
        { en: "Physics (3-3)", ar: "الفيزياء (3-3)" },
        {
          en: "Statistics (Applications in Health)",
          ar: "الإحصاء (تطبيقات في الصحة)",
        },
        { en: "Earth and Space Sciences", ar: "علوم الأرض والفضاء" },
        { en: "Project Graduation", ar: "مشروع التخرج" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
    },
    business: {
      Semester_1: [
        { en: "Literary Studies", ar: "الدراسات الأدبية" },
        {
          en: "Statistics (Applications in Business)",
          ar: "الإحصاء (تطبيقات في الأعمال)",
        },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Principles of Law", ar: "مبادئ القانون" },
        {
          en: "Research and Information Sources",
          ar: "البحث ومصادر المعلومات",
        },
        { en: "Entrepreneurship", ar: "ريادة الأعمال" },
        { en: "Geography", ar: "الجغرافيا" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_2: [
        {
          en: "Secretarial and Office Management",
          ar: "إدارة المكاتب والأمانة",
        },
        { en: "Principles of Accounting (1-1)", ar: "مبادئ المحاسبة (1-1)" },
        { en: "English (2-3)", ar: "اللغة الإنجليزية (2-3)" },
        { en: "Digital Citizenship", ar: "المواطنة الرقمية" },
        { en: "Principles of Law (2-1)", ar: "مبادئ القانون (2-1)" },
        { en: "Life Skills", ar: "مهارات الحياة" },
        { en: "Entrepreneurship (2-2)", ar: "ريادة الأعمال (2-2)" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_3: [
        {
          en: "Arabic Language - Critical Rhetoric",
          ar: "اللغة العربية - البلاغة النقدية",
        },
        { en: "Principles of Accounting (2-1)", ar: "مبادئ المحاسبة (2-1)" },
        { en: "English (3-3)", ar: "اللغة الإنجليزية (3-3)" },
        { en: "Applications in Law", ar: "تطبيقات في القانون" },
        {
          en: "Psychological and Social Studies",
          ar: "الدراسات النفسية والاجتماعية",
        },
        { en: "Project Graduation", ar: "مشروع التخرج" },
        {
          en: "Applications in Entrepreneurship",
          ar: "تطبيقات في ريادة الأعمال",
        },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
    },
    shariah: {
      Semester_1: [
        { en: "Chemistry", ar: "الكيمياء" },
        {
          en: "Research and Information Sources",
          ar: "البحث ومصادر المعلومات",
        },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Mathematics", ar: "الرياضيات" },
        { en: "Physics", ar: "الفيزياء" },
        { en: "Digital Technology", ar: "التقنية الرقمية" },
        { en: "Elective", ar: "اختياري" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_2: [
        { en: "Tawhid", ar: "التوحيد" },
        { en: "Life Skills", ar: "مهارات الحياة" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Mathematics", ar: "الرياضيات" },
        { en: "Physics", ar: "الفيزياء" },
        { en: "Digital Citizenship", ar: "المواطنة الرقمية" },
        { en: "Earth and Space Sciences", ar: "علوم الأرض والفضاء" },
        { en: "Elective", ar: "اختياري" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
      Semester_3: [
        { en: "Literary Studies", ar: "الدراسات الأدبية" },
        { en: "English", ar: "اللغة الإنجليزية" },
        { en: "Mathematics", ar: "الرياضيات" },
        { en: "Physics", ar: "الفيزياء" },
        {
          en: "Psychological and Social Studies",
          ar: "الدراسات النفسية والاجتماعية",
        },
        { en: "Earth and Space Sciences", ar: "علوم الأرض والفضاء" },
        { en: "Elective", ar: "اختياري" },
        { en: "Itqan", ar: "حصص إتقان" },
      ],
    },
  },
};

;// CONCATENATED MODULE: ./index.js







// Define subjects for each track, year, and semester

// Function to create folders
function createFolder(folderPath) {
  if (!external_fs_namespaceObject.existsSync(folderPath)) {
    external_fs_namespaceObject.mkdirSync(folderPath, { recursive: true });
    console.log(`Folder created: ${folderPath}`);
  } else {
    console.log(`Folder already exists: ${folderPath}`);
  }
}

async function getAdditionalFolders(language) {
  const folderChoices = [
    {
      name: "Projects & Research",
      value: language === 'ar' ? "المشاريع والأبحاث" : "Projects & Research",
    },
    {
      name: "Presentations",
      value: language === 'ar' ? "العروض التقديمية" : "Presentations",
    },
    {
      name: "Study Materials",
      value: language === 'ar' ? "المواد الدراسية" : "Study Materials",
    },
    {
      name: "Exams",
      value: language === 'ar' ? "الاختبارات" : "Exams",
    },
    {
      name: "General (Calendar & Deadlines, etc.)",
      value: language === 'ar' ? "عام" : "General",
    },
  ];

  return dist_esm({
    message: "Select additional folders to create:",
    choices: folderChoices,
  });
}

function getSemesterName(semester, language) {
  if (language === 'ar') {
    const arabicSemesters = ['الترم الأول', 'الترم الثاني', 'الترم الثالث'];
    return arabicSemesters[semester - 1] || `الترم ${semester}`;
  }
  return `Semester_${semester}`;
}

function createAdditionalFolders(basePath, additionalFolders, language) {
  additionalFolders.forEach(folder => {
    if (folder === "عام" || folder === "General") {
      const generalPath = external_path_namespaceObject.join(basePath, folder);
      createFolder(generalPath);
      createFolder(external_path_namespaceObject.join(generalPath, language === 'ar' ? "التقويم والمواعيد النهائية" : "Calendar & Deadlines"));
    }
  });
}

// Function to create the folder structure
function createSchoolFolders(
  baseDirectory,
  year,
  highSchoolYear,
  track,
  language,
  additionalFolders
) {
  const yearPath = external_path_namespaceObject.join(baseDirectory, year, highSchoolYear);
  createFolder(yearPath);

  const subjectsForYear = subjectsByTrack[highSchoolYear];
  const subjectsForTrack = track ? subjectsForYear[track] : subjectsForYear;

  createAdditionalFolders(yearPath, additionalFolders, language);

  Object.keys(subjectsForTrack).forEach((semester, index) => {
    const semesterPath = external_path_namespaceObject.join(yearPath, getSemesterName(index + 1, language));
    createFolder(semesterPath);

    subjectsForTrack[semester].forEach((subject) => {
      const subjectName = subject[language];
      const subjectPath = external_path_namespaceObject.join(semesterPath, subjectName.trim());
      createFolder(subjectPath);

      additionalFolders.forEach((folder) => {
        if (folder !== "عام" && folder !== "General") {
          createFolder(external_path_namespaceObject.join(subjectPath, folder));
        }
      });
    });
  });
}

function createUniversityFolders(
  baseDirectory,
  year,
  semesterCount,
  subjects,
  additionalFolders,
  language
) {
  const yearPath = external_path_namespaceObject.join(baseDirectory, year);
  createFolder(yearPath);

  createAdditionalFolders(yearPath, additionalFolders, language);

  for (let i = 1; i <= semesterCount; i++) {
    const semesterPath = external_path_namespaceObject.join(yearPath, getSemesterName(i, language));
    createFolder(semesterPath);

    subjects.forEach((subject) => {
      const subjectPath = external_path_namespaceObject.join(semesterPath, subject.trim());
      createFolder(subjectPath);

      additionalFolders.forEach((folder) => {
        if (folder !== "عام" && folder !== "General") {
          createFolder(external_path_namespaceObject.join(subjectPath, folder));
        }
      });
    });
  }
}

async function handleHighSchool() {
  const language = await select_dist_esm({
    message: "Select your folders language:",
    choices: [
      { name: "English", value: "en" },
      { name: "Arabic", value: "ar" },
    ],
  });

  const schoolYear = await input_dist_esm({
    message: "Enter the school year (e.g., 1446-1447):",
    validate: (input) => {
      const regex = /^\d{4}-\d{4}$/;
      return regex.test(input)
        ? true
        : "Please enter a valid Hijri year range (e.g., 1446-1447).";
    },
  });

  const highSchoolYear = await select_dist_esm({
    message: "What's the high school year?",
    choices: [
      { name: "Shared first year", value: "first" },
      { name: "Second year", value: "second" },
      { name: "Third year", value: "third" },
    ],
  });

  let highSchoolTrack = null;

  if (highSchoolYear === "second" || highSchoolYear === "third") {
    highSchoolTrack = await select_dist_esm({
      message: "Select high school track:",
      choices: [
        { name: "General track", value: "general" },
        { name: "Computer science and engineering", value: "cs" },
        { name: "Health and life", value: "health" },
        { name: "Business administration", value: "business" },
        { name: "Shariah track", value: "shariah" },
      ],
    });
  }

  const directory = await input_dist_esm({
    message: "Enter the base directory where folders will be created:",
    default: external_path_namespaceObject.join(external_os_namespaceObject.homedir(), "Desktop"),
  });

  const additionalFolders = await getAdditionalFolders(language);

  createSchoolFolders(
    directory,
    schoolYear,
    highSchoolYear,
    highSchoolTrack,
    language,
    additionalFolders
  );
}

async function handleUniversity() {
  const language = await select_dist_esm({
    message: "Select your folders language:",
    choices: [
      { name: "English", value: "en" },
      { name: "Arabic", value: "ar" },
    ],
  });

  const year = await input_dist_esm({
    message: "Enter the university year (e.g., 2023-2024):",
    validate: (input) => {
      const regex = /^(20\d{2})-(20\d{2})$/;
      if (!regex.test(input)) {
        return "Please enter a valid Gregorian year range (e.g., 2023-2024).";
      }
      const [startYear, endYear] = input.split("-").map(Number);
      if (endYear !== startYear + 1) {
        return "The end year should be exactly one year after the start year.";
      }
      return true;
    },
  });

  const semesterCount = await select_dist_esm({
    message: "How many semesters does your university have?",
    choices: [
      { name: "2 semesters", value: 2 },
      { name: "3 semesters", value: 3 },
    ],
  });

  const subjects = [];
  let addMore = true;

  while (addMore) {
    const subjectName = await input_dist_esm({
      message: "Enter the subject name:",
    });
    subjects.push(subjectName);

    addMore = await select_dist_esm({
      message: "Do you want to add another subject?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
    });
  }

  const directory = await input_dist_esm({
    message: "Enter the base directory where folders will be created:",
    default: external_path_namespaceObject.join(external_os_namespaceObject.homedir(), "Desktop"),
  });

  const additionalFolders = await getAdditionalFolders(language);

  createUniversityFolders(
    directory,
    year,
    semesterCount,
    subjects,
    additionalFolders,
    language
  );
}

async function run() {
  const educationType = await select_dist_esm({
    message: "What type of educational institution are you in?",
    choices: [
      { name: "University", value: "university" },
      { name: "High School", value: "school" },
    ],
  });

  if (educationType === "university") {
    await handleUniversity();
  } else {
    await handleHighSchool();
  }

  console.log("Folders created successfully.");
}

run();
})();

