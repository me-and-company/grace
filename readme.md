# Grace
## Web Frontend Fundament

We at [Me & Company](https://me-company.de) are using this boilerplate project to set up our web projects. It unifies the structure of each project and simplifies the start of development.

Essentially, it provides the folder structure and some basic files for SASS and JavaScript. It has a builder included with various tasks, which add value to each project and improve the quality without any major effort. We implemented some features, at this stage especially for the work with SASS. It is adaptable for other frameworks, but can also be used as an independent HTML framework.

## Installation

1. Download or clone into your project folder
2. Run ``npm install``
3. As macOS user you need some extra steps for the images build process to work: [Install Homebrew](https://brew.sh/), then install libpng library with ``brew install libpng``
4. Run ``gulp dev`` and you are ready to go


## Features

### 1. HTML

There is a basic ``index.html`` file, where you can import template snippets via [Gulp File Include](https://www.npmjs.com/package/gulp-file-include) e.g.:

        <html>

        @@include('./src/html/snippets/header.html');

        ...

        </html>

With ``gulp include`` the html files get build and ``gulp html`` minifies them into the dist folder.

### 2. SASS

#### Settings

We have variables for most attributes in CSS, which are individual for each project and design related.

* define [basic variables](/src/sass/01_settings/_base-vars.scss), like maximum page size, values for [spacing rhythm](http://typecast.com/blog/4-simple-steps-to-vertical-rhythm)
* define [breakpoints](/src/sass/01_settings/_breakpoints.scss)
* define [color variables](/src/sass/01_settings/_colors.scss), [font-size variables](/src/sass/01_settings/_font-sizes.scss), [grid options](/src/sass/01_settings/_grid.scss), [spacing variables](/src/sass/01_settings/_spacing.scss)
* see [settings](/src/sass/01_settings)

#### Tools

There are several mixins and functions to simplify and unify common used declarations like font-sizes, colors, breakpoints and spacing.

* responsive font-size: ``@include font-size(base)``
* fixed font-size: ``@include font-size(base, sm, false)``
* use defined colors: ``color: color(base)``
* device-based breakpoints: ``@include breakpoint(md)``
* content-based breakpoints: ``@include breakpoint(920px)``
* use defined spacings: ``padding-top: spacing(m)``, for text-spacing: ``padding-bottom: text-spacing(l)``

#### Grid

We implemented a sass generated grid. You are able to choose your preferred grid type (``flex``, ``float``, ``inlineblock``, CSS Grids coming soon), the amount of columns and the spacing between columns. The generated grid classes are mostly named like bootstrap, e.g.:

* ``col-6``, ``col-lg-6``, ``col-md-6``, ``col-sm-6``, ``col-xs-6``
* ``col-offset-6``, ``col-lg-offset-6``, ``col-md-offset-6``, ``col-sm-offset-6``, ``col-xs-offset-6``

#### Atoms, Elements, Modules
We are using a customized approach of [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/). We decided to call molecules 'elements' and organisms 'modules'. Semantically they are pretty much the same.

Have a look at our [template file](/src/sass/_template.scss) for a suggested structure of attribute declarations and examples of usage.

#### Helper Classes

Instead of creating a variation of an element or atom class for unique styling cases we are using helper classes.
* spacing: ``.mt-1``, ``.mb-1``, ``.n-mt-1``, ``.mt-md-1``, ``.pt-1``, ``...``
* font styling: ``.font-lg-base``, ``.font-bold``, ``.text-uppercase``, ``...``
* see [helpers](/src/sass/09_helpers) for more

### 3. JavaScript

#### Linting
To improve code quality and consistency we follow the [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript). We use ESLint with the Airbnb config to comply with the style guide ([ESLint config](https://github.com/me-and-company/grace/blob/master/src/js/.eslintrc)). To enable linting, check the preferences of your editor.

#### Module Classes
Our basic approach is to get as close as possible to [Object Oriented Programming with JavaScript](https://developer.mozilla.org/de/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript). For each module, create a class which implements the needed functionality. The [class template](https://github.com/me-and-company/grace/blob/master/src/js/modules/_template.js) defines a basic structure. The class constructor expects a [Node Object](https://developer.mozilla.org/en-US/docs/Web/API/Node) as element. Optionally, further parameters can be provided. 

#### Main
This is the main script from where all functions should be called and all classes should be created. Use the [factory functions](https://github.com/me-and-company/grace/blob/master/src/js/functions/factory.js) to create instances of your classes. See [main.js](https://github.com/me-and-company/grace/blob/master/src/js/base/main.js) how to use them.
* The ``graceProduce`` function produces many instances of the class. For each ``Node`` with the given selector, an instance of the class is created. So each ``Node`` has its own class instance.
* The ``graceCreate`` function creates one instance of the class. The element is an ``Array`` of each ``Node`` with the provided selector.

#### Events, Functions and Libraries
* You should add global event listeners inside the [events.js](https://github.com/me-and-company/grace/blob/master/src/js/base/events.js) file. Global events are not related to a module, like sending a Google Analytics event triggered by every button on the page.
* If you are writing global functions, the folder [functions](https://github.com/me-and-company/grace/tree/master/src/js/functions) is the right place. 
* If you need to include 3rd party libraries, add them to the [libraries](https://github.com/me-and-company/grace/tree/master/src/js/libs) folder, and Gulp  bundles them into a ``libs.js`` file.

#### Building
* ``singles`` are processed as they are and are stored to the ``dist/js`` folder
* ``libs`` get build into a ``libs.js``, with the scripts inside the first folder being added at first
* All other scripts get build into the ``main.js``

Some notable features:
* Support of EcmaScript6 via [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/)
* Additional browser support with the ``main.legacy.js`` file

### 4. Inline SVG-Icons

We are using inline SVG-Icons. The build process ``gulp images`` optimizes the SVGs using [SVGO](https://github.com/svg/svgo), builds them into a PHP file and as .svg-files to the image folder. From there you can either import them by using the PHP variables or using the built-in [Gulp File Include](https://www.npmjs.com/package/gulp-file-include) module.
* inline import into HTML template via ``@@include(dist/img/icons/icon-atom.svg)``
* inline import for PHP e.g.:

        <?php require 'icons.php'; ?>

        <span class="icon"><?php echo $icon_atom; ?></span>

### Gulp Tasks

``gulp dev`` - used in development environment
``gulp build`` - used for production environment

### Others
* images optimized by [mozjpeg](https://www.npmjs.com/package/mozjpeg), [pngquant](https://www.npmjs.com/package/pngquant)
* [BrowserSync](https://www.browsersync.io/)
* minified JS, CSS and HTML

## Browser Support
* last 4 versions, not ie <= 10, not Edge <= 13, Safari >= 8
* see [browserl.ist](http://browserl.ist/?q=last+4+versions%2C+not+ie+%3C%3D+10%2C+not+Edge+%3C%3D+13%2C+Safari+%3E%3D+8) fore more information


We'd like to hear your opinion, any comments or suggestions to make it even better.

----
Built with <3 by [Me & Company](https://me-company.de)
