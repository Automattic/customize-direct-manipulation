import getAPI from './helpers/api';
import getJQuery from './helpers/jquery';
import { off, send } from './helpers/messenger';
import addFocusListener from './modules/focus-listener';
import { bindPreviewEventsListener } from './helpers/record-event';
import { addGuideToPage } from './modules/guide';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:admin' );
const api = getAPI();
const $ = getJQuery();

// do some focusing
api.bind( 'ready', () => {
	debug( 'admin is ready' );

	addFocusListener( 'control-focus', id => api.control( id ) );
	addFocusListener( 'focus-menu', id => api.section( id ) );
	addFocusListener( 'focus-menu-location', id => api.control( `nav_menu_locations[${id}]` ) );

	// disable core so we can enhance by making sure the controls panel opens
	// before trying to focus the widget
	off( 'focus-widget-control', api.Widgets.focusWidgetFormControl );
	addFocusListener( 'focus-widget-control', id => api.Widgets.getWidgetFormControlForWidget( id ) );

	// Toggle icons when customizer toggles preview mode
	$( '.collapse-sidebar' ).on( 'click', () => send( 'cdm-toggle-visible' ) );

	bindPreviewEventsListener();

	// Show 'em around the place
	addGuideToPage();
} );
