/**
 * Usage:
 * Simply importing this file will mock the window object and all dependencies
 * for this project.
 */

import getWindow, { setWindow } from '../src/helpers/window';
import mockHtml from './mock-html';
import { JSDOM } from 'jsdom';

/**
 * Reset the markup in the DOM to the initial state
 */
export default function resetMarkup() {
	getWindow().jQuery( getWindow().document.body ).html( mockHtml );
}

/**
 * Mock the window object
 *
 * @param {string} html - The html to use for the DOM
 * @return {Object} The window object
 */
function getMockWindow( html ) {
	return new JSDOM( html ).window;
}

function mockjQuery( mockWindow ) {
	mockWindow.jQuery = require( 'jquery' )( mockWindow );
}

function mockUnderscore( mockWindow ) {
	mockWindow._ = require( 'underscore' );
}

function mockCustomizer( mockWindow ) {
	// TODO add customizer functions and bootstrap data to mockWindow
	mockWindow.wp = { customize: {} };
}

function mockTranslations( mockWindow ) {
	mockWindow._Customizer_DM = { translations: {} };
}

const mockWindow = getMockWindow( mockHtml );
mockjQuery( mockWindow );
mockUnderscore( mockWindow );
mockCustomizer( mockWindow );
mockTranslations( mockWindow );
setWindow( mockWindow );
