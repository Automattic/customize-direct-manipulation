import { send } from '../helpers/messenger';
import getOptions from '../helpers/options.js';

const opts = getOptions();

export function getMenuElements() {
	return opts.menus.map( menu => {
		return {
			id: menu.id,
			selector: `.${menu.id}`,
			type: 'menu',
			handler: makeHandler( menu.location ),
			title: 'menu',
			onPartialUpdate: onPartialUpdate,
		};
	} );
}

function makeHandler( id ) {
	return function() {
		send( 'focus-menu', id );
	};
}

function onPartialUpdate( partial, element, elements ) {
	// Select the first menu item as a target if exists.
	// This will prevent menu icons from offsetting too far.
	// See https://github.com/Automattic/customize-direct-manipulation/issues/3
	if ( element.$partialContainer ) {
		const $firstMenuItem = element.$partialContainer.find('.menu-item:visible:first');
		if ( $firstMenuItem.length && ! $firstMenuItem.is( element.$target ) ) {
			element.$target = $firstMenuItem;
		}
	}
}
