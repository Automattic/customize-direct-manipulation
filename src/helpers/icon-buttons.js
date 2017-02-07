import getWindow from '../helpers/window';
import getJQuery from '../helpers/jquery';
import { on } from '../helpers/messenger';
import getUnderscore from '../helpers/underscore';
import addClickHandler from '../helpers/click-handler';
import getOptions from '../helpers/options';
import debugFactory from 'debug';

const _ = getUnderscore();
const debug = debugFactory( 'cdm:icon-buttons' );
const $ = getJQuery();

// Elements will default to using `editIcon` but if an element has the `icon`
// property set, it will use that as the key for one of these icons instead:
const icons = {
	headerIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="0" fill="none" width="24" height="24"/><g><path d="M13 9.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zM22 6v12c0 1.105-.895 2-2 2H4c-1.105 0-2-.895-2-2V6c0-1.105.895-2 2-2h16c1.105 0 2 .895 2 2zm-2 0H4v7.444L8 9l5.895 6.55 1.587-1.85c.798-.932 2.24-.932 3.037 0L20 15.426V6z"/></g></svg>',
	editIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="0" fill="none" width="24" height="24"/><g><path d="M13 6l5 5-9.507 9.507c-.686-.686-.69-1.794-.012-2.485l-.002-.003c-.69.676-1.8.673-2.485-.013-.677-.677-.686-1.762-.036-2.455l-.008-.008c-.694.65-1.78.64-2.456-.036L13 6zm7.586-.414l-2.172-2.172c-.78-.78-2.047-.78-2.828 0L14 5l5 5 1.586-1.586c.78-.78.78-2.047 0-2.828zM3 18v3h3c0-1.657-1.343-3-3-3z"/></g></svg>',
};

/**
 * Create (if necessary) and position an icon button relative to its target.
 *
 * See `makeFocusable` for the format of the `element` param.
 *
 * If positioning the icon was successful, this function returns a copy of the
 * element it was passed with the additional parameters `$target` and `$icon`
 * that are cached references to the DOM elements. If the positioning failed, it
 * just returns the element unchanged.
 *
 * @param {Object} element - The data to use when constructing the icon.
 * @return {Object} The element that was passed, with additional data included.
 */
export function positionIcon( element ) {
	const $target = getElementTarget( element );
	if ( ! $target.length ) {
		debug( `Could not find target element for icon ${ element.id } with selector ${ element.selector }` );
		return element;
	}

	const $partialContainer = ( $target.data( 'customize-partial-id' ) ) ? $target : null;
	const $icon = findOrCreateIcon( element );
	const css = getCalculatedCssForIcon( element, $target, $icon );
	debug( `positioning icon for ${ element.id } with CSS ${ JSON.stringify( css ) }` );
	$icon.css( css );
	return _.extend( {}, element, { $target, $icon, $partialContainer } );
}

export function addClickHandlerToIcon( element ) {
	if ( ! element.$icon ) {
		return element;
	}
	addClickHandler( `.${ getIconClassName( element.id ) }`, element.handler );
	return element;
}

const iconRepositioner = _.debounce( elements => {
	debug( `repositioning ${ elements.length } icons` );
	elements.map( positionIcon );
}, 350 );

export function repositionIcons( elements ) {
	iconRepositioner( elements );
}

export function repositionAfterFontsLoad( elements ) {
	iconRepositioner( elements );

	if ( getWindow().document.fonts ) {
		getWindow().document.fonts.ready.then( iconRepositioner.bind( null, elements ) );
	}
}

/**
 * Toggle icons when customizer toggles preview mode.
 */
export function enableIconToggle() {
	on( 'cdm-toggle-visible', () => $( '.cdm-icon' ).toggleClass( 'cdm-icon--hidden' ) );
}

function findOrCreateIcon( element ) {
	if ( element.$icon ) {
		return element.$icon;
	}
	const $icon = $( `.${ getIconClassName( element.id ) }` );
	if ( $icon.length ) {
		return $icon;
	}

	const title = getOptions().translations[ element.type ] || `Click to edit the ${ element.title }`;

	return createAndAppendIcon( element.id, element.icon, title );
}

