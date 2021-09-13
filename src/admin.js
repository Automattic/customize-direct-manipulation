import $ from 'jquery';
import getAPI from './helpers/api';
import { send } from './helpers/messenger';
import addFocusListener from './modules/focus-listener';
import { bindPreviewEventsListener } from './helpers/record-event';
import addGuide from './modules/guide';
import getOpts from './helpers/options';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:admin' );
const api = getAPI();

// do some focusing
api.bind( 'ready', () => {
	debug( 'admin is ready' );

	addFocusListener( 'control-focus', id => api.control( id ) );
	addFocusListener( 'focus-menu', id => api.section( id ) );
	addFocusListener( 'focus-menu-location', id => api.control( `nav_menu_locations[${ id }]` ) );

	// Toggle icons when customizer toggles preview mode
	$( '.collapse-sidebar' ).on( 'click', () => send( 'cdm-toggle-visible' ) );

	// Make the site title clickable
	$( '.customize-info .site-title' ).on( 'click', () => {
		if ( api.previewer ) {
			api.previewer.trigger( 'control-focus', 'blogname' );
		}
	} );

	bindPreviewEventsListener();

	// Show 'em around the place the first time
	if ( getOpts().showGuide ) {
		addGuide();
	}
} );
