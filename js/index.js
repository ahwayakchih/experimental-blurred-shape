/* global BlurShape, BLUR_SHAPES, setNormalBlur:true, setSmoothBlur:true, appendMouseMove:true */
/* exported setNormalBlur, setSmoothBlur */

const HALF = 0.5;
const FRACTIONAL_DIGITS = 2;

const content = document.getElementById('main');
const blur = new BlurShape(content);

function setNormalBlur () {
	blur.shapeUrl = BLUR_SHAPES.CIRCLE;
}

function setSmoothBlur () {
	blur.shapeUrl = BLUR_SHAPES.CIRCLE_SMOOTH;
}

function appendMouseMove () {
	content.addEventListener('mousemove', e => {
		const rect = content.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const dpr = window.devicePixelRatio;

		blur.x = ((x - (blur.width * HALF / dpr)) * dpr).toFixed(FRACTIONAL_DIGITS);
		blur.y = ((y - (blur.height * HALF / dpr)) * dpr).toFixed(FRACTIONAL_DIGITS);
	});
}

(function () {
	appendMouseMove();
})();
