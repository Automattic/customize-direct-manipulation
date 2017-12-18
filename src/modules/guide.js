import { getHtml, getCurrentStep, getTotalSteps, nextStep, isLastStep, getStepPosition } from './guide-steps';
import getJQ from '../helpers/jquery';
import { recordEvent } from '../helpers/record-event';
import { animateWithClass, supportsAnimation } from '../helpers/animate';
import getOptions from '../helpers/options';

function showGuide() {
	getJQ()( 'body' ).append( getHtml() );
	getJQ()( '#dmguide' ).offset( getStepPosition() );
	addEvents();

	if ( supportsAnimation() ) {
		animateWithClass( '#dmguide-overlay', 'entering' );
	}

	recordEvent( 'wpcom_customize_guide_show' );
}

function addEvents() {
	getJQ()( '#dmguide' ).on( 'click.dmguide', '.dmguide-button', maybeGoToNextStep );
	getJQ()( '#dmguide-overlay' ).on( 'click.dmguide', maybeAllowDismissal );
}

function dismiss() {
	removeGuide();
	getJQ()( document ).off( '.dmguide' );
	recordEvent( 'wpcom_customize_guide_dismiss' );
}

function maybeAllowDismissal() {
	if ( isLastStep() ) {
		dismiss();
	}
}

function removeGuide() {
	getJQ()( '#dmguide' ).off( 'click.dmguide' );
	getJQ()( '#dmguide-overlay' ).off( 'click.dmguide' );

	if ( supportsAnimation() ) {
		animateWithClass( '#dmguide-overlay', 'exiting', function() {
			this.hide();
		}, true );
	} else {
		getJQ()( '#dmguide-overlay' ).remove();
	}
}

function onKeyUp( event ) {
	// escape key
	if ( event.which === 27 ) {
		dismiss();
	}
}

function maybeGoToNextStep() {
	if ( getTotalSteps() > getCurrentStep() ) {
		nextStep();
	}
}


export default function addGuide( countdown = 2500 ) {
	countdown = getOptions().steps[0].startDelay || countdown;
	setTimeout( showGuide, countdown );
}
