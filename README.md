<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>


<!-- PROJECT SHIELDS 
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/xakpc/gulp-grass-sass/">
    <img src="https://github.com/xakpc/gulp-grass-sass/assets/6075374/1b4b220b-faeb-4f67-b6d0-2af4fcf6b96b" alt="Logo" width="150" height="150">
  </a>

<h3 align="center">gulp-grass-sass</h3>

  <p align="center">
    Sass plugin for <a href="https://gulpjs.com/">Gulp</a> utilizing the speed and performance of <a href="https://github.com/connorskees/grass">Grass</a> rust library to compile SASS to CSS 8x faster than gulp-sass.
    <br />
    <a href="#getting-started"><strong>Start here »</strong></a>
    <br />
    <br />
    <a href="https://github.com/xakpc/gulp-grass-sass/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/xakpc/gulp-grass-sass/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![image](https://github.com/xakpc/gulp-grass-sass/assets/6075374/ce91bd73-dd04-4e21-8337-437a05cadcd9)

This project aims to provide a fast and efficient way to compile SCSS to CSS using Gulp, leveraging the capabilities of the Grass rust library. With this setup, you can streamline your front-end development workflow, ensuring quick on-fly compilation times and a smooth integration with your existing Gulp tasks.

### Key Features

- **High Performance:** Drag and drop **8x compile speed** (tested on 98KB CSS file) by utilizing the Grass rust library.
- **Seamless Integration:** Easily integrates with your existing Gulp setup.
- **Error Handling:** Provides informative error messages to help you debug issues quickly.
- **Flexible Configuration:** Supports custom paths and configuration options to fit your project needs.

This project is designed to enhance your development experience in Visual Studio by combining the power of modern JavaScript tools with the performance benefits of Rust.

### Built With

