const { src, dest, parallel, series, watch } = require('gulp'),
webpack      = require('webpack-stream'),
browserSync  = require('browser-sync'),
del          = require('del'),
replace      = require('gulp-replace'),
cheerio      = require('gulp-cheerio'),
concat       = require('gulp-concat'),

//html
htmlMin      = require('gulp-htmlmin'),

//css
cleancss     = require('gulp-clean-css'),
sourcemaps   = require('gulp-sourcemaps'),
postcss      = require('gulp-postcss'),
sass         = require('gulp-sass'),


//svg
svgSprite    = require('gulp-svgsprite'),
svgmin       = require('gulp-svgmin'),

//img
imageMin       = require('gulp-imagemin');


const browsersync = () => {
    browserSync.init({
        port: 4200,
        server: {baseDir: 'src'},
        online: true,
        notify: false
    })
}
exports.browsersync = browsersync;



const svg = () => {
	return src('src/images/svg/*.svg')
	.pipe(svgmin({js2svg: {pretty: true}, plugins: [{removeViewBox: false}]}))
	.pipe(cheerio({
		run: function ($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: {
			xmlMode: true
		}
	}))
	.pipe(replace('&gt;', '>'))
	.pipe(svgSprite())
	.pipe(concat('sprite.svg'))
	.pipe(dest('src/images/svg/sprite'));
}
exports.svg = svg;



const styles = () => {
	return src('src/scss/style.scss')
	.pipe(sourcemaps.init()) 
	.pipe(sass({outputStyle:'compressed'}).on('error', sass.logError)) 
	.pipe(concat('app.css')) 
	.pipe(postcss(require('./postcss.config.js')))
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))
	.pipe(sourcemaps.write('.')) 
	.pipe(dest('src/css/')) 
	.pipe(browserSync.stream())
}
exports.styles = styles;

const scriptsDev = () => {
    return src('src/js/main/main.js')
        .pipe(webpack(require('./webpack.dev.config.js')))
        .pipe(dest('src/js'))
        .pipe(browserSync.stream())
}
exports.scriptsDev = scriptsDev;

const scriptsProd = () => {
    return src('src/js/main/main.js')
        .pipe(webpack(require('./webpack.build.config.js')))
        .pipe(dest('dist/js'))
}
exports.scriptsProd = scriptsProd;


const htmlProd = () => {
    return src('src/*.html')
        .pipe(htmlMin({removeComments: true, collapseWhitespace: true}))
        .pipe(dest('dist'))
}
exports.htmlProd = htmlProd;


const cleandist = () => {
    return del('dist/**/*', { force: true })
}


const startwatch = () => {
    watch(['src/js/**/*.js', '!src/js/*.js'], scriptsDev);
    watch('src/scss/**/*.scss', styles);
    watch('src/**/*.html').on('change', browserSync.reload);
}
exports.startwatch = startwatch;

const images = () => {
    return src('src/images/**/*')
	.pipe(imageMin([
        imageMin.gifsicle({interlaced: true}),
        imageMin.mozjpeg({quality: 75, progressive: true}),
        imageMin.optipng({optimizationLevel: 5}),
        imageMin.svgo({
            plugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ]
        })
    ])) 
	.pipe(dest('dist/images'))
}
exports.images = images;

const buildcopy = () => {
    return src([
        'src/fonts/**/*',
        'src/css/**/*.css'
        // 'src/.htaccess',
        // 'src/*.{php,png,xml,ico,webmanifest,svg}'
    ], { base: 'src' })
        .pipe(dest('dist'))
}
exports.buildcopy = buildcopy;

exports.default = parallel(styles, scriptsDev, browsersync, startwatch);
exports.build = series(cleandist, styles, scriptsProd, htmlProd, buildcopy, images);
