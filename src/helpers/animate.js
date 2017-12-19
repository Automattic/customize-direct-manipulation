import $ from 'jquery';

let animationIsSupported;

export function supportsAnimation() {
	if ( typeof animationIsSupported !== 'undefined' ) {
		return animationIsSupported;
	}
	let animation = false;
	const elm = document.createElement( 'div' );

	if ( elm.style.animationName !== undefined || elm.style.WebkitAnimationName !== 'undefined' ) {
		animation = true;
	}
	animationIsSupported = animation;
	return animation;
}

export function animateWithClass( selector, className, cb, removeAtEnd ) {
	const $el = $( selector );

	$el.addClass( className ).on( 'animationend webkitAnimationEnd', function() {
		$el.removeClass( className ).off( 'animationend webkitAnimationEnd' );

		if ( $.isFunction( cb ) ) {
			cb.apply( $el );
		}

		if ( removeAtEnd ) {
			$el.remove();
		}
	} );
}

