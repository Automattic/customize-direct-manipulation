import getJQuery from '../helpers/jquery';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:focus-callout' );
const $ = getJQuery();

let timeout;

function addCallout( section, type ) {
	// Highlight menu item controls
	if ( section && section.container && type === 'menu' ) {
		const menuItems = section.container.find( '.customize-control-nav_menu_item' );
		if ( menuItems.length ) {
			debug( 'highlighting menu item', menuItems );
			return callout( menuItems );
		}
	}

	// Highlight header image "new" button
	if ( section && section.btnNew && type === 'header_image' ) {
		const button = $( section.btnNew );
		if ( button.length ) {
			debug( 'highlighting "new" button', button );
			return callout( button );
		}
	}

	// Highlight whatever is focused
	const focused = $( ':focus' );
	if ( focused.length ) {
		debug( 'highlighting the focused element', focused );
		return callout( focused );
	}

	debug( 'could not find any focused element to highlight' );
}

function callout( $el ) {
	$el.focus();
	$el.addClass( 'cdm-subtle-focus' ).on( 'animationend webkitAnimationEnd', () => {
		$el.off( 'animationend webkitAnimationEnd' ).removeClass( 'cdm-subtle-focus' );
	} );
}

export default function focusCallout( section, type ) {
	clearTimeout( timeout );
	section.focus();
	setTimeout( () => addCallout( section, type ), 410 );
}
