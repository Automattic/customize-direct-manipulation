import resetMarkup from './mock-window';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';
import getWindow from '../src/helpers/window';
import getJQuery from '../src/helpers/jquery';
import { positionIcon } from '../src/helpers/icon-buttons';

chai.use( sinonChai );
const expect = chai.expect;
const $ = getJQuery();

describe( 'positionIcon()', function() {
	afterEach( function() {
		resetMarkup();
	} );

	it( 'returns the element it was passed if the target element cannot be found', function() {
		const element = {
			id: 'test',
			selector: '.does-not-exist',
			type: 'testType',
		};
		expect( positionIcon( element ) ).to.equal( element );
	} );

	it( 'returns a copy of the element it was passed if the target element is found', function() {
		const element = {
			id: 'test',
			selector: '.site-title',
			type: 'testType',
		};
		const actual = positionIcon( element );
		expect( actual ).to.not.equal( element );
		expect( actual ).to.contain.all.keys( Object.keys( element ) );
	} );

	it( 'returns an element with cached target and icon parameters if the target element is found', function() {
		const element = {
			id: 'test',
			selector: '.site-title',
			type: 'testType',
		};
		expect( positionIcon( element ) ).to.contain.all.keys( [ '$target', '$icon' ] );
	} );

	describe( 'when creating the icon button', function() {
		it( 'does not create an icon button if the target element cannot be found', function() {
			const element = {
				id: 'test',
				selector: '.does-not-exist',
				type: 'testType',
			};
			positionIcon( element );
			expect( $( '.cdm-icon__test' ) ).to.have.length( 0 );
		} );

		it( 'creates an icon button if the target element can be found', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
			};
			positionIcon( element );
			expect( $( '.cdm-icon__test' ) ).to.have.length( 1 );
		} );

		it( 'does not create duplicate icon buttons when run twice', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
			};
			const newElement = positionIcon( element );
			positionIcon( newElement );
			expect( $( '.cdm-icon__test' ) ).to.have.length( 1 );
		} );

		it( 'creates an icon button with the `cdm-icon` class', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
			};
			positionIcon( element );
			expect( $( '.cdm-icon__test' ).hasClass( 'cdm-icon' ) ).to.be.true;
		} );

		it( 'creates an icon button with the `cdm-icon--text` class for most element types', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
			};
			positionIcon( element );
			const $el = $( '.cdm-icon__test' );
			expect( $el.hasClass( 'cdm-icon--text' ) ).to.be.true;
			expect( $el.hasClass( 'cdm-icon--header-image' ) ).to.be.false;
		} );

		it( 'creates an icon button with the `cdm-icon--header-image` class for the `headerIcon` icon image', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				icon: 'headerIcon',
			};
			positionIcon( element );
			const $el = $( '.cdm-icon__test' );
			expect( $el.hasClass( 'cdm-icon--text' ) ).to.be.false;
			expect( $el.hasClass( 'cdm-icon--header-image' ) ).to.be.true;
		} );

		it( 'creates an icon button with the title attribute', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				icon: 'headerIcon',
				title: 'test type',
			};
			positionIcon( element );
			expect( $( '.cdm-icon__test' ).attr( 'title' ) ).equals( 'Click to edit the test type' );
		} );
	} );

	describe( 'when positioning the icon button', function() {
		let mockTarget = null;
		let mockIcon = null;
		let cssSpy = null;

		beforeEach( function() {
			// Mock target element because jsdom has no positioning
			mockTarget = $( '.site-title' );
			mockTarget.offset = () => ( { top: 100, left: 100 } );
			mockTarget.innerHeight = () => 40;
			mockTarget.width = () => 200;
			mockTarget.is = prop => ( prop === ':visible' );

			// Mock icon because jsdom has no positioning
			// Use a random page element as the 'icon' for this test so we don't have to add it
			mockIcon = $( '.site-description' );
			mockIcon.innerHeight = () => 18;
			cssSpy = sinon.spy();
			mockIcon.css = cssSpy;
		} );

		it( 'positions the icon off-screen when the target element is hidden with `display`', function() {
			mockTarget.is = prop => ( prop !== ':visible' );
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: -1000, right: 'auto' } );
		} );

		it( 'positions the icon off-screen when the target element is hidden with `visibility`', function() {
			mockTarget.css( 'visibility', 'hidden' );
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: -1000, right: 'auto' } );
		} );

		it( 'positions the icon off-screen when the target element is hidden with `clip`', function() {
			// clip property does not appear to work with jsdom so we fake it
			const mockTargetProperties = {};
			mockTarget.css = ( prop, val ) => {
				if ( ! val ) {
					return mockTargetProperties[ prop ];
				}
				mockTargetProperties[ prop ] = val;
			};
			mockTarget.css( 'clip', 'rect(1px 1px 1px 1px)' );
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: -1000, right: 'auto' } );
		} );

		it( 'positions the icon off-screen when the target element is hidden (RTL)', function() {
			const documentDir = getWindow().document.dir;
			getWindow().document.dir = 'rtl';

			mockTarget.is = prop => ( prop !== ':visible' );
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: 'auto', right: -1000 } );

			// restore dir
			getWindow().document.dir = documentDir;
		} );

		it( 'positions the icon at the screen edge when the target element has a very low top offset', function() {
			mockTarget.offset = () => ( { top: 0, left: 100 } );
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: 100, right: 'auto', top: 0 } );
		} );

		it( 'positions the icon off-screen when the target element has a negative top offset', function() {
			mockTarget.offset = () => ( { top: -1, left: 100 } );
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: -1000, right: 'auto' } );
		} );

		it( 'positions the icon off-screen when the target element has a very low top offset (RTL)', function() {
			const documentDir = getWindow().document.dir;
			getWindow().document.dir = 'rtl';

			mockTarget.offset = () => ( { top: -1, left: 100 } );
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: 'auto', right: -1000 } );

			// restore dir
			getWindow().document.dir = documentDir;
		} );

		it( 'positions the icon off-screen when the target element is very small', function() {
			mockTarget.innerHeight = () => -1;
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: -1000, right: 'auto' } );
		} );

		it( 'positions the icon off-screen when the target element is very small (RTL)', function() {
			const documentDir = getWindow().document.dir;
			getWindow().document.dir = 'rtl';

			mockTarget.innerHeight = () => -1;
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { left: 'auto', right: -1000 } );

			// restore dir
			getWindow().document.dir = documentDir;
		} );

		it( 'positions the icon at the top-left of the target', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { top: 100, left: 100, right: 'auto' } );
		} );

		it( 'positions the icon at the left edge of the viewport if it would be off the left side', function() {
			// Note that jsdom makes the viewport width = 1024
			mockTarget.offset = () => ( { top: 100, left: 10 } );
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { top: 100, left: 35, right: 'auto' } );
		} );

		it( 'positions the icon at the left middle of the target if the position is `middle`', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				position: 'middle',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { top: 111, left: 100, right: 'auto' } );
		} );

		it( 'positions the icon at the top-right of the target if the position is `top-right`', function() {
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				position: 'top-right',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { top: 100, left: 370, right: 'auto' } );
		} );

		it( 'positions the icon at the right edge of the viewport if it would be off the right side', function() {
			// Note that jsdom makes the viewport width = 1024
			mockTarget.width = () => 1200;
			const element = {
				id: 'test',
				selector: '.site-title',
				type: 'testType',
				position: 'top-right',
				$target: mockTarget,
				$icon: mockIcon,
			};
			positionIcon( element );
			expect( cssSpy ).to.have.been.calledWith( { top: 100, left: 914, right: 'auto' } );
		} );
	} );
} );
