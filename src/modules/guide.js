import $ from 'jquery';
import { getHtml, getCurrentStep, getTotalSteps, nextStep, isLastStep, getStepPosition } from './guide-steps';
import { recordEvent } from '../helpers/record-event';
import { animateWithClass, supportsAnimation } from '../helpers/animate';
import getOptions from '../helpers/options';

function showGuide() {
	$( 'body' ).append( getHtml() );
	$( '#dmguide' ).offset( getStepPosition() );
	addEvents();

	if ( supportsAnimation() ) {
		animateWithClass( '#dmguide-overlay', 'entering' );
	}

	recordEvent( 'wpcom_customize_guide_show' );
}

function addEvents() {
	$( '#dmguide' ).on( 'click.dmguide', '.dmguide-button', maybeGoToNextStep );
	$( '#dmguide-overlay' ).on( 'click.dmguide', maybeAllowDismissal );
}

function dismiss() {
	removeGuide();
	$( document ).off( '.dmguide' );
	recordEvent( 'wpcom_customize_guide_dismiss' );
}

function maybeAllowDismissal() {
	if ( isLastStep() ) {
		dismiss();
	}
}

function removeGuide() {
	$( '#dmguide' ).off( 'click.dmguide' );
	$( '#dmguide-overlay' ).off( 'click.dmguide' );

	if ( supportsAnimation() ) {
		animateWithClass( '#dmguide-overlay', 'exiting', function() {
			this.hide();
		}, true );
	} else {
		$( '#dmguide-overlay' ).remove();
	}
}

function maybeGoToNextStep() {
	if ( getTotalSteps() > getCurrentStep() ) {
		nextStep();
	}
}

export default function addGuide( countdown = 2500 ) {
	countdown = getOptions().steps[ 0 ].startDelay || countdown;
	setTimeout( showGuide, countdown );
}
