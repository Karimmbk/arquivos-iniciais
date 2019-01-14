// Adiciona os modulos instalados
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const reset = require('node-reset-scss');

// Criação doas pastas e dos paths
gulp.task('directories', () => gulp
  .src('*.*', { read: false })
  .pipe(gulp.dest('./css/scss'))
  .pipe(gulp.dest('./img/content'))
  .pipe(gulp.dest('./img/icons'))
  .pipe(gulp.dest('./js/main')));

// Funçao para compilar o SASS e adicionar os prefixos
function compilaSass() {
  return gulp
    .src('css/scss/**/*.scss')
    .pipe(
      sass({
        // comprimir os arquivos sass no style.css
        outputStyle: 'compressed',
        includePaths: reset.includePath,
      }),
    )
    .pipe(
      autoprefixer({
        // adicionar os prefixos de (-webkit, ...)
        browsers: ['last 2 versions'],
        cascade: false,
      }),
    )
    .pipe(gulp.dest('css/')) // salvar as mudanças dos arquivos Sass na pasta css
    .pipe(browserSync.stream()); // auto reload no browser para fazer as mudanças na hora
}

// Tarefa de gulp para a função de SASS
gulp.task('sass', (done) => {
  /* se eu for chamar alguma funcao com parametro, precisa-se chamar o task com uma
     funcao anonima e dentro dela chamar a funcao desejada. Prescisa-se tb colocor esse
     parametro 'done', para saber que acabou */
  compilaSass();
  done();
});

// Função para juntar os arquivos js em um só
function gulpJS() {
  return gulp
    .src('js/main/**/*.js')
    .pipe(concat('main.js')) // juntar os arquivos js em um
    .pipe(
      babel({
        // serve para transformar o js para ser compativel com browser's mais antigos
        presets: ['env'],
      }),
    )
    .pipe(uglify())
    .pipe(gulp.dest('js/')) // onde vai ser salvo o arquivo final
    .pipe(browserSync.stream());
}

gulp.task('mainjs', gulpJS);

// JS Plugins
function pluginJS() {
  return gulp
    .src(['js/plugins/*.js'])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

gulp.task('pluginjs', pluginJS);

// Função para iniciar o browser
function browser() {
  // abrir o browser com local host
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
}

// Tarefa para iniciar o browser-sync
gulp.task('browser-sync', browser);

// Função de watch do Gulp, serve para executar automaticamente as mudanças q eu for salvando
function watch() {
  gulp.watch('css/scss/**/*.scss', compilaSass);
  gulp.watch('js/main/**/*.js', gulpJS);
  gulp.watch(['*.html']).on('change', browserSync.reload);
}

// Inicia a tarefa de watch
gulp.task('watch', watch);

// Tarefa padrão do Gulp, que inicia o watch e o browser-sync
gulp.task('default', gulp.parallel('directories', 'watch', 'browser-sync', 'sass', 'mainjs'));
