$(function () {

    var enabled = false;

    function init() {

        var $comments = $('*')
            // Chrome emits security error when trying to get contents of an iframe.
            .not('iframe')
            .contents()
            .filter(function () {
                return this.nodeType == 8;
            });


        var defaults = {
            theme: null,
            themeHook: null,
            suggestions: null,
            template: null
        };

        var data = defaults;

        $comments.each(function (index) {

            // In Drupal 7 theme hook is marked differently.
            if (this.nodeValue.indexOf('CALL: theme') !== -1) {
                data.theme = this.nodeValue.split("'")[1];
            }

            if (this.nodeValue.indexOf('THEME HOOK:') !== -1) {
                data.theme = this.nodeValue.split("'")[1];
            }

            if (this.nodeValue.indexOf('FILE NAME SUGGESTIONS:') !== -1) {
                data.suggestions = this.nodeValue.split('FILE NAME SUGGESTIONS:')[1].trim();
            }

            if (this.nodeValue.indexOf('BEGIN OUTPUT') !== -1) {

                data.template = this.nodeValue.split("'")[1];

                // There is a potential problem here.
                // If a template contains several top level elements we will miss
                // them all except the first one.
                $(this).next()
                    .addClass('dt-template')
                    .data('dt-theme-hook', data.theme)
                    .data('dt-suggestions', data.suggestions)
                    .data('dt-template', data.template)
                    .data('dt-id', index);

                data = defaults;
            }

        });

        function setActiveTemplate(event) {

            if (enabled) {
                var $this = $(this);

                // Change current element if we are leaving it.
                if (event.type == 'mouseleave') {
                    $this = $this.parent();
                }

                $target = $this.closest('.dt-template');

                // Sometimes mouse pointer enters the tooltip element.
                if ($target.length == 0) {
                    return;
                }

                $('.dt-hover').removeClass('dt-hover');
                $target.addClass('dt-hover');

                event.stopPropagation();
            }

        }

        $templates = $('.dt-template');
        $templates.hover(setActiveTemplate, setActiveTemplate);

        $templates
            .tooltip({
                disabled: true,
                track: true,
                items: '.dt-template',
                hide: false,
                content: function () {
                    $templates.tooltip('close');

                    var $this = $(this);
                    var output = '<dl>';

                    if ($this.data('dt-theme-hook')) {
                        output += "<dt>Theme hook:</dt><dd>" + $this.data('dt-theme-hook') + '</dd>';
                    }

                    if ($this.data('dt-suggestions')) {
                        output += '<dt>File name suggestions:</dt><dd>' + $this.data('dt-suggestions').split("\n").join("<br/>") + '</dd>';
                    }

                    if ($this.data('dt-template')) {
                        output += '<dt>Called template:</dt><dd>' + $this.data('dt-template') + '</dd>';
                    }
                    output += '<dl>';
                    return output;
                }
            });

    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

            var $body = $('body');
            if (!$body.hasClass('dt-initialized')) {
                init();
                $body.addClass('dt-initialized');
            }

            if ($templates.length == 0) {
                $('<div/>')
                    .attr('title', 'Drupal themer')
                    .html('No debug information was found.<br/>Did you enable debug mode?')
                    .dialog({
                        modal: true,
                        hide: {
                            effect: 'explode'
                        },
                        buttons: {
                            Ok: function () {
                                $(this).dialog('close');
                            }
                        }
                    });
                enabled = false;
            }
            else {
                enabled = request.status;
                $body.toggleClass('dt-enabled', enabled);
                $templates.tooltip({disabled: !enabled});
                enabled && $templates.effect('highlight', {}, 1000);
            }

            sendResponse({status: enabled});
        }
    );

});

