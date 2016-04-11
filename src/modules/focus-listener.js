import { on } from '../helpers/messenger';
import { isPreviewing, disablePreview } from '../helpers/small-screen-preview';
import focusCallout from './focus-callout';
import { recordEvent } from '../helpers/record-event';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:focus-listener' );
const eventMap = {
	'focus-widget-control': 'widget',
	'focus-menu': 'menu',
	'focus-menu-location': 'menu'
}

export default function addFocusListener( eventName, getControlCallback ) {
	on( eventName, makeHandler( eventName, getControlCallback ) );
}

function makeHandler( eventName, getControlCallback ) {
	return function( ...args ) {
		const eventTargetId = args[0];
		debug( `received ${eventName} event for target id ${eventTargetId}` );
		const focusableControl = getControlCallback.apply( getControlCallback, args );
		if ( ! focusableControl ) {
			debug( `no control found for event ${eventName} and args:`, args );
			return;
		}

		const type = getEventType( eventName, eventTargetId );
		recordEvent( 'wpcom_customize_direct_manipulation_click', { type } );

		// If we are in the small screen preview mode, bring back the controls pane
		if ( isPreviewing() ) {
			debug( 'focusing controls pane' );
			disablePreview();
		}

		focusCallout( focusableControl, type );
	}
}

function getEventType( eventName, eventTargetId ) {
	return eventMap[ eventName ] ? eventMap[ eventName ] : eventTargetId;
}
