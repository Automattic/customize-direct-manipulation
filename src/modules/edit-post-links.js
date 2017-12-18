import $ from 'jquery';
import debugFactory from 'debug';
import getWindow from '../helpers/window';
import { send } from '../helpers/messenger';

const debug = debugFactory( 'cdm:edit-post-links' );

export function modifyEditPostLinks( selector ) {
	debug( 'listening for clicks on post edit links with selector', selector );
	// We use mousedown because click has been blocked by some other JS
	$( 'body' ).on( 'mousedown', selector, event => {
		getWindow().open( event.target.href );
		send( 'recordEvent', {
			name: 'wpcom_customize_direct_manipulation_click',
			props: { type: 'post-edit' },
		} );
	} );
}

export function disableEditPostLinks( selector ) {
	debug( 'hiding post edit links with selector', selector );
	$( selector ).hide();
}
