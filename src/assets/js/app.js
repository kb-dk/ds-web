(function() {
    'use strict';

    // Form validation
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);


})();

(function($) {

    let rdl = {
        breakpoints: {
            sm: 480,
            md: 640,
            search: 800,
            lg: 990,
            xl: 1150,
            xxl: 1280,
            xxxl: 2400
        }
    };


    $(document).ready(function () {
        var datepickerLang = document.documentElement.lang;

        // date picker settings
        // $('.date-picker input').datepicker({
        //     language: datepickerLang,
        //     autoclose: true,
        //     orientation: "bottom auto",
        //     maxViewMode: 3,
        //     weekStart: 1
        // })
        //     .on('show', function(){
        //         $(this).parent().addClass('active');
        //     })
        //     .on('hide', function(){
        //         if ($(this).val() === '') {
        //             $(this).parent().removeClass('active');
        //         }
        //     });


        // jump to search input
        $('#skipSearch').on('click', function() {
            $('#mainSearchButton').trigger('click');
        });

        // set focus in header search input field and toggle open/close button
        $('#mainSearch').on('show.bs.collapse', function () {
            $('#mobileNavButton').removeClass('active').attr('aria-pressed', false);
        });
        $('#mainSearch').on('shown.bs.collapse', function () {
            $('#mainSearchInput').focus();
        });
        $('#mainSearch').on('hide.bs.collapse', function () {
            $('#mainSearchButton i').html('search');
        });


        //listen for window resize event and toggle header aria
        function resizeListener() {
            if (window.innerWidth > 990 && $('#mobileNavButton').hasClass('active')) {
                $('#mobileNavButton').button('toggle');
                $('#mobileNavToggle').trigger('click');
                $('#mobileNavigation').collapse('hide');
            }
        }
        window.addEventListener('resize', resizeListener);

        // $(function () {
        //     $('[data-toggle="tooltip"]').tooltip();
        // });

        // $.fn.dataTable.ext.order.intl = function ( locales, options ) {
        //     if ( window.Intl ) {
        //         var collator = new window.Intl.Collator( locales, options );
        //         var types = $.fn.dataTable.ext.type;

        //         delete types.order['string-pre'];
        //         types.order['string-asc'] = collator.compare;
        //         types.order['string-desc'] = function ( a, b ) {
        //             return collator.compare( a, b ) * -1;
        //         }
        //     }
        // };

        // $.fn.dataTable.ext.order.intl('da', {'numeric': true} );

        // $('table.datatable').each(function(){
        //     let paging = $(this).data('paging'),
        //         pageLength = $(this).data('pagelenght'),
        //         ordering = $(this).data('ordering'),
        //         sortAscending = $(this).data('sortascending'),
        //         sortDescending = $(this).data('sortdescending');

        //     $(this).DataTable({
        //         searching: false,
        //         lengthChange: false,
        //         order: [],
        //         ordering: ordering,
        //         info: false,
        //         paging: paging,
        //         pageLength: pageLength,
        //         language: {
        //             paginate: {
        //                 previous: 'navigate_before',
        //                 next: 'navigate_next'
        //             },
        //             aria: {
        //                 sortAscending: sortAscending,
        //                 sortDescending: sortDescending
        //             }
        //         },
        //         columnDefs: [ {
        //             ariaTitle: ' ',
        //             targets: '_all'
        //         } ]
        //     });
        // })




        // gallery carousel - slick + slick-lightbox
        $('.rdl-slideshow-container').each(function() {
            let gallery = $('.rdl-slideshow.slider-gallery', this),
                captions = $('.rdl-slideshow.slider-caption', this);

            gallery.slick({
                asNavFor: captions
            });

            captions.slick({
                asNavFor: gallery,
                fade: true,
                arrows: false
            });

            $(window).on('load resize', function() {
                let viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                    slideImg = gallery.find('.slide-img'),
                    slideButtons = gallery.find('button'),
                    slideWidth = gallery.find('.slick-slide').width();

                if (viewportWidth > rdl.breakpoints.lg) {
                    slideImg.height(slideWidth/2 + 'px');
                    slideButtons.css('top', slideWidth/4 + 'px');
                } else {
                    slideImg.height(slideWidth/99*52 + 'px');
                    slideButtons.css('top', slideWidth/99*26 + 'px');
                }
            });

            gallery.slickLightbox({
                    src: 'data-src',
                    itemSelector: '.slide-img img',
                    background: '#fff',
                    caption: 'caption',
                    slick: {
                        dots: true
                    }
            }).on({
                'show.slickLightbox': function(){$('body').addClass('lightbox-open')},
                'hide.slickLightbox': function(){$('body').removeClass('lightbox-open')}
            });

            gallery.siblings('.full-screen-btn').on('click', function(){
               $(this).siblings('.rdl-slideshow').find('.slick-active .slide-img img').click();
            });

        });

        $('.rdl-slideshow-container .slider-gallery figure').each(function() {
            $(this).on('mouseenter', function(){
                $(this).closest('.rdl-slideshow-container').children('.full-screen-btn').addClass('hover');
            });
            $(this).on('mouseleave', function(){
                $(this).closest('.rdl-slideshow-container').children('.full-screen-btn').removeClass('hover');
            });
        });



        function fixSelectpickerAriaLabels() {
            $('.selectpicker').each(function() {
                var button = $('button[data-id="'+this.id+'"]').first();
                if(button.length > 0) {
                    button.attr('aria-label', $(this).attr('aria-label'));
                }
            });
        }

        fixSelectpickerAriaLabels();




        $('.custom-number-input').each(function(){

            let input = $(this).children('input'),
                step = parseInt(input.attr('step')),
                buttons = $(this).children('button');

            buttons.each(function(){
                $(this).click(function(e){
                    e.preventDefault();

                    let type = $(this).attr('data-type'),
                        currentVal = parseInt(input.val());

                    if (!isNaN(currentVal)) {
                        if(type == 'substract') {
                            if(currentVal > input.attr('min')) {
                                input.val(currentVal - step).change();
                            }
                            if(parseInt(input.val()) == input.attr('min')) {
                                $(this).attr('disabled', true);
                            }
                        } else if(type == 'add') {
                            if(currentVal < input.attr('max')) {
                                input.val(currentVal + step).change();
                            }
                            if(parseInt(input.val()) == input.attr('max')) {
                                $(this).attr('disabled', true);
                            }
                        }
                    } else {
                        input.val(0);
                    }
                });
            });

            $('.input-number').change(function() {

                let minValue =  parseInt($(this).attr('min')),
                    maxValue =  parseInt($(this).attr('max')),
                    valueCurrent = parseInt($(this).val());

                if(valueCurrent <= minValue) {
                    $(this).prev('button').attr('disabled', true)
                } else {
                    $(this).prev('button').removeAttr('disabled')
                }
                if(valueCurrent >= maxValue) {
                    $(this).next('button').attr('disabled', true)
                } else {
                    $(this).next('button').removeAttr('disabled')
                }
                if(valueCurrent > maxValue) {
                    $(this).val(maxValue)
                }
                if(valueCurrent < minValue) {
                    $(this).val(minValue)
                }
            });

        })
    });

})(jQuery);

