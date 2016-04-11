import getAPI from './api';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:messenger' );
const api = getAPI();

function getPreview() {
	// wp-admin is previewer, frontend is preview. why? no idea.
	return typeof api.preview !== 'undefined' ? api.preview : api.previewer;
}

export function send( id, data ) {
	debug( 'send', id, data );
	return getPreview().send( id, data );
}

export function on( id, callback ) {
	debug( 'on', id, callback );
	return getPreview().bind( id, callback );
}

export function off( id, callback = false ) {
	debug( 'off', id, callback );
	if ( callback ) {
		return getPreview().unbind( id, callback );
	}
	// no callback? Get rid of all of 'em
	const topic = getPreview().topics[ id ];
	if ( topic ) {
		return topic.empty();
	}
}
