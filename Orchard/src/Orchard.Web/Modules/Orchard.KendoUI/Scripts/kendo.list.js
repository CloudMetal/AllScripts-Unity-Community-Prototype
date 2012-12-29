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
        ui = kendo.ui,
        Widget = ui.Widget,
        keys = kendo.keys,
        touch = kendo.support.touch,
        htmlEncode = kendo.htmlEncode,
        ID = "id",
        LI = "li",
        CLICK = touch ? "touchend" : "click",
        CHANGE = "change",
        CHARACTER = "character",
        FOCUSED = "k-state-focused",
        HOVER = "k-state-hover",
        LOADING = "k-loading",
        OPEN = "open",
        CLOSE = "close",
        SELECT = "select",
        SELECTED = "selected",
        REQUESTSTART = "requestStart",
        REQUESTEND = "requestEnd",
        extend = $.extend,
        proxy = $.proxy,
        browser = kendo.support.browser,
        isIE8 = browser.msie && parseInt(browser.version, 10) < 9,
        quotRegExp = /"/g;

    var List = Widget.extend({
        init: function(element, options) {
            var that = this,
                ns = that.ns,
                list, id;

            Widget.fn.init.call(that, element, options);

            that._template();

            that.ul = $('<ul unselectable="on" class="k-list k-reset"/>')
                        .css({ overflow: kendo.support.touch ? "": "auto" })
                        .on("mouseenter" + ns, LI, function() { $(this).addClass(HOVER); })
                        .on("mouseleave" + ns, LI, function() { $(this).removeClass(HOVER); })
                        .on(CLICK + ns, LI, proxy(that._click, that));

            that.list = list = $("<div class='k-list-container'/>")
                        .append(that.ul)
                        .on("mousedown" + ns, function(e) {
                            e.preventDefault();
                        });

            id = that.element.attr(ID);
            if (id) {
                list.attr(ID, id + "-list");
            }
        },

        items: function() {
            return this.ul[0].children;
        },

        current: function(candidate) {
            var that = this;

            if (candidate !== undefined) {
                if (that._current) {
                    that._current.removeClass(FOCUSED);
                }

                if (candidate) {
                    candidate.addClass(FOCUSED);
                    that._scroll(candidate);
                }

                that._current = candidate;
            } else {
                return that._current;
            }
        },

        destroy: function() {
            var that = this,
                ns = that.ns;

            Widget.fn.destroy.call(that);

            that._unbindDataSource();

            that.ul.off(ns);
            that.list.off(ns);

            that.popup.destroy();

            if (that._form) {
                that._form.off("reset", that._resetHandler);
            }
        },

        dataItem: function(index) {
            var that = this;

            if (index === undefined) {
                index = that.selectedIndex;
            }

            return that._data()[index];
        },

        _accessors: function() {
            var that = this,
                element = that.element,
                options = that.options,
                getter = kendo.getter,
                textField = element.attr(kendo.attr("text-field")),
                valueField = element.attr(kendo.attr("value-field"));

            if (textField) {
                options.dataTextField = textField;
            }

            if (valueField) {
                options.dataValueField = valueField;
            }

            that._text = getter(options.dataTextField);
            that._value = getter(options.dataValueField);
        },

        _blur: function() {
            var that = this;

            that._change();
            that.close();
        },

        _change: function() {
            var that = this,
                index = that.selectedIndex,
                value = that.value(),
                trigger;

            if (value !== that._old) {
                trigger = true;
            } else if (index !== undefined && index !== that._oldIndex) {
                trigger = true;
            }

            if (trigger) {
                that._old = value;
                that._oldIndex = index;

                that.trigger(CHANGE);

                // trigger the DOM change event so any subscriber gets notified
                that.element.trigger(CHANGE);
            }
        },

        _click: function(e) {
            if (!e.isDefaultPrevented()) {
                this._accept($(e.currentTarget));

                if (e.type === "touchend") {
                    e.preventDefault();
                }
            }
        },

        _data: function() {
            return this.dataSource.view();
        },

        _enable: function() {
            var that = this,
                options = that.options;

            if (that.element.prop("disabled")) {
                options.enable = false;
            }

            that.enable(options.enable);
        },

        _focus: function(li) {
            var that = this;

            if (that.popup.visible() && li && that.trigger(SELECT, {item: li})) {
                that.close();
                return;
            }

            that._select(li);
            that._blur();
        },

        _height: function(length) {
            if (length) {
                var that = this,
                    list = that.list,
                    visible = that.popup.visible(),
                    height = that.options.height;

                list = list.add(list.parent(".k-animation-container")).show()
                           .height(that.ul[0].scrollHeight > height ? height : "auto");

                if (!visible) {
                    list.hide();
                }
            }
        },

        _adjustListWidth: function() {
            var list = this.list,
                width = list[0].style.width,
                wrapper = this.wrapper,
                computedStyle, computedWidth;

            computedStyle = window.getComputedStyle ? window.getComputedStyle(wrapper[0], null) : 0;
            computedWidth = computedStyle ? parseFloat(computedStyle.width) : wrapper.outerWidth();

            if (computedStyle && (browser.mozilla || browser.msie)) { // getComputedStyle returns different box in FF and IE.
                computedWidth += parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight) + parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderRightWidth);
            }

            width = computedWidth - (list.outerWidth() - list.width());

            list.css({
                fontFamily: wrapper.css("font-family"),
                width: width
            });

            return true;
        },

        _popup: function() {
            var that = this,
                list = that.list,
                options = that.options,
                wrapper = that.wrapper;

            that.popup = new ui.Popup(list, extend({}, options.popup, {
                anchor: wrapper,
                open: function(e) {
                    that._adjustListWidth();

                    if (that.trigger(OPEN)) {
                        e.preventDefault();
                    }
                },
                close: function(e) {
                    if (that.trigger(CLOSE)) {
                        e.preventDefault();
                    }
                },
                animation: options.animation
            }));

            that._touchScroller = kendo.touchScroller(that.popup.element);
        },

        _makeUnselectable: function(element) {
            if (isIE8) {
                this.list.find("*").attr("unselectable", "on");
            }
        },

        _toggleHover: function(e) {
            if (!touch) {
                $(e.currentTarget).toggleClass(HOVER, e.type === "mouseenter");
            }
        },

        _toggle: function(open) {
            var that = this;
            open = open !== undefined? open : !that.popup.visible();

            if (!touch && that._focused[0] !== document.activeElement) {
                that._focused.focus();
            }

            that[open ? OPEN : CLOSE]();
        },

        _scroll: function (item) {

            if (!item) {
                return;
            }

            if (item[0]) {
                item = item[0];
            }

            var ul = this.ul[0],
                itemOffsetTop = item.offsetTop,
                itemOffsetHeight = item.offsetHeight,
                ulScrollTop = ul.scrollTop,
                ulOffsetHeight = ul.clientHeight,
                bottomDistance = itemOffsetTop + itemOffsetHeight;

            ul.scrollTop = ulScrollTop > itemOffsetTop ?
                           itemOffsetTop : bottomDistance > (ulScrollTop + ulOffsetHeight) ?
                           bottomDistance - ulOffsetHeight : ulScrollTop;
        },

        _template: function() {
            var that = this,
                options = that.options,
                template = options.template,
                hasDataSource = options.dataSource;

            if (that.element.is(SELECT) && that.element[0].length) {
                if (!hasDataSource) {
                    options.dataTextField = options.dataTextField || "text";
                    options.dataValueField = options.dataValueField || "value";
                }
            }

            if (!template) {
                that.template = kendo.template('<li unselectable="on" class="k-item">${data' + (options.dataTextField ? "." : "") + options.dataTextField + "}</li>", { useWithBlock: false });
            } else {
                template = kendo.template(template);
                that.template = function(data) {
                    return '<li unselectable="on" class="k-item">' + template(data) + "</li>";
                };
            }
        }
    });

    extend(List, {
        caret: function(element) {
            var caret,
                selection = element.ownerDocument.selection;

            if (selection) {
                caret = Math.abs(selection.createRange().moveStart(CHARACTER, -element.value.length));
            } else {
                caret = element.selectionStart;
            }

            return caret;
        },

        selectText: function (element, selectionStart, selectionEnd) {
            try {
                if (element.createTextRange) {
                        element.focus();
                        var textRange = element.createTextRange();
                        textRange.collapse(true);
                        textRange.moveStart(CHARACTER, selectionStart);
                        textRange.moveEnd(CHARACTER, selectionEnd - selectionStart);
                        textRange.select();
                } else {
                    element.setSelectionRange(selectionStart, selectionEnd);
                }
            } catch(e) { /* element is not focused or it is not in the DOM */ }
        },
        inArray: function(node, parentNode) {
            var idx, length, siblings = parentNode.children;

            if (!node || node.parentNode !== parentNode) {
                return -1;
            }

            for (idx = 0, length = siblings.length; idx < length; idx++) {
                if (node === siblings[idx]) {
                    return idx;
                }
            }

            return -1;
        }
    });

    kendo.ui.List = List;

    ui.Select = List.extend({
        init: function(element, options) {
            List.fn.init.call(this, element, options);
        },

        setDataSource: function(dataSource) {
            this.options.dataSource = dataSource;

            this._dataSource();

            if (this.options.autoBind) {
                this.dataSource.fetch();
            }
        },

        close: function() {
            this.popup.close();
        },

        _accessor: function(value, idx) {
            var element = this.element,
                isSelect = element.is(SELECT),
                option, selectedIndex;

            element = element[0];

            if (value === undefined) {
                if (isSelect) {
                    selectedIndex = element.selectedIndex;

                    if (selectedIndex > -1) {
                        option = element.options[selectedIndex];

                        if (option) {
                            value = option.value;
                        }
                    }
                } else {
                    value = element.value;
                }
                return value;
            } else {
                if (isSelect) {
                    element.selectedIndex = idx;
                } else {
                    element.value = value;
                }
            }
        },

        _hideBusy: function () {
            var that = this;
            clearTimeout(that._busy);
            that._arrow.removeClass(LOADING);
            that._busy = null;
        },

        _showBusy: function () {
            var that = this;

            that._request = true;

            if (that._busy) {
                return;
            }

            that._busy = setTimeout(function () {
                that._arrow.addClass(LOADING);
            }, 100);
        },

        _requestEnd: function() {
            this._request = false;
        },

        _dataSource: function() {
            var that = this,
                element = that.element,
                options = that.options,
                dataSource = options.dataSource || {},
                idx;

            dataSource = $.isArray(dataSource) ? {data: dataSource} : dataSource;

            if (element.is(SELECT)) {
                idx = element[0].selectedIndex;
                if (idx > -1) {
                    options.index = idx;
                }

                dataSource.select = element;
                dataSource.fields = [{ field: options.dataTextField },
                                     { field: options.dataValueField }];
            }

            if (that.dataSource && that._refreshHandler) {
                that._unbindDataSource();
            } else {
                that._refreshHandler = proxy(that.refresh, that);
                that._requestStartHandler = proxy(that._showBusy, that);
                that._requestEndHandler = proxy(that._requestEnd, that);
            }

            that.dataSource = kendo.data.DataSource.create(dataSource)
                                   .bind(CHANGE, that._refreshHandler)
                                   .bind(REQUESTSTART, that._requestStartHandler)
                                   .bind(REQUESTEND, that._requestEndHandler);
        },

        _unbindDataSource: function() {
            var that = this;

            that.dataSource.unbind(CHANGE, that._refreshHandler)
                           .unbind(REQUESTSTART, that._requestStartHandler)
                           .unbind(REQUESTEND, that._requestEndHandler);
        },

        _index: function(value) {
            var that = this,
                idx,
                length,
                data = that._data(),
                valueFromData;

            for (idx = 0, length = data.length; idx < length; idx++) {
                valueFromData = that._value(data[idx]);

                if (valueFromData === undefined) {
                    valueFromData = that._text(data[idx]);
                }

                if (valueFromData == value) {
                    return idx;
                }
            }

            return -1;
        },

        _get: function(li) {
            var that = this,
                data = that._data(),
                idx, length;

            if (typeof li === "function") {
                for (idx = 0, length = data.length; idx < length; idx++) {
                    if (li(data[idx])) {
                        li = idx;
                        break;
                    }
                }
            }

            if (typeof li === "number") {
                if (li < 0) {
                    return $();
                }

                li = $(that.ul[0].children[li]);
            }

            if (li && li.nodeType) {
                li = $(li);
            }

            return li;
        },

        _move: function(e) {
            var that = this,
                key = e.keyCode,
                ul = that.ul[0],
                current = that._current,
                down = key === keys.DOWN,
                pressed;

            if (key === keys.UP || down) {
                if (e.altKey) {
                    that.toggle(down);
                } else if (down) {
                    that._select(current ? current[0].nextSibling : ul.firstChild);
                    e.preventDefault();
                } else {
                    that._select(current ? current[0].previousSibling : ul.lastChild);
                    e.preventDefault();
                }
                pressed = true;
            } else if (key === keys.ENTER || key === keys.TAB) {

                if (that.popup.visible()) {
                    e.preventDefault();
                }

                that._accept(current);
                pressed = true;
            } else if (key === keys.ESC) {
                that.close();
                pressed = true;
            }

            return pressed;
        },

        _selectItem: function(value) {
            var that = this,
                options = that.options;

            value = value || options.value || that.value();

            if (value) {
                that.value(value);
            } else {
                that.select(options.index);
            }

            that.trigger("selected");
        },

        _valueOnFetch: function(value) {
            var that = this;

            if (!that.ul[0].firstChild && !that._fetch) {
                that.dataSource.one(CHANGE, function() {
                    that._fetch = true;
                    that.value(value);
                });

                if (!that._request) { // if request is started do not fetch again
                    that.dataSource.fetch();
                }

                return true;
            }

            that._fetch = false;
        },

        _options: function(data, optionLabel) {
            var that = this,
                element = that.element,
                selectedIndex = element[0].selectedIndex,
                length = data.length,
                options = "",
                option,
                dataItem,
                dataText,
                dataValue,
                idx = 0;

            if (optionLabel) {
                options = optionLabel;
                idx = 1;
            }

            for (; idx < length; idx++) {
                option = "<option";
                dataItem = data[idx];
                dataText = that._text(dataItem);
                dataValue = that._value(dataItem);

                if (dataValue !== undefined) {
                    dataValue += "";

                    if (dataValue.indexOf('"') !== -1) {
                        dataValue = dataValue.replace(quotRegExp, "&quot;");
                    }

                    option += ' value="' + dataValue + '"';
                }

                option += ">";

                if (dataText !== undefined) {
                    option += htmlEncode(dataText);
                }

                option += "</option>";
                options += option;
            }

            element.html(options);
            element[0].selectedIndex = selectedIndex;
        },

        _reset: function() {
            var that = this,
                element = that.element,
                form = element.closest("form");

            if (form[0]) {
                that._resetHandler = function() {
                    setTimeout(function() {
                        that.value(element[0].value);
                    });
                };

                that._form = form.on("reset", that._resetHandler);
            }
        },

        _cascade: function() {
            var that = this,
                options = that.options,
                cascade = options.cascadeFrom,
                parent, select, valueField,
                deactivate, change, dataSource;

            if (cascade) {
                parent = $("#" + cascade).data("kendo" + options.name);

                if (!parent) {
                    return;
                }

                dataSource = that.dataSource;
                valueField = parent.options.dataValueField;
                deactivate = function() {
                    that.value("");
                    that.enable(false);
                };
                change = function() {
                    var value = that.value();
                    if (value) {
                        that.value(value);
                        if (that.selectedIndex == -1) {
                            that.value("");
                        }
                    } else {
                        that.select(options.index);
                    }
                    that.trigger(SELECTED);
                    that.enable();
                };
                select = function() {
                    var dataItem = parent.dataItem(),
                        filterValue = dataItem ? parent._value(dataItem) : null,
                        expressions, filters;

                    if (filterValue) {
                        expressions = dataSource.filter() || {};
                        removeFiltersForField(expressions, valueField);
                        filters = expressions.filters || [];

                        filters.push({
                            field: valueField,
                            operator: "eq",
                            value: filterValue
                        });

                        dataSource
                            .one(CHANGE, change)
                            .filter(filters);

                    } else {
                        deactivate();
                    }
                };

                parent.bind("cascade", deactivate)
                      .bind(CHANGE, function() {
                          select();
                          that.trigger("cascade");
                      })
                      .one(SELECTED, function() {
                          select();
                      });


                if (parent._valueCalled !== undefined) {
                    select();
                } else if (!parent.value()) {
                    that.enable(false);
                }
            }
        }
    });

    function removeFiltersForField(expression, field) {
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function(filter) {
                removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    ui.Select.removeFiltersForField = removeFiltersForField;

})(jQuery);
;