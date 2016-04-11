let windowObj = null;

export function setWindow( obj ) {
	windowObj = obj;
}

export default function getWindow() {
	if ( ! windowObj && ! window ) {
		throw new Error( 'No window object found.' );
	}
	return windowObj || window;
}
