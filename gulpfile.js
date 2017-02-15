// get the dependencies
var gulp  = require('gulp');  
var path = require('path');
var shell = require('gulp-shell');
var ts=require('gulp-typescript');
var sourcemaps=require('gulp-sourcemaps');

var paths = {
  typescript:{
		src: ['./core/**/*.ts'],
		config:'./core/tsconfig.json',
		rootTypescriptDir:'./core',
		outputJavascriptDir:'./core',
		relativeSourcemaps:'./sourcemaps'//not used, sourcemaps are embedded
  }
};

gulp.task('watch',function(){		
  	gulp.watch(paths.typescript.src,['compile']);
});

//compiles typescript files 
gulp.task('compile',function(){

	var tsProject = ts.createProject(path.resolve(paths.typescript.config));
	return gulp.src(paths.typescript.src)
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write({sourceRoot:"."}))
		.pipe(gulp.dest(paths.typescript.outputJavascriptDir));
});

//clean up javascript files that may have resulted from typescript files in the same directory
gulp.task('clean',shell.task('rm core/*.js'));

gulp.task('execute',shell.task('node core/main.js'));
gulp.task('debug',shell.task('node --debug-brk=5858 core/index.js'));

// process.env.NODE_ENV=='production' ?
// 		shell.task('node core/index.js'):
// 		shell.task('node --debug-brk=5858 core/index.js')
gulp.task('start',['compile','watch','execute']);

gulp.task('default',['start']);