function getIconClassName( id ) {
	return `cdm-icon__${ id }`;
}

function isTargetHidden( $target ) {
	return ( ! $target.is( ':visible' ) || $target.css( 'visibility' ) === 'hidden' || $target.css( 'clip' ) === 'rect(1px 1px 1px 1px)' );
}

function getCalculatedCssForIcon( element, $target, $icon ) {
	const isRTL = ( 'rtl' === getWindow().document.dir );
	const position = element.position;
	const hiddenIconPos = isRTL ? { right: -1000, left: 'auto' } : { left: -1000, right: 'auto' };

	if ( isTargetHidden( $target ) ) {
		debug( `target is not visible when positioning ${ element.id }. I will hide the icon. target:`, $target );
		return hiddenIconPos;
	}

	const offset = $target.offset();
	let top = offset.top;
	const left = offset.left;
	const right = getWindow().innerWidth - offset.left - $target.outerWidth() - $icon.outerWidth();
	let middle = $target.innerHeight() / 2;
	let iconMiddle = $icon.innerHeight() / 2;

	if ( top < 0 ) {
		debug( `target top offset ${ top } is unusually low when positioning ${ element.id }. I will hide the icon. target:`, $target );
		return hiddenIconPos;
	}
	if ( middle < 0 ) {
		debug( `target middle offset ${ middle } is unusually low when positioning ${ element.id }. I will hide the icon. target:`, $target );
		return hiddenIconPos;
	}
	if ( top < 1 ) {
		debug( `target top offset ${ top } is unusually low when positioning ${ element.id }. I will adjust the icon downwards. target:`, $target );
		top = 0;
	}
	if ( middle < 1 ) {
		debug( `target middle offset ${ middle } is unusually low when positioning ${ element.id }. I will adjust the icon downwards. target:`, $target );
		middle = 0;
		iconMiddle = 0;
	}

	const coords = { top };
	if ( isRTL ) {
		_.extend( coords, { left: 'auto', right } );
	} else {
		_.extend( coords, { left, right: 'auto' } );
	}

	if ( position === 'middle' ) {
		coords.top += middle - iconMiddle;
	} else if ( position === 'top-right' ) {
		if ( isRTL ) {
			// Actually, the icon will be shown at the top left of the target in RTL mode.
			coords.right += $target.width() + 70;
		} else {
			coords.left += $target.width() + 70;
		}
	}

	return adjustCoordinates( coords );
}

function adjustCoordinates( coords ) {
	const minLeft = 35;
	const minRight = 110;

	if ( 'auto' !== coords.left ) {
		// Try to avoid overlapping hamburger menus
		const maxLeft = getWindow().innerWidth - minRight;
		coords.left = clamp( minLeft, coords.left, maxLeft );
	} else if ( 'auto' !== coords.right ) {
		const maxRight = getWindow().innerWidth - minLeft;
		coords.right = clamp( minRight, coords.right, maxRight );
	}
	return coords;
}

function clamp( min, value, max ) {
	if ( min > value ) {
		value = min;
	}
	if ( max < value ) {
		value = max;
	}
	return value;
}

function createIcon( id, iconType, title ) {
	const iconClassName = getIconClassName( id );
	switch ( iconType ) {
		case 'headerIcon':
			return $( `<div class="cdm-icon cdm-icon--header-image ${ iconClassName }" title="${ title }">${ icons.headerIcon }</div>` );
		default:
			return $( `<div class="cdm-icon cdm-icon--text ${ iconClassName }" title="${ title }">${ icons.editIcon }</div>` );
	}
}

function createAndAppendIcon( id, iconType, title ) {
	const $icon = createIcon( id, iconType, title );
	$( getWindow().document.body ).append( $icon );
	return $icon;
}

function getElementTarget( element ) {
	if ( element.$target && ! element.$target.parent().length ) {
		// target was removed from DOM, likely by partial refresh
		element.$target = null;
	}

	return element.$target || $( element.selector );
}
