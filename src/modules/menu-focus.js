import { send } from '../helpers/messenger';
import getOptions from '../helpers/options.js';

const opts = getOptions();

export function getMenuElements() {
	return opts.menus.map( menu => {
		return {
			id: menu.id,
			selector: `.${menu.id}`,
			type: 'menu',
			handler: makeHandler( menu.location )
		};
	} );
}

function makeHandler( id ) {
	return function() {
		send( 'focus-menu', id );
	}
}
