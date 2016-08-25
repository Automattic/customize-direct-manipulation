import getJQuery from '../helpers/jquery';
import debugFactory from 'debug';

const debug = debugFactory( 'cdm:footer-focus' );
const $ = getJQuery();

export function getFooterElements() {
	return [
		{
			id: 'footercredit',
			selector: 'a[data-type="footer-credit"]',
			type: 'footer',
			position: 'middle'
		}
	];
}
