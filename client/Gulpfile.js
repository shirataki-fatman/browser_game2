var gulp = require("gulp");

var uglify = require("gulp-uglify");
var minifyHTML = require("gulp-minify-html");
var minidyCSS = require("gulp-minify-css");
var connect = require("gulp-connect");
var proxy = require('proxy-middleware');
var url = require('url');
var stubcell = require('gulp-stubcell');

gulp.task("js", function() {
	gulp.src("./javascript/**/*.js")
		.pipe(uglify())
		.pipe(gulp.dest("../server/route/js/"));
});

gulp.task("html", function() {
	var option = {
		comments: true,
		spare: true
	};

	gulp.src("./html/**/*.html")
		.pipe(minifyHTML(option))
		.pipe(gulp.dest("../server/route/html/"));
});

gulp.task("css", function() {
	var option = {
		keepBreaks: true
	};

	gulp.src("./css/**/*.css")
		.pipe(minidyCSS(option))
		.pipe(gulp.dest("../server/route/css"));
});

gulp.task("connect", function() {
	connect.server({
		root: "./html",
		livereload: true,
		port: 9000,
		middleware: function(connect, o) {
			return [ (function() {
				var options = url.parse("http://localhost:3000/api");
				options.route = "/api";
				return proxy(options);
			})() ];
		}
	});
});

gulp.task("stubcell", function() {
	stubcell.start({
		entry: "entry.yaml",
		basepath: "fixture",
		port: 3000,
		record: {
			proxy: "http://localhost:3001",
		}
	});
});

gulp.task("publish", ["js", "html", "css"]);
gulp.task("develop", ["connect", "stubcell"]);