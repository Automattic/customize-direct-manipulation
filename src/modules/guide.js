import { getHtml, getStepHtml } from './guide-steps';
import getJQ from '../helpers/jquery';
import { recordEvent } from '../helpers/record-event';
import { animateWithClass, supportsAnimation } from '../helpers/animate';

function showGuide() {
	getJQ()( 'body' ).append( getHtml() );
	addEvents();

	if ( supportsAnimation() ) {
		animateWithClass( '#dmguide-overlay', 'entering' );
	}
}

function addEvents() {
	getJQ()( '#dmguide' ).on( 'click.dmguide', '.dmguide-button', dismiss );
	getJQ()( '#dmguide-overlay' ).on( 'click.dmguide', dismiss );
	getJQ()( document ).on( 'click.dmguide', dismiss ).on( 'keyup.dmguide', onKeyUp );
}

function dismiss() {
	removeGuide();
	getJQ()( document ).off( '.dmguide' );
	recordEvent( 'wpcom_nux_dmguide_dismiss' );
}

function removeGuide() {
	getJQ()( '#dmguide' ).off( 'click.dmguide' );
	getJQ()( '#dmguide-overlay' ).off( 'click.dmguide' );

	if ( supportsAnimation() ) {
		animateWithClass( '#dmguide-overlay', 'exiting', function() {
			this.hide();
		}, true );
	} else {
		$( '#dmguide-overlay' ).remove();
	}
}

function onKeyUp( event ) {
	// escape key
	if ( event.which === 27 ) {
		dismiss();
	}
}

export default function addGuide( countdown = 2500 ) {
	setTimeout( showGuide, countdown );
}