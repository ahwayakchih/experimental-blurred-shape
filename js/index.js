/* global BlurShape */

const content = document.getElementById('main');
const blur = new BlurShape(content);

function normalBlur() {
   blur.shapeUrl = BLUR_SHAPES.CIRCLE;
};

function smoothBlur() {
    blur.shapeUrl = BLUR_SHAPES.CIRCLE_SMOOTH;
};

function appendMouseMove() {
	content.addEventListener('mousemove', e => {
        const rect = content.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dpr = window.devicePixelRatio;

        blur.x = ((x - (blur.width / 2 / dpr)) * dpr).toFixed(2);
        blur.y = ((y - (blur.height / 2 / dpr)) * dpr).toFixed(2);
    });
}

(function() {
    console.log(blur);
	appendMouseMove();
})();
