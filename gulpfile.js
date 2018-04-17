const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

//Task with the name sass. We will have this start our sass build
gulp.task('sass', () => {
    /**
      gulp.src takes in a filepath for a source file, files or folder.
      Calling pipe will then take each of the files specified and
      run a command on.
      
      In this case, we will take the main.scss file and pipe it to
      sass. We are also calling sass's on 'error' function
      to log out the errors for us. You can find that in the
      gulp-sass documentation.
      
      After that we are calling pipe to take the output from sass
      and put it into a folder. 
      To do this, you pipe to gulp.dest (destination) and give
      it the output folder you want it to go into. It will go
      into that folder with the same base filename and new extension.
      
      ./scss/main.scss will create ./hosted/main.css
    **/
    gulp.src('./scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(concat('main.css'))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./hosted/'));   
  });
  
  //Task with the name js. We will have this run babel on our client js
  gulp.task('js', () => {
    /**
      gulp.src takes in a filepath for a source file, files or folder.
      Calling pipe will then take each of the files specified and
      run a command on.
      
      In this case, we will take the .js files from ./client and pipe them
      to babel. We are passing babel a JSON object of configuration options
      to use the env and react presets. You can find this in the
      gulp-babel documentation.
      
      After that we are calling pipe to take the output from each babel file
      and put it into a folder. 
      To do this, you pipe to gulp.dest (destination) and give
      it the output folder you want it to go into. It will go
      into that folder with the same base filename and new extension.
      
      ./client/example1.js will create ./hosted/example1.js
      ./client/example5.js will create ./hosted/example5.js
    **/
    gulp.src(['./client/app/maker.js', './client/helper/*.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('appBundle.js'))
      .pipe(babel({
        presets: ['env', 'react'],
        minified: true,
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./hosted/'));
    gulp.src(['./client/app/board.js', './client/helper/*.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('boardBundle.js'))
      .pipe(babel({
        presets: ['env', 'react'],
        minified: true,
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./hosted/'));
    gulp.src(['./client/app/account.js', './client/helper/*.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('accountBundle.js'))
      .pipe(babel({
        presets: ['env', 'react'],
        minified: true,
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./hosted/'));
    gulp.src(['./client/login/*.js', './client/helper/*.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('loginBundle.js'))
      .pipe(babel({
        presets: ['env', 'react'],
        minified: true,
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./hosted/'));
  });
  
  //Task with the name lint. We will have this run ESLint on our server code
  gulp.task('lint', () => {
    /**
      We are calling return here so that the process receives a true or false
      on whether or not ESLint passed. If it receives a false, the process
      will stop because ESLint errors. We will need to correct those errors
      to continue.
      
      gulp.src takes in a filepath for a source file, files or folder.
      Calling pipe will then take each of the files specified and
      run a command on.
      
      In this case, we will take the .js files from ./server and pipe them
      to eslint. ESlint will use out .eslintrc file for configuration. 
      We are also asking gulp-eslint to format the output for human readability
      and to fail after an error occurs so the gulp process stops until we fix errors.
      You can find this in the gulp-eslint documentation.
    **/
    return gulp.src(['./server/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  });
  
  //task named watch. This is to start watch scripts (auto-rebuild) on certain files.
  //Every time one of our listed files is saved, the gulp task will automatically rebuild.
  gulp.task('watch',() => {
    //Gulp.watch says to watch for changes in a single file, list of files, in a folder
    //or in an array of file names. When the change occurs redo the tasks listed by
    //task name in the array.
  
    //watch for changes in ./scss/main.scss and run our sass gulp task above automatically.
    gulp.watch('./scss/main.scss',['sass']);
    //watch for changes any js files in the client folder and run the js gulp task above
    gulp.watch('./client/*.js',['js']);
    
    /**
      Tell nodemon to start ./server/app.js and look for any changes in js files in the 
      same folder or subfolders as ./server/app.js (any server code file).
      Nodemon will automatically look in the same folder and subfolders as the script described.
      Since this is ./server/app.js, nodemon will look for file changes in ./server or subfolders.
      The ext is the file extension to look for. This means nodemon will only look at files
      in those folders that end in .js.
      
      When any of those files change, nodemon will run the tasks listed by name in the tasks
      array. In this case, when any server file changes, it will call the lint task.
      
      If that task (or other listed tasks) are successful, then nodemon will automatically
      restart the ./server/app.js file, restarting the server.
    **/
    nodemon({ script: './server/app.js'
            , ext: 'js'
            , tasks: ['lint'] })
  });
  
  //task with the name build. This is to kick off different scripts for us.
  //We will call this from package.json with 'gulp build'
  gulp.task('build', () => {
    //gulp.start will start a gulp task by name.
    
    //gulp.start('sass') will kick off the 'sass' task above
    gulp.start('sass');
    //gulp.start('js') will kick off the 'js' task above
    gulp.start('js');
    //gulp.start('lint') will kick off the 'lint' task above
    gulp.start('lint');
  });
  
  