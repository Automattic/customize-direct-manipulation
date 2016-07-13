import getJQ from './jquery';


let animationIsSupported;

export function supportsAnimation() {
	if ( typeof animationIsSupported !== 'undefined' ) {
		return animationIsSupported;
	}
	let animation = false;
	let elm = document.createElement( 'div' );

	if ( elm.style.animationName !== undefined || elm.style.WebkitAnimationName !== 'undefined' ) {
		animation = true;
	}
	animationIsSupported = animation;
	return animation;
}

export function animateWithClass( selector, className, cb, removeAtEnd ) {
	var $el = getJQ()( selector );

	$el.addClass( className ).on( 'animationend webkitAnimationEnd', function() {
		$el.removeClass( className ).off( 'animationend webkitAnimationEnd' );

		if ( getJQ().isFunction( cb ) ) {
			cb.apply( $el );
		}

		if ( removeAtEnd ) {
			$el.remove();
		}
	} );
}

