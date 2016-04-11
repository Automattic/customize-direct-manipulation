A WordPress plugin that adds small icons to the customizer preview that open the respective section in the sidebar.

![Demo](https://cldup.com/MvlYi8umPJ.gif)

# Installation

1. Visit the [Releases page](https://github.com/Automattic/customize-direct-manipulation/releases) and download the latest release. Save the zip file into the `wp-content/plugins` directory in your WordPress installation and then unzip the file. It will create a directory called `customize-direct-manipulation`.
2. Enter the WordPress admin page for your site and navigate to the plugins page, eg: http://**YOUR WEBSITE HERE**/wp-admin/plugins.php
3. Click "Activate" next to the "Customize Direct Manipulation" plugin.
4. Load the customizer for your site, eg: http://**YOUR WEBSITE HERE**/wp-admin/customize.php
5. Click the small icons to activate the appropriate controls in the sidebar.

![Customizer with CDM active](https://cldup.com/aJXdAxaVNE.png)

# Contributing

1. Clone this repo and install it on a WordPress site. You can either clone the repo directly into your `/wp-content/plugins` directory, or use [copytotheplace](https://github.com/sirbrillig/copytotheplace) by adding a `.env` file with your target directory and running `grunt copytotheplace`.
2. After cloning, run `npm install` and then `npm run dist` to compile the JavaScript.
3. To start a watcher process for development, run `npm start` (this will also run copytotheplace if you have a `.env` file set).

# Testing

Run `npm install` and then `npm test` to run the test suite.
