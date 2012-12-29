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
        support = kendo.support,
        mobile = kendo.mobile,
        roleSelector = kendo.roleSelector,
        ui = mobile.ui,
        Widget = ui.Widget,
        ViewEngine = mobile.ViewEngine,
        Loader = mobile.ui.Loader,

        EXTERNAL = "external",
        HREF = "href",
        DUMMY_HREF = "#!",

        NAVIGATE = "navigate",
        VIEW_SHOW = "viewShow",

        WIDGET_RELS = /popover|actionsheet|modalview/,
        BACK = "#:back",

        proxy = $.proxy,

        attrValue = kendo.attrValue,
        // navigation element roles
        buttonRoles = "button backbutton detailbutton listview-link",
        linkRoles = "tab",
        NS = ".kendoMobilePane",
        MOUSEDOWN = support.mousedown + NS,
        MOUSEUP = support.mouseup + NS,
        CLICK = "click" + NS,
        TOUCHSTART = "touchstart" + NS;

    function appLinkClick(e) {
        if(attrValue($(e.currentTarget), "rel") != EXTERNAL) {
            e.preventDefault();
        }
    }

    var Pane = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            element = that.element;

            element.addClass("km-pane");

            that.loader = new Loader(element, {
                loading: that.options.loading
            });

            that.viewEngine = new ViewEngine({
                container: element,
                transition: that.options.transition,
                layout: that.options.layout,
                loader: that.loader
            });

            that.viewEngine.bind(VIEW_SHOW, function(e) {
                that.trigger(VIEW_SHOW, e);
            });

            that.history = [];
            that._setupAppLinks();
        },

        options: {
            name: "Pane",
            transition: "",
            layout: "",
            loading: undefined
        },

        events: [
            NAVIGATE,
            VIEW_SHOW
        ],

        destroy: function() {
            Widget.fn.destroy.call(this);

            this.element.off(NS);

            kendo.destroy(this.element);
        },

        navigate: function(url, transition) {
            var that = this,
                history = that.history;

            if (url === BACK) {
                history.pop();
                url = history[history.length - 1];
            } else {
                that.history.push(url);
            }

            that.trigger(NAVIGATE, {url: url});
            that.viewEngine.showView(url, transition);
        },

        hideLoading: function() {
            this.loader.hide();
        },

        showLoading: function() {
            this.loader.show();
        },

        view: function() {
            return this.viewEngine.view();
        },

        _setupAppLinks: function() {
            var that = this,
                mouseup = proxy(that, "_mouseup");

            that.element
                .on(MOUSEDOWN, roleSelector(linkRoles), mouseup)
                .on(MOUSEUP, roleSelector(buttonRoles), mouseup)
                .on(CLICK, roleSelector(linkRoles + " " + buttonRoles), appLinkClick)
                .on(TOUCHSTART, roleSelector(buttonRoles), proxy(that, "_captureGhostClick"))
                .on(TOUCHSTART, ".km-popup .k-item", false); // Prevent ghost clicks in DropDownList
        },

        _captureGhostClick: function(e) {
            if (attrValue($(e.currentTarget), "rel") !== EXTERNAL) {
                e.preventDefault();
            }
        },

        _mouseup: function(e) {
            if (e.which > 1 || e.isDefaultPrevented()) {
                return;
            }

            var link = $(e.currentTarget),
                transition = attrValue(link, "transition"),
                rel = attrValue(link, "rel") || "",
                target = attrValue(link, "target"),
                pane = this,
                href = link.attr(HREF);

            if (rel === EXTERNAL || (typeof href === "undefined") || href === DUMMY_HREF) {
                return;
            }

            // Prevent iOS address bar progress display for in app navigation
            link.attr(HREF, DUMMY_HREF);
            setTimeout(function() { link.attr(HREF, href); });

            if (rel.match(WIDGET_RELS)) {
                kendo.widgetInstance($(href), ui).openFor(link);
            } else {
                if (target === "_top") {
                    pane = mobile.application.pane;
                }
                else if (target) {
                    pane = $("#" + target).data("kendoMobilePane");
                }

                pane.navigate(href, transition);
            }

            e.preventDefault();
        }
    });

    ui.plugin(Pane);
})(jQuery);
;