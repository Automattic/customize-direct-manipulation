import getWindow from './window';
import { on } from './messenger';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:event' );

export function recordEvent( eventName, props = {} ) {
	debug( `recording Tracks event ${ eventName } with props:`, props );
	getWindow()._tkq = getWindow()._tkq || [];
	getWindow()._tkq.push( [ 'recordEvent', eventName, props ] );
}

export function bindPreviewEventsListener() {
	on( 'recordEvent', data => {
		if ( ! data.name || ! data.props ) {
			return;
		}
		recordEvent( data.name, data.props );
	} );
}
