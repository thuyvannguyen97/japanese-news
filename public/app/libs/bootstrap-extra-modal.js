$(function(){

  // A wrapper to the Bootstrap 3 modal Javascript. It uses the HTML already on the page (the modal
  // 'container' and adds remote HTML to it).
  $.fn.bootstrapExtraModal = function(options) {
    // just some default vals.
  	var defaults = $.extend({
      backdrop:         'static', // [BS setting] boolean or the string 'static'
      keyboard:         false, // [BS setting] if true - closes the modal when escape key is pressed
      reload:           false, // reload page when closing the modal
      position:         'default', // position of the modal (can be 'default', 'right', 'left')
      css:              '', // custom css class to be added to the modal container
      openAnimation:    'jelly', // default open animation
      closeAnimation:   'unjelly', // default close animation
      pushContent:      false, // Option used to move the boby
  	}, options);

    //  Global variables
    var $element    = $(this),
        $content    = $element.find('.modal-dialog'),
        $backdrop   = null;

    // Private Methods
    var pushContent = function(animation) {
      if ((defaults.pushContent) && (defaults.position === 'left' || defaults.position === 'right')) {
        $('.push-content').addClass(animation);
      }
      return;
    };

    var afterShow = function() {
      // Modal dismiss button
      $('[data-dismiss="modal"]').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        modal.hide();
      });
    };

    // Public Methods
    var modal = {

      show: function() {
        $element.removeClass(defaults.closeAnimation);

        // Initialize the BS modal
        $element.modal(defaults);
        $element.css('display', 'block');

        $element.addClass(defaults.css + ' bs-extra-modal');

        // Set modal type defaults
        switch (defaults.position) {
          case 'right':
            defaults.openAnimation = 'slide-right';
            defaults.closeAnimation = 'unslide-right';
            defaults.css = 'modal-right';
            $element.addClass(defaults.css + ' ' + defaults.openAnimation);
            pushContent('push-right');
            break;
          case 'left':
            defaults.openAnimation = 'slide-left';
            defaults.closeAnimation = 'unslide-left';
            defaults.css = 'modal-left';
            $element.addClass(defaults.css + ' ' + defaults.openAnimation);
            pushContent('push-left');
            break;
          default:
            $element.addClass(defaults.openAnimation);
        }

        // Dismiss the modal when clicking on the backdrop
        $backdrop = $('.modal-backdrop');
        $backdrop.click(function() { modal.hide(); });

        afterShow();

        return $element;
  	  },

      hide: function() {
        $element.removeClass(defaults.closeAnimation);
        $element.removeClass(defaults.openAnimation);
        $element.addClass(defaults.closeAnimation);

        $backdrop = $('.modal-backdrop');
        $backdrop.addClass('fade-out');
        $backdrop.removeClass('in');

        if (defaults.pushContent && defaults.position === 'right') {
          pushContent('unpush-right');
        } else if (defaults.pushContent && defaults.position === 'left') {
          pushContent('unpush-left');
        }

        setTimeout(function() {
          $element.modal('hide');
          $element.removeClass(defaults.css);
          $element.removeClass(defaults.closeAnimation);
          defaults.closeAnimation = '';
          defaults.position = '';

          if (defaults.pushContent) {
            $('.push-content').removeClass('push-right unpush-right push-left unpush-left');
          }

          if (defaults.reload) { location.reload(); }
          modal.content();
        }, 300);


      },

      content: function(html) {
        if (html) {
          $content.html(html);
          return this;
        }
      }
    };


    //---------------------------------------------------------------------------
    // Capture events to check if ESC key was pressed
    //---------------------------------------------------------------------------

    $(document).keyup(function(event) {
      if (event.keyCode == 27) {
        modal.hide();
      }
    });

    $element.click(function(e){
      // Check if click was not triggered on nor within .modal-dialog
      if ($(e.target).closest('.modal-dialog').length === 0 && defaults.backdrop){
        e.preventDefault();
        e.stopPropagation();
        modal.hide();
      }
    });

  	return modal;
  };


  //---------------------------------------------------------------------------
  // Initialize the plugin via data attributes
  //---------------------------------------------------------------------------

  var $triggers = $("[data-em-selector]");

  $triggers.each(function() {
    var data = $(this).data();

    $(this).click(function() {
      $(data.emSelector).bootstrapExtraModal({
        position:         data.emPosition, // position of the modal (can be 'default', 'right', 'left')
        pushContent:      data.emPushContent, // Option used to move the boby
      }).show();
    });
  });

});
