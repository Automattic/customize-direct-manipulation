import getWindow from '../helpers/window';
import getAPI from '../helpers/api';
import getJQuery from '../helpers/jquery';
import { send } from '../helpers/messenger';
import { positionIcon, addClickHandlerToIcon, repositionAfterFontsLoad, enableIconToggle } from '../helpers/icon-buttons';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:focusable' );
const api = getAPI();
const $ = getJQuery();

/**
 * Give DOM elements an icon button bound to click handlers
 *
 * Accepts an array of element objects of the form:
 *
 * {
 * 	id: A string to identify this element
 * 	selector: A CSS selector string to uniquely target the DOM element
 * 	type: A string to group the element, eg: 'widget'
 * 	position: (optional) A string for positioning the icon, one of 'top-left' (default), 'top-right', or 'middle' (vertically center)
 * 	icon (optional): A string specifying which icon to use. See options in icon-buttons.js
 * 	handler (optional): A callback function which will be called when the icon is clicked
 * }
 *
 * If no handler is specified, the default will be used, which will send
 * `control-focus` to the API with the element ID.
 *
 * @param {Array} elements - An array of element objects of the form above.
 */
export default function makeFocusable( elements ) {
	const elementsWithIcons = elements
	.reduce( removeDuplicateReducer, [] )
	.map( positionIcon )
	.map( createHandler )
	.map( addClickHandlerToIcon );

	if ( elementsWithIcons.length ) {
		startIconMonitor( elementsWithIcons );
		enableIconToggle();
	}
}

function makeRepositioner( elements, changeType ) {
	return function() {
		debug( 'detected change:', changeType );
		repositionAfterFontsLoad( elements );
	};
}

/**
 * Register a group of listeners to reposition icon buttons if the DOM changes.
 *
 * See `makeFocusable` for the format of the `elements` param.
 *
 * @param {Array} elements - The element objects.
 */
function startIconMonitor( elements ) {
	// Reposition icons after any theme fonts load
	repositionAfterFontsLoad( elements );

	// Reposition icons after a few seconds just in case (eg: infinite scroll or other scripts complete)
	setTimeout( makeRepositioner( elements, 'follow-up' ), 2000 );

	// Reposition icons after the window is resized
	$( getWindow() ).resize( makeRepositioner( elements, 'resize' ) );

	// Reposition icons after the text of any element changes
	elements.filter( el => [ 'siteTitle', 'headerIcon' ].indexOf( el.type ) !== -1 )
	.map( el => api( el.id, value => value.bind( makeRepositioner( elements, 'title or header' ) ) ) );

	// Reposition icons after custom-fonts change the elements
	api( 'jetpack_fonts[selected_fonts]', value => value.bind( makeRepositioner( elements, 'custom-fonts' ) ) );

	// When the widget partial refresh runs, reposition icons
	api.bind( 'widget-updated', makeRepositioner( elements, 'widgets' ) );

	// Reposition icons after any customizer setting is changed
	api.bind( 'change', makeRepositioner( elements, 'any setting' ) );

	const $document = $( getWindow().document );

	// Reposition after menus updated
	$document.on( 'customize-preview-menu-refreshed', makeRepositioner( elements, 'menus' ) );

	// Reposition after scrolling in case there are fixed position elements
	$document.on( 'scroll', makeRepositioner( elements, 'scroll' ) );

	// Reposition after page click (eg: hamburger menus)
	$document.on( 'click', makeRepositioner( elements, 'click' ) );

	// Reposition after any page changes (if the browser supports it)
	const page = getWindow().document.querySelector( '#page' );
	if ( page && MutationObserver ) {
		const observer = new MutationObserver( makeRepositioner( elements, 'DOM mutation' ) );
		observer.observe( page, { attributes: true, childList: true, characterData: true } );
	}

	// Support partial update
	const partialUpdateHandler = createPartialUpdateHandler( elements );
	api.selectiveRefresh.partial.bind( 'add', partialUpdateHandler );
	api.selectiveRefresh.partial.each( ( partial ) => {
		partial.deferred.ready.done( () => partialUpdateHandler( partial ) );
	} );
}

function createHandler( element ) {
	element.handler = element.handler || makeDefaultHandler( element.id );
	return element;
}

function removeDuplicateReducer( prev, el ) {
	if ( prev.map( x => x.id ).indexOf( el.id ) !== -1 ) {
		debug( `tried to add duplicate element for ${el.id}` );
		return prev;
	}
	return prev.concat( el );
}

function makeDefaultHandler( id ) {
	return function( event ) {
		event.preventDefault();
		event.stopPropagation();
		debug( 'click detected on', id );
		send( 'control-focus', id );
	};
}

function createPartialUpdateHandler( elements ) {
	return ( partial ) => {
		const elementsToUpdate = elements.filter( element => {
			const $container = element.$partialContainer;

			if ( ! $container || $container.data( 'customize-partial-id' ) !== partial.id ) {
				return false;
			}

			if ( 'function' === typeof element.onPartialUpdate ) {
				element.onPartialUpdate.call( element, partial, element, elements );
			}

			return true;
		} );

		if ( elementsToUpdate.length > 0 )  {
			repositionAfterFontsLoad( elementsToUpdate );
		}
	};
}
