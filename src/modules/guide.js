import { nextStep, isLastStep, getHtml, getStepHtml } from './guide-steps';
import getJQ from '../helpers/jquery';


export function addGuideToPage() {
	getJQ()( 'body' ).append( getHtml() );
	addEvents();
}


function addEvents() {

}