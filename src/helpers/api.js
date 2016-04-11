import getWindow from './window';

export default function getAPI() {
	if ( ! getWindow().wp || ! getWindow().wp.customize ) {
		throw new Error( 'No WordPress customizer API found' );
	}
	return getWindow().wp.customize;
}
