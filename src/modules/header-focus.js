import getJQuery from '../helpers/jquery';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:header-focus' );
const fallbackSelector = '.site-header';
const $ = getJQuery();

export function getHeaderElements() {
	return [ getHeaderElement() ];
}

function getHeaderElement() {
	const selector = getHeaderSelector();
	const position = ( selector === fallbackSelector ) ? 'top-right' : null;
	return { id: 'header_image', selector, type: 'header', icon: 'headerIcon', position, title: 'header image', };
}

function getHeaderSelector() {
	const selector = getModifiedSelectors();
	if ( $( selector ).length > 0 ) {
		return selector;
	}
	debug( 'failed to find header image selector in page; using fallback' );
	return fallbackSelector;
}

function getModifiedSelectors() {
	return [
		'.header-image a img',
		'.header-image img',
		'.site-branding a img',
		'.site-header-image img',
		'.header-image-link img',
		'img.header-image',
		'img.header-img',
		'img.headerimage',
		'img.custom-header',
		'.featured-header-image a img'
	].map( selector => selector + '[src]:not(\'.site-logo\'):not(\'.wp-post-image\'):not(\'.custom-logo\')' ).join();
}
