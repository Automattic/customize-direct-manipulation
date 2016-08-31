import getWindow from './helpers/window';
import getAPI from './helpers/api';
import getJQuery from './helpers/jquery';
import getOptions from './helpers/options';
import { isSafari, isMobileSafari } from './helpers/user-agent';
import makeFocusable from './modules/focusable';
import { modifyEditPostLinks, disableEditPostLinks } from './modules/edit-post-links';
import { getHeaderElements } from './modules/header-focus';
import { getWidgetElements } from './modules/widget-focus';
import { getMenuElements } from './modules/menu-focus';
import { getFooterElements } from './modules/footer-focus';

const options = getOptions();
const api = getAPI();
const $ = getJQuery();

function startDirectManipulation() {
	const basicElements = [
		{ id: 'blogname', selector: '.site-title, #site-title', type: 'siteTitle', position: 'middle', title: 'site title' },
	];
	const headers = ( options.headerImageSupport ) ? getHeaderElements() : [];
	const widgets = getWidgetElements();
	const menus = getMenuElements();
	const footers = getFooterElements();
	makeFocusable( basicElements.concat( headers, widgets, menus, footers ) );

	if ( -1 === options.disabledModules.indexOf( 'edit-post-links' ) ) {
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
