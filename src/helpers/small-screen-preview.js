import $ from 'jquery';

export function isPreviewing() {
	// Get truth from DOM. Gross.
	return $( '.wp-full-overlay' ).hasClass( 'preview-only' );
}

export function disablePreview() {
	$( '.customize-controls-preview-toggle' ).click();
}
