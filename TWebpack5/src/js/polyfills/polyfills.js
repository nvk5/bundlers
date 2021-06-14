import objectFitImages from 'object-fit-images';
import svg from 'svg4everybody';
import closest from 'element-closest';

export const polyfillsInit = () => {

    console.log('hello from polyfills');

    //SVG sprites IE
    svg();

    //Element.closest(selector) polyfill
    closest(window);

    //Object-fit IE11
    const images = document.querySelectorAll('img:not([src$=".svg"])');
    images.forEach(item => item.style.fontFamily = "'object-fit: cover'");
    objectFitImages(images);
}