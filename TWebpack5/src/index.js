import './js/main';
import './assets/scss/style.scss';
// import './assets/css/style.css';
const images = require.context("./assets/images/", true, /.*\.(jpg|jpeg|png|webp|gif|svg)$/);
const fonts = require.context("./assets/fonts/", true, /.*\.(ttf|woff|woff2|eot)$/);
const staticFiles = require.context("./static/", true, /.*\.(ico|txt|xml|csv|php)$/);
const assets = [images, fonts, staticFiles];

assets.forEach(files => {
    files.keys().forEach(key => {
        files(key);
    })
});
