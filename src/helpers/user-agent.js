import getWindow from '../helpers/window';

export function getUserAgent() {
	return getWindow().navigator.userAgent;
}

export function isSafari() {
	return ( !! getUserAgent().match( /Version\/[\d\.]+.*Safari/ ) );
}

export function isMobileSafari() {
	return ( !! getUserAgent().match( /(iPod|iPhone|iPad)/ ) );
}
