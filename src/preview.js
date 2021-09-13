import $ from 'jquery';
import getWindow from './helpers/window';
import getAPI from './helpers/api';
import getOptions, { isDisabled } from './helpers/options';
import { isSafari, isMobileSafari } from './helpers/user-agent';
import makeFocusable from './modules/focusable';
import { modifyEditPostLinks, disableEditPostLinks } from './modules/edit-post-links';
import { getHeaderElements } from './modules/header-focus';
import { getMenuElements } from './modules/menu-focus';
import { getFooterElements } from './modules/footer-focus';
import { getSiteLogoElements } from './modules/site-logo-focus';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:preview' );

const options = getOptions();
const api = getAPI();

function disableEditShortcuts() {
	if ( api.selectiveRefresh && api.selectiveRefresh.Partial && api.selectiveRefresh.Partial.prototype.createEditShortcutForPlacement ) {
		debug( 'disabling edit shortcuts' );

		// This is crude but necessary to fix the broken widget shortcuts that broke when block widgets were introduced
		// We effectively skip overriding/disabling the default shortcut for widget partials
		const createEditShortcutForPlacement = api.selectiveRefresh.Partial.prototype.createEditShortcutForPlacement;
		api.selectiveRefresh.Partial.prototype.createEditShortcutForPlacement = function( ...args ) {
			if ( args[ 0 ] && args[ 0 ].partial && args[ 0 ].partial.id.startsWith( 'widget' ) ) {
				createEditShortcutForPlacement.apply( this, args );
			}
		};
	} else {
		debug( 'no edit shortcuts support detected' );
	}
}

function startDirectManipulation() {
	disableEditShortcuts();

	const basicElements = [
		{ id: 'blogname', selector: '.site-title, #site-title', type: 'siteTitle', position: 'middle', title: 'site title' },
	];
	const headers = ! options.headerImageSupport ? [] : getHeaderElements();
	const menus = isDisabled( 'menu-focus' ) ? [] : getMenuElements();
	const footers = isDisabled( 'footer-focus' ) ? [] : getFooterElements();
	const siteLogo = isDisabled( 'site-logo-focus' ) ? [] : getSiteLogoElements();

	makeFocusable( basicElements.concat( headers, menus, footers, siteLogo ) );

	if ( ! isDisabled( 'edit-post-links' ) ) {
		if ( isSafari() && ! isMobileSafari() ) {
			disableEditPostLinks( '.post-edit-link, [href^="https://wordpress.com/post"], [href^="https://wordpress.com/page"]' );
		} else {
			modifyEditPostLinks( '.post-edit-link, [href^="https://wordpress.com/post"], [href^="https://wordpress.com/page"]' );
		}
	}
}

api.bind( 'preview-ready', () => {
	// the widget customizer doesn't run until document.ready, so let's run later
	$( getWindow().document ).ready( () => setTimeout( startDirectManipulation, 100 ) );
} );
