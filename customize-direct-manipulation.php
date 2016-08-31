<?php
/*
Plugin Name: Customize Direct Manipulation
Plugin URI: https://github.com/Automattic/customize-direct-manipulation
Description: Click-to-edit in the Customizer
Author: Automattic
Author URI: http://automattic.com/
Version: 1.0.0
*/

/**
 * Copyright (c) 2015 Automattic. All rights reserved.
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 *
 * This is an add-on for WordPress
 * http://wordpress.org/
 *
 * **********************************************************************
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * **********************************************************************
 */

class Jetpack_Customizer_DM {

	private static $instance;

	private $menu_counter = 0;

	private $nav_menus = array();

	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self;
		}
		return self::$instance;
	}

	public function init() {
		if ( ! is_customize_preview() ) {
			return;
		}
		add_action( 'customize_controls_enqueue_scripts', array( $this, 'admin_enqueue' ) );
		add_action( 'customize_preview_init', array( $this, 'preview_enqueue' ), 9 );
		add_filter( 'customize_widget_partial_refreshable', '__return_true', 20 );
		add_filter( 'wp_page_menu_args', array( $this, 'maybe_add_page_menu_class' ) );
		add_filter( 'wp_nav_menu_args', array( $this, 'make_nav_menus_discoverable' ) );
	}

	public function make_nav_menus_discoverable( $args ) {
		// only for theme locations
		if ( empty( $args['theme_location'] ) ) {
			return $args;
		}
		$location = $args['theme_location'];

		if ( ! empty( $args['container'] ) ) {
			$class_name = $this->make_unique_id( 'cdm-menu-for-' . $location );
			$this->store_menu( $class_name, $location );
			if ( ! empty( $args['container_class'] ) ) {
				$class_name = $args['container_class'] . ' ' . $class_name;
			}
			$args['container_class'] = $class_name;
		}

		return $args;
	}

	private function make_unique_id( $id ) {
		$this->menu_counter++;
		return $id . '-' . $this->menu_counter;
	}

	private function store_menu( $id, $location ) {
		// dedupe
		if ( isset( $this->nav_menus[ $id ] ) ) {
			return;
		}
		$locations = get_nav_menu_locations();
		if ( ! isset( $locations[ $location ] ) ) {
			return;
		}
		$menu = wp_get_nav_menu_object( $locations[ $location ] );
		if ( ! $menu ) {
			return;
		}
		$this->nav_menus[ $id ] = "nav_menu[{$menu->term_id}]";
	}

	private function get_menu_data() {
		$menus = array();
		foreach( $this->nav_menus as $id => $location ) {
			$menus[] = compact( 'id', 'location' );
		}

		return $menus;
	}

	private function should_show_guide() {
		// a8c testing
		if ( function_exists( 'is_automattician' ) && is_automattician() && isset( $_GET['guide'] ) ) {
			return true;
		}
		// Only to newer users
		$this_user_id = (int) get_current_user_id();
		$minimum_user_id = 99855465;
		if ( $this_user_id < $minimum_user_id ) {
			return false;
		}

		// check the attribute set when shown
		if ( get_user_attribute( $this_user_id, 'customizer-guide-shown' ) ) {
			return false;
		}

		// we can show it, but just this once
		update_user_attribute( $this_user_id, 'customizer-guide-shown', 1 );
		return true;
	}

	public function admin_enqueue() {
		wp_enqueue_script( 'customize-dm-admin', plugins_url( 'js/customize-dm-admin.js', __FILE__ ), array( 'customize-controls' ), '20160411', true );
		wp_enqueue_style( 'customize-dm-admin', plugins_url( 'css/cdm-admin.css', __FILE__ ) );

		$steps = array(
			array(
				'content' => __( 'Here you can control the design of your site. Change your site name, update the colors and fonts, and even add a header image. Explore widgets to find new features and content to add to your website.' ),
				'smallContent' => __( 'Click the <strong>Preview</strong> icon to preview your site appearance before saving.' ),
				'button' => __( 'Thanks, got it!' )
			),
		);

		$showGuide = $this->should_show_guide();
		wp_localize_script( 'customize-dm-admin', '_Customizer_DM', compact( 'steps', 'showGuide' ) );
	}

	public function preview_enqueue() {
		wp_enqueue_style( 'customize-dm-preview', plugins_url( 'css/customize-direct-manipulation.css', __FILE__ ), array(), '20160411' );
		wp_enqueue_script( 'customize-dm-preview', plugins_url( 'js/customize-dm-preview.js', __FILE__ ), array( 'jquery' ), '20160411', true );
		add_action( 'wp_footer', array( $this, 'add_script_data_in_footer' ) );
		add_filter( 'widget_links_args', array( $this, 'fix_widget_links' ) );
	}

	public function add_script_data_in_footer() {

		/**
		 * Filters the modules to disable in the Customize Direct Manipulation plugin.
		 *
		 * Plugins can push modules onto this list to disable aspects of the plugin.
		 * For example, the Customize Posts plugin can disable the 'edit-post-links'
		 * module because it has its own integration with the edit post links
		 * whereby the posts can be edited in the customizer directly.
		 *
		 * Not all modules can currently be disabled.
		 *
		 * @param array $disabled_modules Disabled modules, defaulting to empty array.
		 * @returns array Disabled modules.
		 */
		$disabled_modules = apply_filters( 'customize_direct_manipulation_disabled_modules', array() );

		wp_localize_script( 'customize-dm-preview', '_Customizer_DM', array(
			'menus' => $this->get_menu_data(),
			'headerImageSupport' => current_theme_supports( 'custom-header' ),
			'disabledModules' => $disabled_modules,
		) );
	}

	public function maybe_add_page_menu_class( $args ) {
		if ( ! is_customize_preview() ) {
			return $args;
		}
		if ( ! ( 'wp_page_menu' === $args['fallback_cb'] && isset( $args['theme_location'] ) ) ) {
			return $args;
		}
		$args['menu_class'] .= " cdm-fallback-menu cdm-menu-location-{$args['theme_location']}";
		return $args;
	}

	/**
	 * The links widget is awesome because it doesn't spit out the widget instance ID, instead punting
	 * to `wp_list_bookmarks()` which assigns IDs based on link categories (and even spits out multiple widgets if
	 * you have more than one link category) which is all completely awesome.
	 *
	 * AWESOME!!!!!!
	 */
	public function fix_widget_links( $args ) {
		foreach( debug_backtrace() as $traced ) {
			if ( isset( $traced['class'] ) && 'WP_Widget_Links' === $traced['class'] && isset( $traced['object']) ) {
				$args['category_before'] = str_replace( 'id="%id"', 'data-id="%id" id="' . $traced['object']->id . '"', $args['category_before'] );
				break;
			}
		}
		return $args;
	}
}

add_action( 'init', array( Jetpack_Customizer_DM::get_instance(), 'init' ) );
