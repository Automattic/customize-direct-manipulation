A WordPress plugin that adds small icons to the customizer preview that open the respective section in the sidebar.

![Demo](https://cldup.com/MvlYi8umPJ.gif)

# Installation

1. Visit the [Releases page](https://github.com/Automattic/customize-direct-manipulation/releases) and download the latest release (not the source code).
2. Navigate to Plugins → Add New in your WordPress site's admin area and click the "Upload Plugin" button at the top in order to upload the ZIP file. If this button doesn't exist due to file permissions, you can [install it manually](https://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).
3. Activate the plugin, either from the page that shows up after uploading the ZIP file or from your plugins list if you uploaded the plugin manually.
4. Navigate to Appearance → Customize from your WordPress menu.
5. Click the small icons to activate the appropriate controls in the sidebar.

![Customizer with CDM active](https://cldup.com/aJXdAxaVNE.png)

# Contributing

1. Clone this repo and install it on a WordPress site. You can either clone the repo directly into your `/wp-content/plugins` directory, or use [copytotheplace](https://github.com/sirbrillig/copytotheplace) by adding a `.env` file with your target directory and running `grunt copytotheplace`.
2. After cloning, run `npm install` and then `npm run dist` to compile the JavaScript.
3. To start a watcher process for development, run `npm start` (this will also run copytotheplace if you have a `.env` file set).
4. If you want to see detailed info in your browser console, enable debugging by running the following command in the console and then reloading the page: `localStorage.setItem('debug', 'cdm:*');`.

# Testing

Run `npm install` and then `npm test` to run the test suite.

[![Circle CI](https://circleci.com/gh/Automattic/customize-direct-manipulation.svg?style=svg)](https://circleci.com/gh/Automattic/customize-direct-manipulation)
