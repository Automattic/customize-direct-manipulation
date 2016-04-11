import getAPI from '../helpers/api';
import getWindow from '../helpers/window';

const api = getAPI();
const thisWindow = getWindow();

/**
 * Run a function whenever a specific setting changes.
 *
 * The callback will receive two arguments:
 *
 * 1. The setting Id
 * 2. The new setting value
 *
 * @param {string} settingId - The setting name.
 * @param {function} callback - The function to call when a setting changes.
 */
export function onSettingChange( settingId, callback ) {
	api( settingId, setting => setting.bind( () => callback( settingId, getSettingValue( settingId ) ) ) );
}

/**
 * Run a function whenever any setting changes.
 *
 * The callback will receive two arguments:
 *
 * 1. The setting Id
 * 2. The new setting value
 *
 * @param {function} callback - The function to call when a setting changes.
 */
export function onChange( callback ) {
	api.bind( 'change', setting => callback( setting.id, getSettingValue( setting.id ) ) );
}

/**
 * Return true if any setting has changed.
 *
 * @return {boolean} True if any setting has changed.
 */
export function areSettingsChanged() {
	return getAllSettingIds().some( isSettingChanged );
}

/**
 * Return an object of changed settings.
 *
 * Each key is a setting Id, and each value is the setting value.
 *
 * @return {Object} All changed settings.
 */
export function getChangedSettings() {
	return getAllSettingIds()
	.filter( isSettingChanged )
	.reduce( ( settings, settingId ) => {
		settings[ settingId ] = getSettingValue( settingId );
		return settings;
	}, {} );
}

/**
 * Return true if this script is running in the preview.
 *
 * Returns false if the script is running in the control frame.
 *
 * @return {boolean} True if this is the preview frame.
 */
export function isPreviewFrame() {
	return typeof api.preview !== 'undefined';
}

/**
 * Changes a setting value.
 *
 * @param {string} settingId - The setting name.
 * @param {*} value - The new setting value.
 */
export function changeSettingValue( settingId, value ) {
	if ( isPreviewFrame() ) {
		const parentApi = getParentApi();
		if ( ! parentApi ) {
			return;
		}
		changeSettingValueForApi( parentApi, settingId, value );
	}
	changeSettingValueForApi( api, settingId, value );
}

/**
 * Return the current value of a setting.
 *
 * @param {string} settingId - The setting name.
 * @return {*} The setting value.
 */
export function getSettingValue( settingId ) {
	return api.get()[ settingId ];
}

/**
 * Return all setting Ids.
 *
 * @return {Array} All the setting names.
 */
export function getAllSettingIds() {
	return Object.keys( api.get() );
}

/**
 * Return true if the setting has changed.
 *
 * @param {string} settingId - The setting name.
 * @return {boolean} True if the setting has changed.
 */
export function isSettingChanged( settingId ) {
	return api.instance( settingId )._dirty;
}

/**
 * Force the preview frame to reload.
 */
export function reloadPreview() {
	if ( api.previewer ) {
		api.previewer.refresh();
	}
	const parentApi = getParentApi();
	if ( parentApi && parentApi.previewer ) {
		parentApi.previewer.refresh();
	}
}

/*******************
 * Private functions
 *******************/

function getParentApi() {
	if ( thisWindow.parent.wp ) {
		return thisWindow.parent.wp.customize;
	}
	return null;
}

function changeSettingValueForApi( thisApi, settingId, value ) {
	const instance = thisApi.instance( settingId );
	if ( ! instance ) {
		return null;
	}
	instance.set( value );
	return value;
}
