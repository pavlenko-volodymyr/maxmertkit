;(function ( $, window, document, undefined ) {
	var _name = 'modal'
	,	_defaults = {
			autoOpen: false
		,	onlyOne: true
		// ,	template: '<div class="-modal"><div class="-modal-header"></div><div class="-modal-content"></div></div>'
	}

	Modal = function( element_, options_ ) {
		this.element = element_;
		this.name = _name;
		// if( options_ === undefined )
		// 	options_ = {};
		// debugger;
		this.options = $.extend( {}, this.options, _defaults, options_ );
		this._setOptions( this.options );

		if( typeof $.modal === 'undefined' )
			$.modal = [];
		if( this.element !== 'undefined' )
			$.modal.push( this.element );

		$(this.element).css({
			opacity: 0
		,	display: 'none'
		})

		this.init();
	}

	Modal.prototype = new $.kit();
	Modal.prototype.constructor = Modal;

	Modal.prototype.__setOption = function( key_, value_ ) {
		var me  = this
		,	$me = $(me.element);
		
		switch( key_ ) {
			
		}

		me.options[ key_ ] = value_;
	}

	Modal.prototype.init = function() {
		var me  = this;

		if( me.options.autoOpen )
			me.open();
	}

	Modal.prototype._setPosition = function() {
		var me  = this
		,	$me = $(me.element)
		,	width = $me.outerWidth()
		,	height = $me.outerHeight();

		$me.css({
			left: -width / 2,
			top: -height / 2
		});
	}

	Modal.prototype.open = function() {
		var me  = this
		,	$me = $(me.element);

		if( me.options.enabled === true && me.state !== 'opened' ) {
			
			me.state = 'in';

			if( me.options.beforeOpen !== 'undefined' && (typeof me.options.beforeOpen === 'object' || typeof me.options.beforeOpen === 'function' )) {
				
				try {
					var deferred = me.options.beforeOpen.call( $me );
					deferred
						.done(function(){
							me._open();
						})
						.fail(function(){
							me.state = 'closed';
							$me.trigger('ifNotOpened.' + me.name);
							$me.trigger('ifOpenedOrNot.' + me.name);
						})
				} catch( e ) {
					me._open();
				}
				
			}
			else {
				me._open();
			}
		}
	}

	Modal.prototype._open = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.state === 'in' ) {
			
			if( me.options.onlyOne )
				
				$.each( me._getOtherInstanses( $.modal ), function() {
					if( $.data( this, 'kit-' + me.name ).getState() === 'opened' )
						$.data( this, 'kit-' + me.name ).close();
				});

			me._setPosition();
			
			if( me.options.animation !== null && me.options.animation !== false )
			{	
				me._openAnimation();
			}
			else
			{
				$me.show();
			}
			
			me.state = 'opened';
			$me.trigger('open.' + me.name);
		}

		$me.trigger('ifOpenedOrNot.' + me.name);
	}

	Modal.prototype._openAnimation = function() {
		var me  = this;
		var $me = $(me.element);

		if( $.easing !== 'undefined' && (me.options.animation.split(/[ ,]+/)[1] in $.easing || me.options.animation.split(/[ ,]+/)[0] in $.easing) ) {
			me.element.slideDown({
				duration: me.options.animationDuration,
				easing: me.options.animation.split(/[ ,]+/)[0]
			});
		}
		else {
			me.element.show();
			me.element.addClass('-mx-start');
		}
	}

	Popup.prototype.close = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.options.enabled === true && me.state !== 'closed' ) {

			me.state = 'out';

			if( me.options.beforeClose != 'undefined' && (typeof me.options.beforeClose === 'object' || typeof me.options.beforeClose === 'function' ))
			{
				
				try {
					var deferred = me.options.beforeClose.call( $me );
					deferred
						.done(function(){
							me._close();
						})
						.fail(function(){
							$me.trigger('ifNotClosed.' + me.name);
							$me.trigger('ifClosedOrNot.' + me.name);
							me.state = 'opened';
						})
				} catch( e ) {
					me._close();
				}
				
			}
			else {
				me._close();
			}
		}
	}

	Popup.prototype._close = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.state === 'out' ) {
			
			if( me.options.animation === null )
				me.element.hide();
			else {
				me._closeAnimation();
			}
			me.state = 'closed';

			$me.trigger('close');	
		}
		
		$me.trigger('ifClosedOrNot.' + me.name);
	}

	Popup.prototype._closeAnimation = function() {
		var me  = this;
		var $me = $(me.element);

		if( $.easing !== 'undefined' && (me.options.animation.split(/[ ,]+/)[1] in $.easing || me.options.animation.split(/[ ,]+/)[0] in $.easing) ) {
			me.element.slideUp({
				duration: me.options.animationDuration,
				easing: me.options.animation.split(/[ ,]+/)[1] !== 'undefined' ? me.options.animation.split(/[ ,]+/)[1] : me.options.animation,
			});
		}
		else {
			me.element.removeClass('-mx-start');
		}
	}

	Popup.prototype._setPosition = function() {
		var me  = this;
		var $me = $(me.element);

		var actualWidth = $me.outerWidth() ;
		var actualHeight = $me.outerHeight() ;
		var actualPosition = $me.offset();
		
		var pos = {}

		me.element.css(pos);
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Modal( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );

// 

// 	var _name = 'popup'
// 	,	_defaults = {
// 			placement: 'top'
// 		,	offset: [0, 0]
// 		,	autoOpen: false
// 		,	template: '<div class="js-content"></div>'
// 		}

// 	Popup = function( element_, options_ ) {
// 		// Don't need this string, if this constructor will do the same and more, than $.kit constructor.
// 		// $.kit.apply( this, element_, options_ );

// 		this.element = element_;
// 		this.name = _name;

// 		this.options = $.extend( {}, this.options, _defaults, options_ );
		
// 		// Creating popup element by template
// 		this.options.template.charAt(0) !== '.' && this.options.template.charAt(0) !== '#' ?
// 				this.element = $(this.options.template) :
// 				this.element = $( $(this.options.template).html() );
			
// 		$('body').append( this.El );
// 			// CSS manupulations just in case
// 			this.El
// 				.css({position: 'absolute', display: 'none'})
// 				.find('.-arrow')
// 					.css({opacity: 0});

// 		this._setOptions( this.options );

// 		// Create collection for other instances
// 		if( typeof $.popup === 'undefined' )
// 			$.popup = []
// 		// Put this instance to the collection
// 		if( this.element !== undefined )
// 			$.popup.push( this.element );
		
// 		// For delay before open
// 		this.timeout = null;

// 		this.init();
// 	}

// 	Popup.prototype = new $.kit();
// 	Popup.prototype.constructor = Popup;

// 	Popup.prototype.__setOption = function ( key_, value_ ) {
// 		var me  = this;
// 		var $me = $(me.element);
// 		switch( key_ ) {

// 			case 'trigger':
// 				var _events = value_.split(/[ ,]+/);
					
// 				if( me.options[key_].in !== undefined )
// 					$me.off( 'mouseenter.' + me.name, 'click.' + me.name );

// 				if( me.options[key_].out !== undefined )
// 					$me.off( 'mouseleave.' + me.name, 'click.' + me.name );

// 				me.options[key_] = {
// 					in: _events[0] 
// 				,   out: (_events[1] == undefined || _events[1] == '') ? _events[0] : _events[1]
// 				};
				
// 				switch( me.options[key_].in ) {
// 					case 'hover':
// 						$me.on('mouseenter.' + me.name, function( event ) {
// 							if( me.state === 'closed' )
// 								me.open();
// 						});
// 					break;
					
// 					default:
// 						$me.on( me.options[key_].in + '.' + me.name, function() {
// 							if( me.state === 'closed' )
// 								me.open();
// 						});
// 				}

// 				switch( me.options[key_].out ) {
// 					case 'hover':
// 						$me.on('mouseleave.' + me.name, function( event ) {
// 							me.close();
// 						});
// 					break;

// 					default:
// 						$me.on( me.options[key_].out + '.' + me.name, function() {
// 							if( me.state == 'opened' )
// 								me.close();
// 						});
// 				}
// 			break;

// 			case 'content':
// 				if( value_ !== null )
// 					me.El.find('.js-content').html(value_);
// 				else
// 					me.El.find('.js-content').html( $me.data('content') );
// 			break;

// 			case 'header':
// 				if( value_ !== null )
// 					me.El.find('.js-header').html(value_);
// 				else
// 					me.El.find('.js-header').html( $me.data('header') );
// 			break;

// 			case 'placement':
// 				me.El.removeClass('_' + me.options.placement + '_')
// 				me.El.addClass('_' + value_ + '_')
// 			break;

// 			case 'animation':
// 				if( $.easing === undefined || !(value_ in $.easing) )
// 					switch( value_ ) {
// 						case 'scaleIn':
// 							me.El.addClass('-mx-scaleIn');
// 						break;

// 						case 'growUp':
// 							me.El.addClass('-mx-growUp');
// 						break;

// 						case 'rotateIn':
// 							me.El.addClass('-mx-rotateIn');
// 						break;
// 					}

// 			break;
				
// 		}

// 		if( key_ !== 'trigger' )
// 			me.options[ key_ ] = value_;
// 	}

// 	Popup.prototype.init = function() {
// 		var me  = this;

// 		if( me.options.autoOpen )
// 			me.open()
// 	}

// 	Popup.prototype.open = function() {
// 		var me  = this;
// 		var $me = $(me.element);
		
// 		me.timeout = setTimeout(function(){
// 			if( me.options.enabled === true && me.state !== 'opened' ) {
				
// 				me.state = 'in';

// 				if( me.options.beforeOpen !== undefined && (typeof me.options.beforeOpen === 'object' || typeof me.options.beforeOpen === 'function' )) {
					
// 					try {
// 						var deferred = me.options.beforeOpen.call( $me );
// 						deferred
// 							.done(function(){
// 								me._open();
// 							})
// 							.fail(function(){
// 								me.state = 'closed';
// 								$me.trigger('ifNotOpened.' + me.name);
// 								$me.trigger('ifOpenedOrNot.' + me.name);
// 							})
// 					} catch( e ) {
// 						me._open();
// 					}
					
// 				}
// 				else {
// 					me._open();
// 				}
// 			}
// 		}, me.options.delay)
// 	}

// 	Popup.prototype._open = function() {
// 		var me  = this;
// 		var $me = $(me.element);

// 		if( me.state === 'in' ) {
			
// 			if( me.options.onlyOne )
				
// 				$.each( me._getOtherInstanses( $.popup ), function() {
// 					if( $.data( this, 'kit-' + me.name ).getState() === 'opened' )
// 						$.data( this, 'kit-' + me.name ).close();
// 				});

// 			me._setPosition();
			
// 			if( me.options.animation !== null && me.options.animation !== false )
// 			{	
// 				me._openAnimation();
// 			}
// 			else
// 			{
// 				me.El.find('.-arrow').css({opacity: 1});
// 				me.El.show();
// 			}
			
// 			me.state = 'opened';
// 			$me.trigger('open.' + me.name);
// 		}

// 		$me.trigger('ifOpenedOrNot.' + me.name);
// 	}

// 	Popup.prototype._openAnimation = function() {
// 		var me  = this;
// 		var $me = $(me.element);

// 		if( $.easing !== undefined && (me.options.animation.split(/[ ,]+/)[1] in $.easing || me.options.animation.split(/[ ,]+/)[0] in $.easing) ) {
// 			me.El.slideDown({
// 				duration: me.options.animationDuration,
// 				easing: me.options.animation.split(/[ ,]+/)[0],
// 				complete: function(){
// 					me.El.find('.-arrow').animate({opacity: 1});
// 				}
// 			});
// 		}
// 		else {
// 			me.El.show();
// 			this.El.find('.-arrow').css({opacity: 1});
// 			me.El.addClass('-mx-start');
// 		}
// 	}

// 	Popup.prototype.close = function() {
// 		var me  = this;
// 		var $me = $(me.element);
		
// 		clearTimeout( me.timeout );

// 		if( me.options.enabled === true && me.state !== 'closed' ) {

// 			me.state = 'out';

// 			if( me.options.beforeClose != undefined && (typeof me.options.beforeClose === 'object' || typeof me.options.beforeClose === 'function' ))
// 			{
				
// 				try {
// 					var deferred = me.options.beforeClose.call( $me );
// 					deferred
// 						.done(function(){
// 							me._close();
// 						})
// 						.fail(function(){
// 							$me.trigger('ifNotClosed.' + me.name);
// 							$me.trigger('ifClosedOrNot.' + me.name);
// 							me.state = 'opened';
// 						})
// 				} catch( e ) {
// 					me._close();
// 				}
				
// 			}
// 			else {
// 				me._close();
// 			}
// 		}
// 	}

// 	Popup.prototype._close = function() {
// 		var me  = this;
// 		var $me = $(me.element);

// 		if( me.state === 'out' ) {
			
// 			if( me.options.animation === null )
// 				me.El.hide();
// 			else {
// 				me._closeAnimation();
// 			}
// 			me.state = 'closed';

// 			$me.trigger('close');	
// 		}
		
// 		$me.trigger('ifClosedOrNot.' + me.name);
// 	}

// 	Popup.prototype._closeAnimation = function() {
// 		var me  = this;
// 		var $me = $(me.element);

// 		if( $.easing !== undefined && (me.options.animation.split(/[ ,]+/)[1] in $.easing || me.options.animation.split(/[ ,]+/)[0] in $.easing) ) {
// 			me.El.slideUp({
// 				duration: me.options.animationDuration,
// 				easing: me.options.animation.split(/[ ,]+/)[1] !== undefined ? me.options.animation.split(/[ ,]+/)[1] : me.options.animation,
// 				complete: function(){
// 					me.El.find('.-arrow').animate({opacity: 0});
// 				}
// 			});
// 		}
// 		else {
// 			me.El.removeClass('-mx-start');
// 		}
// 	}

// 	Popup.prototype._setPosition = function() {
// 		var me  = this;
// 		var $me = $(me.element);

// 		var actualWidth = $me.outerWidth() ;
// 		var actualHeight = $me.outerHeight() ;
// 		var actualPosition = $me.offset();
// 		var arrowSize = 8;
// // console.log(actualPosition, $me.height(), actualHeight, parseInt($me.css('paddingTop')), parseInt($me.css('paddingBottom')));
		
// 		var pos = {}

// 		switch( me.options.placement ) {
// 			case 'top':
// 				pos = { top: actualPosition.top - me.El.outerHeight() - arrowSize + me.options.offset[0], left: actualPosition.left + actualWidth / 2 - me.El.outerWidth() / 2 + me.options.offset[1] }
// 			break;

// 			case 'bottom':
// 				pos = { top: actualPosition.top + actualHeight + arrowSize + me.options.offset[0], left: actualPosition.left + actualWidth / 2 - me.El.outerWidth() / 2 + me.options.offset[1] };
// 			break;

// 			case 'left':
// 				pos = { top: actualPosition.top + actualHeight / 2 - me.El.outerHeight() / 2, left: actualPosition.left - me.El.outerWidth() - arrowSize + me.options.offset[1] }
// 			break;

// 			case 'right':
// 				pos = { top: actualPosition.top + actualHeight / 2 - me.El.outerHeight() / 2, left: actualPosition.left + actualWidth + arrowSize + me.options.offset[1]}
// 			break;
// 		}

// 		me.El.css(pos);
// 	}

// 	$.fn[_name] = function( options_ ) {
// 		return this.each(function() {
// 			if( ! $.data( this, 'kit-' + _name ) ) {
// 				$.data( this, 'kit-' + _name, new Popup( this, options_ ) );
// 			}
// 			else {
// 				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
// 					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
// 			}
// 		});
// 	}
	
	

// })( jQuery, window, document );