// multi select filter
const multiSelectElement = document.querySelectorAll('.custom-select.select-choices');

Array.prototype.slice.call(multiSelectElement).forEach((multiselect) => {
    const select = new Choices(multiselect, {
        removeItemButton: true,
        itemSelectText: '',
        noResultsText: 'Ingen resultater fundet',
        noChoicesText: 'Ikke flere valgmuligheder'
    });
});


// input text
const floatLabelInputs = document.querySelectorAll(
    '.form-input'
);

Array.prototype.slice.call(floatLabelInputs).forEach((el) => {
    el.querySelector('input, textarea').onfocus = () => {
        el.classList.add('active')
    };
    if (el.querySelector('input, textarea').value) {
        el.classList.add('active')
    }
    if (el.querySelector('input[autofocus]')) {
        el.classList.add('active')
    }
    el.querySelector('input, textarea').onblur = (e) => {

        if (e.target.value.trim() === '') {
            el.classList.remove('active')
        }
    };
    if (el.querySelector('button')) {
        el.querySelector('button').onclick = (e) => {
            e.preventDefault()
            el.querySelector('input').value = ''
            el.classList.remove('active')
        }
    }
});







/*
* Bootstrap collapse enhanced with keyboard navigation based on the w3.org example https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
*  licenced under: https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/

'use strict';

Array.prototype.slice.call(document.querySelectorAll('.rdl-accordion')).forEach(function (accordion) {

    // Allow for multiple accordion sections to be expanded at the same time
    var allowMultiple = accordion.hasAttribute('data-allow-multiple');
    // Allow for each toggle to both open and close individually
    var allowToggle = (allowMultiple) ? allowMultiple : accordion.hasAttribute('data-allow-toggle');

    // Create the array of toggle elements for the accordion group
    var triggers = Array.prototype.slice.call(accordion.querySelectorAll('.accordion-trigger'));
    // var panels = Array.prototype.slice.call(accordion.querySelectorAll('.accordion-panel'));


    // Bind keyboard behaviors on the main accordion container
    accordion.addEventListener('keydown', function (event) {
        var target = event.target;
        var key = event.which.toString();

        var isExpanded = target.getAttribute('aria-expanded') == 'true';
        var allowToggle = (allowMultiple) ? allowMultiple : accordion.hasAttribute('data-allow-toggle');

        // 33 = Page Up, 34 = Page Down
        var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

        // Is this coming from an accordion header?
        if (target.classList.contains('accordion-trigger')) {
            // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
            // 38 = Up, 40 = Down
            if (key.match(/38|40/) || ctrlModifier) {
                var index = triggers.indexOf(target);
                var direction = (key.match(/34|40/)) ? 1 : -1;
                var length = triggers.length;
                var newIndex = (index + length + direction) % length;

                triggers[newIndex].focus();

                event.preventDefault();
            }
            else if (key.match(/35|36/)) {
                // 35 = End, 36 = Home keyboard operations
                switch (key) {
                    // Go to first accordion
                    case '36':
                        triggers[0].focus();
                        break;
                    // Go to last accordion
                    case '35':
                        triggers[triggers.length - 1].focus();
                        break;
                }
                event.preventDefault();
            }
        }
    });


    // Minor setup: will set disabled state, via aria-disabled, to an
    // expanded/ active accordion which is not allowed to be toggled close
    if (!allowToggle) {
        // Get the first expanded/ active accordion
        var expanded = accordion.querySelector('[aria-expanded="true"]');

        // If an expanded/ active accordion is found, disable
        if (expanded) {
            expanded.setAttribute('aria-disabled', 'true');
        }
    }

});