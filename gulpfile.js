// get the dependencies
var gulp  = require('gulp');  
var path = require('path');
var shell = require('gulp-shell');
var ts=require('gulp-typescript');
var sourcemaps=require('gulp-sourcemaps');

var paths = {
  typescript:{
	  server:{
			src: ['./server/**/*.ts'],
			config:'./server/tsconfig.json',
			rootTypescriptDir:'./server',
			outputJavascriptDir:'./server',
			relativeSourcemaps:'./sourcemaps'//not used, sourcemaps are embedded
	  }
  }
};

//watches server typescript files and compiles on change
gulp.task('watch:server',function(){		
  	gulp.watch(paths.typescript.server.src,['compile:server']);
});

//compiles typescript files and stores them in a 'transpiled' folder
gulp.task('compile:server',function(){

	var tsProject = ts.createProject(path.resolve(paths.typescript.server.config));
    return gulp.src(paths.typescript.server.src)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write({sourceRoot:"."}))
        .pipe(gulp.dest(paths.typescript.server.outputJavascriptDir));
});

//clean up javascript files that may have resulted from typescript files in the same directory
gulp.task('clean:server',shell.task('rm server/*.js'));

//server: transpiles typescript, watches ts files and launches the server
gulp.task('execute:server',shell.task('node server/index.js'));
gulp.task('debug:server',shell.task('node --debug-brk=5858 server/index.js'));

// process.env.NODE_ENV=='production' ?
// 		shell.task('node server/index.js'):
// 		shell.task('node --debug-brk=5858 server/index.js')
gulp.task('start:server',['compile:server','watch:server','execute:server']);

gulp.task('info',function(){	
	console.log("If this is the very first run, expect a delay in the page load (because .ts files haven't transpiled yet)");
});

gulp.task('watch:client',shell.task('ng build -o dist -w'));

gulp.task('default',['start:server']);
