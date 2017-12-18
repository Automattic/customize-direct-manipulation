import getWindow from './window';

export default function getOptions() {
	return getWindow()._Customizer_DM;
}

export function isDisabled( moduleName ) {
	return ( -1 !== getOptions().disabledModules.indexOf( moduleName ) );
}
