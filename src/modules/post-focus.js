import getWindow from '../helpers/window';
import getJQuery from '../helpers/jquery';
import debugFactory from 'debug';
import { send } from '../helpers/messenger';

const debug = debugFactory( 'cdm:post-focus' );
const $ = getJQuery();

export function getPostElements() {
	const selector = '.hentry';
	const $el = $( selector );
	if ( ! $el.length ) {
		debug( `found no posts for selector ${selector}` );
		return [];
	}
	return $.makeArray( $el )
	.reduce( ( posts, post ) => {
		const url = getPostEditLink( post );
		if ( ! url ) {
			return posts;
		}
		return posts.concat( {
			id: post.id,
			selector: `#${post.id} .entry-title`,
			type: 'post',
			position: 'middle',
			handler: makeHandler( post.id, url ),
			title: 'post',
		} );
	}, [] );
}

function getPostEditLink( post ) {
	const editLink = $( post ).find( '.post-edit-link' );
	if ( editLink.length !== 1 ) {
		debug( `other than one edit link found for ${post.id}` );
	}
	const url = editLink.attr( 'href' );
	if ( ! url ) {
		debug( `invalid edit link URL for ${post.id}` );
	}
	return url;
}

function makeHandler( id, url ) {
	return function( event ) {
		event.preventDefault();
		event.stopPropagation();
		debug( `click detected on ${id}` );
		getWindow().open( url );
		send( 'recordEvent', {
			name: 'wpcom_customize_direct_manipulation_click',
			props: { type: 'post-icon' }
		} );
	};
}
