/*
* Kendo UI Complete v2012.2.913 (http://kendoui.com)
* Copyright 2012 Telerik AD. All rights reserved.
*
* Kendo UI Complete commercial licenses may be obtained at
* https://www.kendoui.com/purchase/license-agreement/kendo-ui-complete-commercial.aspx
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.mobile.ui,
        Shim = ui.Shim,
        Popup = ui.Popup,
        Widget = ui.Widget,
        ns = ".kendoMobileActionSheet",
        OPEN = "open",
        BUTTONS = "li>a",
        CONTEXT_DATA = "actionsheetContext",
        WRAP = '<div class="km-actionsheet-wrapper" />',
        cancelTemplate = kendo.template('<li class="km-actionsheet-cancel"><a href="\\#">#:cancel#</a></li>'),
        MOUSEUP = kendo.support.mouseup + ns,
        CLICK = "click" + ns;

    var ActionSheet = Widget.extend({
        init: function(element, options) {
            var that = this,
                os = kendo.support.mobileOS,
                ShimClass = os.tablet ? Popup : Shim;

            Widget.fn.init.call(that, element, options);

            element = that.element;

            element
                .addClass("km-actionsheet")
                .append(cancelTemplate({cancel: that.options.cancel}))
                .wrap(WRAP)
                .on(MOUSEUP, BUTTONS, $.proxy(that._click, that))
                .on(CLICK, BUTTONS, kendo.preventDefault);

            that.wrapper = element.parent();
            that.shim = new ShimClass(that.wrapper, $.extend({modal: !(os.android || os.meego)}, that.options.popup) );

            kendo.notify(that, ui);

            kendo.onResize(function() {
                var positionedElement = that.wrapper.parent(),
                    viewPort = positionedElement.parent();

                positionedElement.css({
                    top: (viewPort.height() - positionedElement.height()) + "px",
                    width: viewPort.width() + "px"
                });
            });
        },

        events: [
            OPEN
        ],

        options: {
            name: "ActionSheet",
            cancel: "Cancel",
            popup: { height: "auto" }
        },

        open: function(target, context) {
            var that = this;
            that.target = $(target);
            that.context = context;
            that.shim.show();
        },


        close: function() {
            this.context = this.target = null;
            this.shim.hide();
        },

        openFor: function(target) {
            var that = this;
            that.target = target;
            that.context = target.data(CONTEXT_DATA);
            that.trigger(OPEN, { target: that.target, context: that.context });
            that.shim.show(target);
        },

        destroy: function() {
            Widget.fn.destroy.call(this);
            this.element.off(ns);
            this.shim.destroy();
        },

        _click: function(e) {
            if (e.isDefaultPrevented()) {
                return;
            }

            var action = $(e.currentTarget).data("action");

            if (action) {
                kendo.getter(action)(window)({
                    target: this.target,
                    context: this.context
                });
            }

            e.preventDefault();
            this.close();
        }
    });

    ui.plugin(ActionSheet);
})(jQuery);
;