[Node.js](https://nodejs.org/) · [Rust](https://www.rust-lang.org/) · [Gulp](https://gulpjs.com/) · [Grass](https://github.com/connorskees/grass) · [N-API](https://github.com/napi-rs/napi-rs)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

This project is built primarily to be used in Visual Studio with Task Runner Explorer, but it can also be used from anywhere using the CLI.

### Prerequisites

You need Visual Studio with the built-in Task Runner Explorer or `gulp-cli` to run Gulp from the terminal.

Due to the nature of Rust being compiled into native libraries, this package is built specifically for the following architectures. Please ensure your system matches one of the following to use this package:

- darwin-arm64 (macOS on ARM, e.g., M1/M2 Macs)
- darwin-x64 (macOS on Intel x86_64)
- linux-x64-gnu (Linux on Intel/AMD x86_64)
- win32-x64-msvc (Windows 64-bit on Intel/AMD with MSVC)

### Installation

1. Open the **Terminal** in Visual Studio from the menu: **View** > **Terminal**.
1. Navigate to your project directory in the Terminal.
1. Install the required npm packages as dev dependencies:
   ```sh
   npm install --save-dev gulp @xakpc/gulp-grass-sass
   ```
1. Create a `gulpfile.js` in the root of your project with the following content:
   ```js
   /// <binding ProjectOpened='watch' />
   const { watch, src, dest } = require('gulp');
   const compile = require('@xakpc/gulp-grass-sass');
   
   // Task to compile SCSS to CSS without minification using rust Grass lib
   function compileSassFastish() {
     return src('wwwroot/css/main.scss')
       .pipe(compile().on('error', e => { console.log(e); })) 
       .pipe(dest('wwwroot/css'));
   }

   exports.compileCssFastish = compileSassFastish;

   // Task to watch for changes in scss files
   exports.watch = function () {
     watch('wwwroot/css/*.scss', compileSassFastish);
   };
   ```
1. Change paths according to your project needs.
   
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

`gulp-grass-sass` is built to be used in a Gulp task. 

### Compile your CSS

To compile your CSS with a build task, then watch your files for changes, you might write something like this:

```js
const gulp = require('gulp');
const compile = require('@xakpc/gulp-grass-sass');

function compileStyles() {
  return gulp.src('./wwwroot/sass/**/*.scss')
    .pipe(compile().on('error', e => { console.log(e); }))
    .pipe(gulp.dest('./wwwroot/css'));
};

exports.compileStyles = compileStyles;
exports.watch = function () {
  gulp.watch('./wwwroot/sass/**/*.scss', compileStyles);
};
```
To run it you have a several options
1. Run `watch` task in Visual Studio
   1. Open Task Runner Explorer in Visual Studio from the menu: **View** > **Other Windows** > **Task Runner Explorer**.
   1. In Task Runner Explorer, you should see the Gulp tasks listed. Right-click on the watch task and select **Bindings** > **Project Open** to ensure the task runs when the project is opened (should be set by `<binding ProjectOpened='watch' />`).
   1. Run the Gulp watch task manually by right-clicking on the watch task in Task Runner Explorer and selecting Run to start compiling SCSS files.
1. Or run it manually from Terminal if `gulp-cli` installed
   ```sh
   gulp watch
   ```

### Compile with options

To change the final output of your CSS, you can pass an options object to `compile` function. 

The following options are available in the `grass` library, and therefore in `gulp-grass-sass` as well:

```ts
export const enum SassSyntax {
  Sass = 'Sass',
  Css = 'Css',
  Scss = 'Scss'
}
export const enum SassOutputStyle {
  Expanded = 'Expanded',
  Compressed = 'Compressed'
}

export interface SassOptions {
    sassSyntax?: SassSyntax
    outputStyle?: SassOutputStyle
    includePaths?: Array<string>
}
```

The Grass library has more options so more of them could be added in the future if needed.

All of the options are optinonal
 - `sassSyntax` would usually be determined from file extension, `Scss` by default
 - `outputStyle` is `Expanded` by default
 - `includePaths` are paths on the filesystem that Sass will look in when locating modules. For example, if you pass `pages/` as a load path, you can use `@import "index.cshtml.scss"` to load `pages/index.cshtml.scss`.

*Note*: `@import "index.cshtml"` would not work, `.scss` extension is required here.

```js
function compileStyles() {
  return gulp.src('./wwwroot/sass/**/*.scss')
    .pipe(compile({outputStyle: 'Compressed'}).on('error', e => { console.log(e); }))
    .pipe(gulp.dest('./wwwroot/css'));
};

exports.buildStyles = compileStyles;
```

### Include a source map

Source maps are not supported in the `grass` library, and therefore not in `gulp-grass-sass` either.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Thank you for considering a contribution to the project! Contributions make the open source community a vibrant and innovative space. I appreciate your efforts to make this project even better.

### How to Contribute

If you have a suggestion or feature you’d like to add, here’s how you can contribute:

1. Start by forking the project repository to your own GitHub account.
2. Create a Feature branch specifically for your contribution to keep your work organized. Use a meaningful name: `git checkout -b feature/YourFeatureName`.
3. Make the modifications or additions you have in mind. Stick to the coding style already used in the project.
4. Commit your changes with a clear, concise commit message that explains the "why" behind your work. For example: `git commit -m "Add filtering by tag functionality"`.
5. Push your changes to your repository: `git push origin feature/YourFeatureName`.
6. Go to the original repository, and you’ll see a prompt to open a pull request from your newly pushed branch. Fill out the pull request template with the relevant information so it’s clear what your changes are and why they should be included.
7. If your pull request receives feedback, be responsive and make necessary updates. This often involves additional commits and discussion with maintainers.

### Before You Submit

- **Check Existing Issues and Pull Requests** to ensure your contribution isn’t duplicative.
- **Run Tests** to confirm your changes don’t break existing functionality.

### Additional Ways to Contribute

- **Report a Bug** by [opening an issue](https://github.com/xakpc/gulp-grass-sass/issues/new?labels=bug&template=bug-report---.md). Use the tag `bug` to help maintainers quickly see what’s wrong.
- **Request a Feature** by [opening an issue](https://github.com/xakpc/gulp-grass-sass/issues/new?labels=enhancement&template=feature-request---.md) with the tag `enhancement`. Describe what you’d like to see and why it’s a valuable addition.
- **Give a Star** on GitHub if you like the project and want to show your support!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Pavel - [@xakpc](https://twitter.com/xakpc)

Project Link: [https://github.com/xakpc/gulp-grass-sass/](https://github.com/xakpc/gulp-grass-sass/)

My personal blog: [xakpc.info](https://xakpc.info)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [grass](https://github.com/connorskees/grass) by [Connor Skees](https://github.com/connorskees)
* [Node-API (N-API) for Rust](https://github.com/napi-rs/napi-rs)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/xakpc/gulp-grass-sass.svg?style=for-the-badge
[contributors-url]: https://github.com/xakpc/gulp-grass-sass/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/xakpc/gulp-grass-sass.svg?style=for-the-badge
[forks-url]: https://github.com/xakpc/gulp-grass-sass/network/members
[stars-shield]: https://img.shields.io/github/stars/xakpc/gulp-grass-sass.svg?style=for-the-badge
[stars-url]: https://github.com/xakpc/gulp-grass-sass/stargazers
[issues-shield]: https://img.shields.io/github/issues/xakpc/gulp-grass-sass.svg?style=for-the-badge
[issues-url]: https://github.com/xakpc/gulp-grass-sass/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/xakpc/gulp-grass-sass/blob/master/LICENSE.txt
