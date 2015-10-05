$(function() {

    var
        templates,
        enabled = false;

    function init() {

        //console.log($('*'))
        //
        //$('*').each(function() {
        //    var $this = $(this);
        //   console.log($this)
        //    $this.contents()
        //});

        var $comments = $('*')
            .not('iframe')
            .contents()
            .filter(function() {
                return this.nodeType == 8;
            });


        function initData() {
            return {
                theme: null,
                themeHook: null,
                suggestions: null,
                template: null
            };
        }

        var data = initData();

        $comments.each(function(index) {

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

                $(this).next()
                    .addClass('dt-template')
                    .attr('dt-theme-hook', data.theme)
                    .attr('dt-suggestions', data.suggestions)
                    .attr('dt-template', data.template)
                    .data('dt-id', index);

                //$(this)
                //    .siblings()
                //    .not('.dt-template')
                //    .wrapAll('<span class="dt-template"/>')
                //    .parent()
                //    .attr('dt-theme-hook', data.theme)
                //    .attr('dt-suggestions', data.suggestions)
                //    .attr('dt-template', data.template);

                data = initData();
            }

        });

        $templates = $('.dt-template');


        //var mouseTimer, effectTimer, lastTargetId;
        //$(document).mousemove(function(e) {
        //    clearTimeout(mouseTimer);
        //    if (e.target) {
        //        mouseTimer = setTimeout(function(){
        //            $taget = $(e.target).closest('.dt-template');
        //            console.info($taget);
        //            console.log(e.pageX);
        //
        //            if ($taget.length == 0) {
        //                console.log('ret');
        //                return;
        //            }
        //
        //            console.log('lastTargetId', lastTargetId)
        //
        //
        //            if ($taget.data('dt-id') != lastTargetId) {
        //                $taget.effect('highlight', {}, 1000);
        //            }
        //
        //
        //            $('.dt-hover').removeClass('dt-hover');
        //            $taget.addClass('dt-hover');
        //            lastTargetId = $taget.data('dt-id');
        //
        //        }, 50)
        //
        //    }
        //});




        //
        //$templates.hover(
        //    function (event) {
        //        if (status) {
        //            var $this = $(this);
        //            mouseTimer = setTimeout(function () {
        //
        //                $this.addClass('dt-hover');
        //                effectTimer = setTimeout(function () {
        //                    $this.effect('highlight', {}, 1500);
        //                }, 150);
        //
        //                console.log('over', $this);
        //            }, 500);
        //
        //
        //
        //        }
        //        event.stopPropagation();
        //    },
        //    function (event) {
        //        if (status) {
        //            clearTimeout(mouseTimer);
        //            clearTimeout(effectTimer);
        //            $(this).removeClass('dt-hover');
        //            console.log('out', $(this));
        //        }
        //        event.stopPropagation();
        //    }
        //);
        //


        var animations = [];

        function setActiveTemplate($target) {

            $taget = $target.closest('.dt-template');

            if ($taget.length == 0) {
                return;
            }


            var targetId = $taget.data('dt-id');
            if (targetId != lastTargetId && animations.indexOf(targetId) == -1) {
                animations.push($taget.data('dt-id'));

                var complete = function () {
                    var index = animations.indexOf(targetId);
                    if (index > -1) {
                        animations.splice(index, 1);
                    }
                };
                //$taget.effect('highlight', {complete: complete}, 100);
            }


            $('.dt-hover').removeClass('dt-hover');
            $taget.addClass('dt-hover');
            lastTargetId = $taget.data('dt-id');
        }


        var effectTimer;
        var mouseTimer;
        var lastTargetId;
        $templates
            .hover(function (event) {
                //console.warn('over');
                if (enabled) {
                    setActiveTemplate($(this));
                }
                event.stopPropagation();
            },

            function (event) {
                //console.warn('out');
                if (enabled) {
                    setActiveTemplate($(this).parent());
                }
                event.stopPropagation();
            }

        );


        $templates
            .tooltip({
                disabled: true,
                track: true,
                items: '.dt-template',
                hide: false,
                close: function( event, ui ) {

                },
                content: function() {
                    $templates.tooltip('close');

                    var $this = $(this);
                    var output = '<dl>';

                    if ($this.attr('dt-theme-hook')) {
                        output += "<dt>Theme hook:</dt><dd>" +  $this.attr('dt-theme-hook') + '</dd>';
                    }

                    if ($this.attr('dt-suggestions')) {
                        output += '<dt>File name suggestions:</dt><dd>' +  $this.attr('dt-suggestions').split("\n").join("<br/>") + '</dd>';
                    }

                    if ($this.attr('dt-template')) {
                        output += '<dt>Called template:</dt><dd>' +  $this.attr('dt-template') + '</dd>';
                    }
                    output += '<dl>';
                    return output;
                }
            });

    }



    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

            console.log(sender);

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
                            effect: "explode"
                        },
                        buttons: {
                            Ok: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                enabled = false;
            }
            else {
                enabled = request.status;

                console.log(enabled);

                $body.toggleClass('dt-enabled', enabled);
                $templates.tooltip({disabled: !enabled});

                enabled && $templates.effect('highlight', {}, 1000);
            }

            console.info({status: enabled, bbb: 'sdfsdf'});
            sendResponse({status: enabled, bbb: 'sdfsdf'});

        }
    );


});

