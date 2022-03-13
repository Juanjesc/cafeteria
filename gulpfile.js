const {src, dest, watch, series} = require('gulp'); //La variable va entre llaves porque el paquete exporta más de una función
const sass = require('gulp-sass')(require('sass')); //Si no tiene llaves la variable es porque el paquete exporta 1 sola función (compilar la hoja de estilos)
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const sourcemaps = require('gulp-sourcemaps');
/* Sourcemaps es una dependencia de gulp que nos va a permitir mostrar QUÉ archivo concreto .scss ha
tenido un cambio. Se debe inicializar antes de la compilación, es decir, antes del .pipe(sass()),
y mediante el método .write crearemos un archivo que contendrá las rutas específicas para que funcione.
*/
const cssnano = require('cssnano');
function css(done) {
    //1er paso -- Compilar Sass
    //1) Identificar el archivo 2) Compilarlo 3) Guardar el .css
    src('src/scss/app.scss') // 1)
        .pipe(plumber()) //Esto hace que posibles errores no paren la ejecución del código. (Pero da el aviso)
        .pipe(sourcemaps.init()) 
        .pipe(sass())   // 2)
        .pipe(postcss([autoprefixer(),cssnano()]))
        .pipe(sourcemaps.write('.')) //especificar '.' en la ruta hará que se guardo junto al build
        .pipe(dest('build/css')) // 3)
    done()
}
function imagenes(){
    return src('src/img/**/*')
        .pipe(imagemin({optimizationLevel: 3}))
        .pipe(dest('build/img'))
    
}
function imagen_webp(){
    const calidad = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
    .pipe(webp(calidad))
    .pipe(dest('build/img'))
}
function imagen_avif(){
    const calidad = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
    .pipe(avif(calidad))
    .pipe(dest('build/img'))
}
function dev() {
    watch('src/scss/**/*.scss', css)
    watch('src/img/**/*', imagenes)
}

exports.css = css //compila nuestro archivo sass a css
exports.dev = dev //actúa como un watch que se actualiza constantemente
exports.imagenes = imagenes //optimiza las imagenes
exports.imagen_webp = imagen_webp //duplica las imagenes pero en formato webp
exports.imagen_avif = imagen_avif //duplica imágenes pero en formato avif 
exports.default = series(imagenes,imagen_webp, imagen_avif,css,dev); 


//series lo que hace es ejecutar una tarea, y cuando finaliza, ejecuta la siguiente
//parallel lo que hace es ejecutar todas las tareas al mismo tiempo.


