/* global BlurShape:true */
/* exported BlurShape */

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 300;
const DEFAULT_X = 0;
const DEFAULT_Y = 0;

const BLUR_SHAPES = {
	CIRCLE       : 'assets/circle.svg',
	CIRCLE_SMOOTH: 'assets/circle-smooth.svg'
};

const DEFAULTS = {
	url: BLUR_SHAPES.CIRCLE,
	w  : DEFAULT_WIDTH,
	h  : DEFAULT_HEIGHT,
	x  : DEFAULT_X,
	y  : DEFAULT_Y
};

function BlurShape (element, options = {}) {
	this.id = 'BlurShape_' + Date.now();

	this.options = Object.create(DEFAULTS, options);
	this.dom = this.constructDOM(this.id, this.options);

	this._filter = document.getElementById(this.shapeID);
	this._svg = document.getElementById(this.svgID);

	this._updatingHTML = null;

	element.style.filter = 'url("#' + this.filterID + '")';
	element.style.webkitFilter = 'url("#' + this.filterID + '")';

	Object.defineProperty(this, 'x', {
		get: () => this.options.x,
		set: x => {
			this.options.x = x;
			this._filter.setAttribute('x', x);
			this.forceUpdate(element);
		}
	});

	Object.defineProperty(this, 'y', {
		get: () => this.options.y,
		set: y => {
			this.options.y = y;
			this._filter.setAttribute('y', y);
			this.forceUpdate(element);
		}
	});

	Object.defineProperty(this, 'width', {
		get: () => this.options.w,
		set: w => {
			this.options.w = w;
			this._svg.setAttribute('width', w);
			this.forceUpdate(element);
		}
	});

	Object.defineProperty(this, 'height', {
		get: () => this.options.h,
		set: h => {
			this.options.h = h;
			this._svg.setAttribute('height', h);
			this.forceUpdate(element);
		}
	});

	Object.defineProperty(this, 'shapeUrl', {
		get: () => this.options.url,
		set: shapeUrl => {
			this.options.url = shapeUrl;
			this._filter.setAttribute('xlink:href', shapeUrl);
			this.forceUpdate(element);
		}
	});
}

BlurShape.prototype.constructDOM = function constructDOM (id, options) {
	this.svgID = id + '_svg';
	this.filterID = id + '_blurFilter';
	this.shapeID = id + '_shape';

	const svg = `
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		id="${this.svgID}">
		<defs>
			<filter id="${this.filterID}" width="100%" height="100%">
				<feGaussianBlur stdDeviation="2" result="blur"/>
				<feImage id="${this.shapeID}"
					xlink:href="${options.url}"
					x="${options.x}"
					y="${options.y}"
					width="${options.w}"
					height="${options.h}"
					result="mask"/>
				<feComposite operator="in" in="blur" in2="mask" result="blurred" />
				<feComposite operator="out" in="SourceGraphic" in2="mask" result="cutout" />
				<feComposite operator="over" in="blurred" in2="cutout" result="final" />
			</filter>
		</defs>
	</svg>`;

	const dom = document.createElement('div');
	dom.setAttribute('id', id);
	dom.setAttribute('style', 'position: absolute; visibility: none; pointer-events: none');
	dom.innerHTML = svg;

	document.body.appendChild(dom);

	return dom;
};

// Chrome caches filter, so we have to enforce redraw
BlurShape.prototype.forceUpdate = function forceUpdate (element) {
	if (this._updatingHTML) {
		return;
	}

	// Element to add and remove in DOM
	// if (!this._redrawEnforcingElement) {
	// 	this._redrawEnforcingElement = document.createElement('span');
	// 	this._redrawEnforcingElement.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 1px; height: 1px; overflow: hidden; pointer-events: none;');
	// }

	// Switching between 2 IDs
	// if (!this._filterIDs) {
	//  this._filterIDs = [
	//      this.filterID,
	//      this.filterID + '_b'
	//  ];
	//  this._filterIDIndex = 0;
	// }

	if (!this._redrawEnforcingPixel) {
		this._redrawEnforcingPixel = document.createElement('div');
		this._redrawEnforcingPixel.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 1px; height: 1px; display: none; overflow: hidden; pointer-events: none;');
		element.appendChild(this._redrawEnforcingPixel);
	}

	this._updatingHTML = window.requestAnimationFrame(() => {
		this._updatingHTML = null;
		this._redrawEnforcingPixel.style.display = this._redrawEnforcingPixel.style.display === 'none' ? 'block' : 'none';

		// Adding and removing DOM element seems to be a bit slower
		// const parent = element.parentNode;
		// parent.appendChild(this._redrawEnforcingElement);
		// // Enforce recalculating by reading stuff
		// element.offsetHeight; // eslint-disable-line
		// parent.removeChild(this._redrawEnforcingElement);

		// Switching between IDs seems to be slowest in Chrome - cuts FPS in half
		// this._filterIDIndex = this._filterIDIndex ? 0 : 1;
		// const id = this._filterIDs[this._filterIDIndex];
		// this._filter.parentNode.setAttribute('id', id);
		// element.style.filter = 'url("#' + id + '")';
	});
};
