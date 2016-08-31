import getAPI from '../helpers/api';
import { send } from '../helpers/messenger';
import getJQuery from '../helpers/jquery';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:widgets' );
const api = getAPI();
const $ = getJQuery();

export function getWidgetElements() {
	return getWidgetSelectors()
	.map( getWidgetsForSelector )
	.reduce( ( widgets, id ) => widgets.concat( id ), [] ) // flatten the arrays
	.map( id => ( {
		id,
		selector: getWidgetSelectorForId( id ),
		type: 'widget',
		handler: makeHandlerForId( id ),
		title: 'widget',
	} ) );
}

function getWidgetSelectors() {
	return api.WidgetCustomizerPreview.widgetSelectors;
}

function getWidgetsForSelector( selector ) {
	const $el = $( selector );
	if ( ! $el.length ) {
		debug( 'found no widgets for selector', selector );
		return [];
	}
	debug( 'found widgets for selector', selector, $el );
	return $.makeArray( $el.map( ( i, w ) => w.id ) );
}

function getWidgetSelectorForId( id ) {
	return `#${id}`;
}

function makeHandlerForId( id ) {
	return function( event ) {
		event.preventDefault();
		event.stopPropagation();
		debug( 'click detected on', id );
		send( 'focus-widget-control', id );
	};
}
