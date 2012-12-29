/*
* Kendo UI Complete v2012.2.913 (http://kendoui.com)
* Copyright 2012 Telerik AD. All rights reserved.
*
* Kendo UI Complete commercial licenses may be obtained at
* https://www.kendoui.com/purchase/license-agreement/kendo-ui-complete-commercial.aspx
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
(function ($, undefined) {
    // Imports ================================================================
    var each = $.each,
        grep = $.grep,
        isArray = $.isArray,
        map = $.map,
        math = Math,
        extend = $.extend,
        proxy = $.proxy,
        doc = document,

        kendo = window.kendo,
        Class = kendo.Class,
        DataSource = kendo.data.DataSource,
        Widget = kendo.ui.Widget,
        template = kendo.template,
        deepExtend = kendo.deepExtend,
        getter = kendo.getter,

        dataviz = kendo.dataviz,
        Axis = dataviz.Axis,
        AxisLabel = dataviz.AxisLabel,
        BarAnimation = dataviz.BarAnimation,
        Box2D = dataviz.Box2D,
        BoxElement = dataviz.BoxElement,
        ChartElement = dataviz.ChartElement,
        Color = dataviz.Color,
        ElementAnimation = dataviz.ElementAnimation,
        NumericAxis = dataviz.NumericAxis,
        Point2D = dataviz.Point2D,
        RootElement = dataviz.RootElement,
        Ring = dataviz.Ring,
        Text = dataviz.Text,
        TextBox = dataviz.TextBox,
        Title = dataviz.Title,
        animationDecorator = dataviz.animationDecorator,
        append = dataviz.append,
        autoFormat = dataviz.autoFormat,
        defined = dataviz.defined,
        getSpacing = dataviz.getSpacing,
        inArray = dataviz.inArray,
        interpolateValue = dataviz.interpolateValue,
        last = dataviz.last,
        round = dataviz.round,
        renderTemplate = dataviz.renderTemplate,
        uniqueId = dataviz.uniqueId;

    var CSS_PREFIX = "k-";

    // Constants ==============================================================
    var ABOVE = "above",
        AREA = "area",
        AXIS_LABEL_CLICK = dataviz.AXIS_LABEL_CLICK,
        BAR = "bar",
        BAR_BORDER_BRIGHTNESS = 0.8,
        BELOW = "below",
        BLACK = "#000",
        BOTTOM = "bottom",
        BUBBLE = "bubble",
        CATEGORY = "category",
        CENTER = "center",
        CHANGE = "change",
        CIRCLE = "circle",
        CLICK = "click",
        CLIP = dataviz.CLIP,
        COLUMN = "column",
        COORD_PRECISION = dataviz.COORD_PRECISION,
        DATABOUND = "dataBound",
        DATE = "date",
        DATE_REGEXP = /^\/Date\((.*?)\)\/$/,
        DAYS = "days",
        DEFAULT_FONT = dataviz.DEFAULT_FONT,
        DEFAULT_HEIGHT = dataviz.DEFAULT_HEIGHT,
        DEFAULT_PRECISION = dataviz.DEFAULT_PRECISION,
        DEFAULT_WIDTH = dataviz.DEFAULT_WIDTH,
        DEGREE = math.PI / 180,
        DONUT = "donut",
        DONUT_SECTOR_ANIM_DELAY = 50,
        FADEIN = "fadeIn",
        GLASS = "glass",
        HOURS = "hours",
        INITIAL_ANIMATION_DURATION = dataviz.INITIAL_ANIMATION_DURATION,
        INSIDE_BASE = "insideBase",
        INSIDE_END = "insideEnd",
        INTERPOLATE = "interpolate",
        LEFT = "left",
        LINE = "line",
        LINE_MARKER_SIZE = 8,
        MAX_VALUE = Number.MAX_VALUE,
        MIN_VALUE = -Number.MAX_VALUE,
        MINUTES = "minutes",
        MONTHS = "months",
        MOUSEMOVE_TRACKING = "mousemove.tracking",
        MOUSEOVER = "mouseover",
        NS = ".kendoChart",
        OUTSIDE_END = "outsideEnd",
        OUTLINE_SUFFIX = "_outline",
        PIE = "pie",
        PIE_SECTOR_ANIM_DELAY = 70,
        PLOT_AREA_CLICK = "plotAreaClick",
        PRIMARY = "primary",
        RIGHT = "right",
        ROUNDED_BEVEL = "roundedBevel",
        ROUNDED_GLASS = "roundedGlass",
        SCATTER = "scatter",
        SCATTER_LINE = "scatterLine",
        SERIES_CLICK = "seriesClick",
        SERIES_HOVER = "seriesHover",
        STRING = "string",
        TIME_PER_MINUTE = 60000,
        TIME_PER_HOUR = 60 * TIME_PER_MINUTE,
        TIME_PER_DAY = 24 * TIME_PER_HOUR,
        TIME_PER_MONTH = 31 * TIME_PER_DAY,
        TIME_PER_YEAR = 365 * TIME_PER_DAY,
        TIME_PER_UNIT = {
            "years": TIME_PER_YEAR,
            "months": TIME_PER_MONTH,
            "days": TIME_PER_DAY,
            "hours": TIME_PER_HOUR,
            "minutes": TIME_PER_MINUTE
        },
        TOP = "top",
        TOOLTIP_ANIMATION_DURATION = 150,
        TOOLTIP_OFFSET = 5,
        TOOLTIP_SHOW_DELAY = 100,
        TRIANGLE = "triangle",
        VERTICAL_LINE = "verticalLine",
        VERTICAL_AREA = "verticalArea",
        WHITE = "#fff",
        X = "x",
        Y = "y",
        YEARS = "years",
        ZERO = "zero";

    var CATEGORICAL_CHARTS = [BAR, COLUMN, LINE, VERTICAL_LINE, AREA, VERTICAL_AREA],
        XY_CHARTS = [SCATTER, SCATTER_LINE, BUBBLE];

    var DateLabelFormats = {
        minutes: "HH:mm",
        hours: "HH:mm",
        days: "M/d",
        months: "MMM 'yy",
        years: "yyyy"
    };

    // Chart ==================================================================
    var Chart = Widget.extend({
        init: function(element, userOptions) {
            var chart = this,
                options,
                themeOptions,
                themes = dataviz.ui.themes.chart || {},
                dataSourceOptions = (userOptions || {}).dataSource,
                themeName;

            Widget.fn.init.call(chart, element);
            options = deepExtend({}, chart.options, userOptions);

            themeName = options.theme;
            themeOptions = themeName ? themes[themeName] || themes[themeName.toLowerCase()] : {};

            applyDefaults(options, themeOptions);

            chart.options = deepExtend({}, themeOptions, options);

            applySeriesColors(chart.options);

            chart.bind(chart.events, chart.options);

            chart.element.addClass("k-chart");

            chart.wrapper = chart.element;

            chart._dataChangeHandler = proxy(chart._onDataChanged, chart);

            chart.dataSource = DataSource
                .create(dataSourceOptions)
                .bind(CHANGE, chart._dataChangeHandler);

            chart._redraw();
            chart._attachEvents();

            if (dataSourceOptions && options.autoBind) {
                chart.dataSource.fetch();
            }

            kendo.notify(chart, dataviz.ui);
        },

        setDataSource: function(dataSource) {
            var chart = this;

            if (chart.dataSource) {
                chart.dataSource.unbind(CHANGE, chart._dataChangeHandler);
            }

            chart.dataSource = dataSource;

            dataSource.bind(CHANGE, chart._dataChangeHandler);

            if (chart.options.autoBind) {
                dataSource.fetch();
            }
        },

        events:[
            DATABOUND,
            SERIES_CLICK,
            SERIES_HOVER,
            AXIS_LABEL_CLICK,
            PLOT_AREA_CLICK
        ],

        items: function() {
            return $();
        },

        options: {
            name: "Chart",
            theme: "default",
            chartArea: {},
            title: {
                visible: true
            },
            legend: {
                visible: true,
                labels: {}
            },
            categoryAxis: {
                categories: []
            },
            autoBind: true,
            seriesDefaults: {
                type: COLUMN,
                data: [],
                groupNameTemplate: "#= group.value + (kendo.dataviz.defined(series.name) ? ': ' + series.name : '') #",
                labels: {}
            },
            series: [],
            tooltip: {
                visible: false
            },
            transitions: true
        },

        refresh: function() {
            var chart = this;

            applyDefaults(chart.options);

            if (chart.dataSource) {
                delete chart._sourceSeries;
                chart._onDataChanged();
            } else {
                chart._redraw();
            }
        },

        redraw: function() {
            var chart = this;

            applyDefaults(chart.options);

            chart._redraw();
        },

        _redraw: function() {
            var chart = this,
                options = chart.options,
                element = chart.element,
                model = chart._model = chart._getModel(),
                viewType = dataviz.ui.defaultView(),
                view;

            chart._plotArea = model._plotArea;

            if (viewType) {
                view = chart._view = viewType.fromModel(model);

                element.css("position", "relative");
                chart._viewElement = view.renderTo(element[0]);
                chart._tooltip = new dataviz.Tooltip(element, options.tooltip);
                chart._highlight = new Highlight(view, chart._viewElement);
            }
        },

        svg: function() {
            var model = this._getModel(),
                view = dataviz.SVGView.fromModel(model);

            return view.render();
        },

        _getModel: function() {
            var chart = this,
                options = chart.options,
                element = chart.element,
                model = new RootElement(deepExtend({
                    width: element.width() || DEFAULT_WIDTH,
                    height: element.height() || DEFAULT_HEIGHT,
                    transitions: options.transitions
                    }, options.chartArea)),
                plotArea;

            if (options.title && options.title.visible && options.title.text) {
                model.append(new Title(options.title));
            }

            plotArea = model._plotArea = chart._createPlotArea();
            if (options.legend.visible) {
                model.append(new Legend(plotArea.options.legend));
            }
            model.append(plotArea);
            model.reflow();

            return model;
        },

        _createPlotArea: function() {
            var chart = this,
                options = chart.options,
                series = options.series,
                i,
                length = series.length,
                currentSeries,
                categoricalSeries = [],
                xySeries = [],
                pieSeries = [],
                donutSeries = [],
                plotArea;

            for (i = 0; i < length; i++) {
                currentSeries = series[i];

                if (inArray(currentSeries.type, CATEGORICAL_CHARTS)) {
                    categoricalSeries.push(currentSeries);
                } else if (inArray(currentSeries.type, XY_CHARTS)) {
                    xySeries.push(currentSeries);
                } else if (currentSeries.type === PIE) {
                    pieSeries.push(currentSeries);
                } else if (currentSeries.type === DONUT) {
                    donutSeries.push(currentSeries);
                }
            }

            if (pieSeries.length > 0) {
                plotArea = new PiePlotArea(pieSeries, options);
            } else if (donutSeries.length > 0) {
                plotArea = new DonutPlotArea(donutSeries, options);
            } else if (xySeries.length > 0) {
                plotArea = new XYPlotArea(xySeries, options);
            } else {
                plotArea = new CategoricalPlotArea(categoricalSeries, options);
            }

            return plotArea;
        },

        _attachEvents: function() {
            var chart = this,
                element = chart.element;

            element.on(CLICK + NS, proxy(chart._click, chart));
            element.on(MOUSEOVER + NS, proxy(chart._mouseOver, chart));
        },

        _getChartElement: function(e) {
            var chart = this,
                modelId = $(e.target).data("modelId"),
                model = chart._model,
                element;

            if (modelId) {
                element = model.modelMap[modelId];
            }

            if (element && element.aliasFor) {
                element = element.aliasFor(e, chart._eventCoordinates(e));
            }

            return element;
        },

        _eventCoordinates: function(e) {
            var element = this.element,
                offset = element.offset(),
                paddingLeft = parseInt(element.css("paddingLeft"), 10),
                paddingTop = parseInt(element.css("paddingTop"), 10),
                win = $(window);

            return {
                x: e.clientX - offset.left - paddingLeft + win.scrollLeft(),
                y: e.clientY - offset.top - paddingTop + win.scrollTop()
            };
        },

        _click: function(e) {
            var chart = this,
                element = chart._getChartElement(e);

            while (element) {
                if (element.click) {
                    element.click(chart, e);
                }

                element = element.parent;
            }
        },

        _mouseOver: function(e) {
            var chart = this,
                tooltip = chart._tooltip,
                highlight = chart._highlight,
                tooltipOptions,
                point;

            if (!highlight || highlight.overlayElement === e.target) {
                return;
            }

            point = chart._getChartElement(e);
            if (point && point.hover) {
                point.hover(chart, e);
                chart._activePoint = point;

                tooltipOptions = deepExtend({}, chart.options.tooltip, point.options.tooltip);
                if (tooltipOptions.visible) {
                    tooltip.show(point);
                }

                highlight.show(point);

                $(doc.body).on(MOUSEMOVE_TRACKING, proxy(chart._mouseMove, chart));
            }
        },

        _mouseMove: function(e) {
            var chart = this,
                tooltip = chart._tooltip,
                highlight = chart._highlight,
                coords = chart._eventCoordinates(e),
                point = chart._activePoint,
                tooltipOptions,
                owner,
                seriesPoint;

            if (chart._plotArea.box.containsPoint(coords.x, coords.y)) {
                if (point && point.series && (point.series.type === LINE || point.series.type === AREA)) {
                    owner = point.parent;
                    seriesPoint = owner.getNearestPoint(coords.x, coords.y, point.seriesIx);
                    if (seriesPoint && seriesPoint != point) {
                        seriesPoint.hover(chart, e);
                        chart._activePoint = seriesPoint;

                        tooltipOptions = deepExtend({}, chart.options.tooltip, point.options.tooltip);
                        if (tooltipOptions.visible) {
                            tooltip.show(seriesPoint);
                        }
                        highlight.show(seriesPoint);
                    }
                }
            } else {
                $(doc.body).off(MOUSEMOVE_TRACKING);

                delete chart._activePoint;
                tooltip.hide();
                highlight.hide();
            }
        },

        _onDataChanged: function() {
            var chart = this,
                options = chart.options,
                series = chart._sourceSeries || options.series,
                seriesIx,
                seriesLength = series.length,
                data = chart.dataSource.view(),
                grouped = (chart.dataSource.group() || []).length > 0,
                processedSeries = [],
                currentSeries;

            for (seriesIx = 0; seriesIx < seriesLength; seriesIx++) {
                currentSeries = series[seriesIx];

                if (currentSeries.field || (currentSeries.xField && currentSeries.yField)) {
                    currentSeries.data = data;

                    [].push.apply(processedSeries, grouped ?
                        chart._createGroupedSeries(currentSeries, data) :
                        [ currentSeries ]
                    );
                } else {
                    processedSeries.push(currentSeries);
                }
            }

            chart._sourceSeries = series;
            options.series = processedSeries;

            applySeriesColors(chart.options);

            chart._bindCategories(grouped ? data[0].items : data);

            chart.trigger(DATABOUND);
            chart._redraw();
        },

        _createGroupedSeries: function(series, data) {
            var groupSeries = [],
                nameTemplate,
                group,
                groupIx,
                dataLength = data.length,
                seriesClone;

            if (series.groupNameTemplate) {
                nameTemplate = template(series.groupNameTemplate);
            }

            for (groupIx = 0; groupIx < dataLength; groupIx++) {
                seriesClone = deepExtend({}, series);
                seriesClone.color = undefined;
                groupSeries.push(seriesClone);

                group = data[groupIx];
                seriesClone.data = group.items;

                if (nameTemplate) {
                    seriesClone.name = nameTemplate({
                        series: seriesClone, group: group
                    });
                }
            }

            return groupSeries;
        },

        _bindCategories: function(data) {
            var categoryAxis = this.options.categoryAxis,
                i,
                category,
                row,
                length = data.length;

            if (categoryAxis.field) {
                for (i = 0; i < length; i++) {
                    row = data[i];

                    category = getField(categoryAxis.field, row);
                    if (i === 0) {
                        categoryAxis.categories = [category];
                        categoryAxis.dataItems = [row];
                    } else {
                        categoryAxis.categories.push(category);
                        categoryAxis.dataItems.push(row);
                    }
                }
            }
        },

        destroy: function() {
            var chart = this,
                dataSource = chart.dataSource;

            chart.wrapper.off(NS);
            dataSource.unbind(CHANGE, chart._dataChangeHandler);

            Widget.fn.destroy.call(chart);
        }
    });


    var BarLabel = ChartElement.extend({
        init: function(content, options) {
            var barLabel = this;
            ChartElement.fn.init.call(barLabel, options);

            barLabel.append(new TextBox(content, barLabel.options));
        },

        options: {
            position: OUTSIDE_END,
            margin: getSpacing(3),
            padding: getSpacing(4),
            color: BLACK,
            background: "",
            border: {
                width: 1,
                color: ""
            },
            aboveAxis: true,
            vertical: false,
            animation: {
                type: FADEIN,
                delay: INITIAL_ANIMATION_DURATION
            },
            zIndex: 1
        },

        reflow: function(targetBox) {
            var barLabel = this,
                options = barLabel.options,
                vertical = options.vertical,
                aboveAxis = options.aboveAxis,
                text = barLabel.children[0],
                box = text.box,
                padding = text.options.padding;

            text.options.align = vertical ? CENTER : LEFT;
            text.options.vAlign = vertical ? TOP : CENTER;

            if (options.position == INSIDE_END) {
                if (vertical) {
                    text.options.vAlign = TOP;

                    if (!aboveAxis && box.height() < targetBox.height()) {
                        text.options.vAlign = BOTTOM;
                    }
                } else {
                    text.options.align = aboveAxis ? RIGHT : LEFT;
                }
            } else if (options.position == CENTER) {
                text.options.vAlign = CENTER;
                text.options.align = CENTER;
            } else if (options.position == INSIDE_BASE) {
                if (vertical) {
                    text.options.vAlign = aboveAxis ? BOTTOM : TOP;
                } else {
                    text.options.align = aboveAxis ? LEFT : RIGHT;
                }
            } else if (options.position == OUTSIDE_END) {
                if (vertical) {
                    if (aboveAxis) {
                        targetBox = new Box2D(
                            targetBox.x1, targetBox.y1 - box.height(),
                            targetBox.x2, targetBox.y1
                        );
                    } else {
                        targetBox = new Box2D(
                            targetBox.x1, targetBox.y2,
                            targetBox.x2, targetBox.y2 + box.height()
                        );
                    }
                } else {
                    text.options.align = CENTER;
                    if (aboveAxis) {
                        targetBox = new Box2D(
                            targetBox.x2 + box.width(), targetBox.y1,
                            targetBox.x2, targetBox.y2
                        );
                    } else {
                        targetBox = new Box2D(
                            targetBox.x1 - box.width(), targetBox.y1,
                            targetBox.x1, targetBox.y2
                        );
                    }
                }
            }

            if (vertical) {
                padding.left = padding.right =
                    (targetBox.width() - text.contentBox.width()) / 2;
            } else {
                padding.top = padding.bottom =
                    (targetBox.height() - text.contentBox.height()) / 2;
            }

            text.reflow(targetBox);
        }
    });

    var Legend = ChartElement.extend({
        init: function(options) {
            var legend = this;

            ChartElement.fn.init.call(legend, options);

            legend.createLabels();
        },

        options: {
            position: RIGHT,
            items: [],
            labels: {},
            offsetX: 0,
            offsetY: 0,
            margin: getSpacing(10),
            padding: getSpacing(5),
            border: {
                color: BLACK,
                width: 0
            },
            background: "",
            zIndex: 1
        },

        createLabels: function() {
            var legend = this,
                items = legend.options.items,
                count = items.length,
                label,
                name,
                i;

            for (i = 0; i < count; i++) {
                name = items[i].name;
                    label = new Text(name, legend.options.labels);

                legend.append(label);
            }
        },

        reflow: function(targetBox) {
            var legend = this,
                options = legend.options,
                childrenCount = legend.children.length;

            if (childrenCount === 0) {
                legend.box = targetBox.clone();
                return;
            }

            if (options.position == "custom") {
                legend.customLayout(targetBox);
                return;
            }

            if (options.position == TOP || options.position == BOTTOM) {
                legend.horizontalLayout(targetBox);
            } else {
                legend.verticalLayout(targetBox);
            }
        },

        getViewElements: function(view) {
            var legend = this,
                children = legend.children,
                options = legend.options,
                items = options.items,
                count = items.length,
                markerSize = legend.markerSize(),
                group = view.createGroup({ zIndex: options.zIndex }),
                border = options.border || {},
                padding,
                markerBox,
                labelBox,
                color,
                label,
                box,
                i;

            append(group.children, ChartElement.fn.getViewElements.call(legend, view));

            for (i = 0; i < count; i++) {
                color = items[i].color;
                label = children[i];
                markerBox = new Box2D();
                box = label.box;

                labelBox = labelBox ? labelBox.wrap(box) : box.clone();

                markerBox.x1 = box.x1 - markerSize * 2;
                markerBox.x2 = markerBox.x1 + markerSize;

                if (options.position == TOP || options.position == BOTTOM) {
                    markerBox.y1 = box.y1 + markerSize / 2;
                } else {
                    markerBox.y1 = box.y1 + (box.height() - markerSize) / 2;
                }

                markerBox.y2 = markerBox.y1 + markerSize;

                group.children.push(view.createRect(markerBox, { fill: color, stroke: color }));
            }

            if (children.length > 0) {
                padding = getSpacing(options.padding);
                padding.left += markerSize * 2;
                labelBox.pad(padding);
                group.children.unshift(view.createRect(labelBox, {
                    stroke: border.width ? border.color : "",
                    strokeWidth: border.width,
                    dashType: border.dashType,
                    fill: options.background })
                );
            }

            return [ group ];
        },

        verticalLayout: function(targetBox) {
            var legend = this,
                options = legend.options,
                children = legend.children,
                childrenCount = children.length,
                labelBox = children[0].box.clone(),
                offsetX,
                offsetY,
                margin = getSpacing(options.margin),
                markerSpace = legend.markerSize() * 2,
                label,
                i;

            // Position labels below each other
            for (i = 1; i < childrenCount; i++) {
                label = legend.children[i];
                label.box.alignTo(legend.children[i - 1].box, BOTTOM);
                labelBox.wrap(label.box);
            }

            // Vertical center is calculated relative to the container, not the parent!
            if (options.position == LEFT) {
                offsetX = targetBox.x1 + markerSpace + margin.left;
                offsetY = (targetBox.y2 - labelBox.height()) / 2;
                labelBox.x2 += markerSpace + margin.left + margin.right;
            } else {
                offsetX = targetBox.x2 - labelBox.width() - margin.right;
                offsetY = (targetBox.y2 - labelBox.height()) / 2;
                labelBox.translate(offsetX, offsetY);
                labelBox.x1 -= markerSpace + margin.left;
            }

            legend.translateChildren(offsetX + options.offsetX,
                    offsetY + options.offsetY);

            var labelBoxWidth = labelBox.width();
            labelBox.x1 = math.max(targetBox.x1, labelBox.x1);
            labelBox.x2 = labelBox.x1 + labelBoxWidth;

            labelBox.y1 = targetBox.y1;
            labelBox.y2 = targetBox.y2;

            legend.box = labelBox;
        },

        horizontalLayout: function(targetBox) {
            var legend = this,
                options = legend.options,
                children = legend.children,
                childrenCount = children.length,
                box = children[0].box.clone(),
                markerWidth = legend.markerSize() * 3,
                offsetX,
                offsetY,
                margin = getSpacing(options.margin),
                boxWidth = children[0].box.width() + markerWidth,
                plotAreaWidth = targetBox.width(),
                label,
                labelY = 0,
                i;

            // Position labels next to each other
            for (i = 1; i < childrenCount; i++) {
                label = children[i];

                boxWidth += label.box.width() + markerWidth;
                if (boxWidth > plotAreaWidth - markerWidth) {
                    label.box = new Box2D(box.x1, box.y2,
                        box.x1 + label.box.width(), box.y2 + label.box.height());
                    boxWidth = label.box.width() + markerWidth;
                    labelY = label.box.y1;
                } else {
                    label.box.alignTo(children[i - 1].box, RIGHT);
                    label.box.y2 = labelY + label.box.height();
                    label.box.y1 = labelY;
                    label.box.translate(markerWidth, 0);
                }
                box.wrap(label.box);
            }

            offsetX = (targetBox.width() - box.width() + markerWidth) / 2;
            if (options.position === TOP) {
                offsetY = targetBox.y1 + margin.top;
                box.y2 = targetBox.y1 + box.height() + margin.top + margin.bottom;
                box.y1 = targetBox.y1;
            } else {
                offsetY = targetBox.y2 - box.height() - margin.bottom;
                box.y1 = targetBox.y2 - box.height() - margin.top - margin.bottom;
                box.y2 = targetBox.y2;
            }

            legend.translateChildren(offsetX + options.offsetX,
                    offsetY + options.offsetY);

            box.x1 = targetBox.x1;
            box.x2 = targetBox.x2;

            legend.box = box;
        },

        customLayout: function (targetBox) {
            var legend = this,
                options = legend.options,
                children = legend.children,
                childrenCount = children.length,
                labelBox = children[0].box.clone(),
                markerWidth = legend.markerSize() * 2,
                i;

            // Position labels next to each other
            for (i = 1; i < childrenCount; i++) {
                labelBox = legend.children[i].box;
                labelBox.alignTo(legend.children[i - 1].box, BOTTOM);
                labelBox.wrap(labelBox);
            }

            legend.translateChildren(options.offsetX + markerWidth, options.offsetY);

            legend.box = targetBox;
        },

        markerSize: function() {
            var legend = this,
                children = legend.children;

            if (children.length > 0) {
                return children[0].box.height() / 2;
            } else {
                return 0;
            }
        }
    });

    var CategoryAxis = Axis.extend({
        options: {
            type: CATEGORY,
            categories: [],
            vertical: false,
            majorGridLines: {
                visible: false,
                width: 1,
                color: BLACK
            },
            zIndex: 1,

            _labelsOnTicks: false
        },

        range: function() {
            return { min: 0, max: this.options.categories.length };
        },

        getTickPositions: function(itemsCount) {
            var axis = this,
                options = axis.options,
                vertical = options.vertical,
                size = vertical ? axis.box.height() : axis.box.width(),
                step = size / itemsCount,
                pos = vertical ? axis.box.y1 : axis.box.x1,
                positions = [],
                i;

            for (i = 0; i < itemsCount; i++) {
                positions.push(round(pos, COORD_PRECISION));
                pos += step;
            }

            positions.push(vertical ? axis.box.y2 : axis.box.x2);

            return options.reverse ? positions.reverse() : positions;
        },

        getMajorTickPositions: function() {
            var axis = this;

            return axis.getTickPositions(axis.options.categories.length);
        },

        getMinorTickPositions: function() {
            var axis = this;

            return axis.getTickPositions(axis.options.categories.length * 2);
        },

        getSlot: function(from, to) {
            var axis = this,
                options = axis.options,
                reverse = options.reverse,
                vertical = options.vertical,
                valueAxis = vertical ? Y : X,
                lineBox = axis.lineBox(),
                slotBox = new Box2D(lineBox.x1, lineBox.y1, lineBox.x1, lineBox.y1),
                lineStart = lineBox[valueAxis + (reverse ? 2 : 1)],
                size = vertical ? lineBox.height() : lineBox.width(),
                categoriesLength = math.max(1, options.categories.length),
                step = (reverse ? -1 : 1) * (size / categoriesLength),
                p1,
                p2,
                slotSize;

            from = math.min(math.max(0, from), categoriesLength);
            to = defined(to) ? to : from;
            to = math.max(math.min(categoriesLength, to), from);
            p1 = lineStart + (from * step);
            p2 = p1 + step;
            slotSize = to - from;

            if (slotSize > 0 || (from == to && categoriesLength == from)) {
                p2 = p1 + (slotSize * step);
            }

            slotBox[valueAxis + 1] = reverse ? p2 : p1;
            slotBox[valueAxis + 2] = reverse ? p1 : p2;

            return slotBox;
        },

        getCategory: function(point) {
            var axis = this,
                options = axis.options,
                reverse = options.reverse,
                vertical = options.vertical,
                valueAxis = vertical ? Y : X,
                lineBox = axis.lineBox(),
                lineStart = lineBox[valueAxis + (reverse ? 2 : 1)],
                lineSize = vertical ? lineBox.height() : lineBox.width(),
                intervals = math.max(1, options.categories.length - 1),
                offset = (reverse ? -1 : 1) * (point[valueAxis] - lineStart),
                step = intervals / lineSize,
                categoriesOffset = round(offset * step),
                categoryIx;

            if (offset < 0 || offset > lineSize) {
                return null;
            }

            categoryIx = vertical ?
                intervals - categoriesOffset:
                categoriesOffset;

            return options.categories[categoryIx];
        },

        labelsCount: function() {
            return this.options.categories.length;
        },

        createAxisLabel: function(index, labelOptions) {
            var axis = this,
                options = axis.options,
                dataItem = options.dataItems ? options.dataItems[index] : null,
                category = defined(options.categories[index]) ? options.categories[index] : "";

            return new AxisLabel(category, index, dataItem, labelOptions);
        }
    });

    var AxisDateLabel = AxisLabel.extend({
        formatValue: function(value, options) {
            return kendo.toString(value, options.format, options.culture);
        }
    });

    var DateCategoryAxis = CategoryAxis.extend({
        init: function(options) {
            var axis = this;

            options = options || {};

            deepExtend(options, {
                min: toDate(options.min),
                max: toDate(options.max)
            });

            options = axis.applyDefaults(options);

            if (options.categories.length > 0) {
                axis.groupCategories(options);
            }

            CategoryAxis.fn.init.call(axis, options);
        },

        options: {
            type: DATE,
            labels: {
                dateFormats: DateLabelFormats
            }
        },

        applyDefaults: function(options) {
            var categories = options.categories,
                count = categories.length,
                categoryIx,
                cat,
                diff,
                minDiff = MAX_VALUE,
                lastCat,
                unit;

            for (categoryIx = 0; categoryIx < count; categoryIx++) {
                cat = toDate(categories[categoryIx]);

                if (cat && lastCat) {
                    diff = cat - lastCat;
                    if (diff > 0) {
                        minDiff = math.min(minDiff, diff);

                        if (minDiff >= TIME_PER_YEAR) {
                            unit = YEARS;
                        } else if (minDiff >= TIME_PER_MONTH - TIME_PER_DAY * 3) {
                            unit = MONTHS;
                        } else if (minDiff >= TIME_PER_DAY) {
                            unit = DAYS;
                        } else if (minDiff >= TIME_PER_HOUR) {
                            unit = HOURS;
                        } else {
                            unit = MINUTES;
                        }
                    }
                }

                lastCat = cat;
            }

            if (!options.baseUnit) {
                delete options.baseUnit;
            }

            return deepExtend({ baseUnit: unit || DAYS }, options);
        },

        groupCategories: function(options) {
            var axis = this,
                categories = toDate(options.categories),
                baseUnit = options.baseUnit,
                min = toTime(options.min),
                max = toTime(options.max),
                minCategory = toTime(sparseArrayMin(categories)),
                maxCategory = toTime(sparseArrayMax(categories)),
                start = floorDate(min || minCategory, baseUnit),
                end = ceilDate((max || maxCategory) + 1, baseUnit),
                date,
                nextDate,
                groups = [],
                categoryMap = [],
                categoryIndicies,
                categoryIx,
                categoryDate;

            for (date = start; date < end; date = nextDate) {
                groups.push(date);
                nextDate = addDuration(date, 1, baseUnit);

                categoryIndicies = [];
                for (categoryIx = 0; categoryIx < categories.length; categoryIx++) {
                    categoryDate = toDate(categories[categoryIx]);
                    if (categoryDate && categoryDate >= date && categoryDate < nextDate) {
                        categoryIndicies.push(categoryIx);
                    }
                }

                categoryMap.push(categoryIndicies);
            }

            options.min = groups[0];
            options.max = last(groups);
            options.categories = groups;
            axis.categoryMap = categoryMap;
        },

        createAxisLabel: function(index, labelOptions) {
            var options = this.options,
                dataItem = options.dataItems ? options.dataItems[index] : null,
                date = options.categories[index],
                unitFormat = labelOptions.dateFormats[options.baseUnit];

            labelOptions.format = labelOptions.format || unitFormat;

            return new AxisDateLabel(date, index, dataItem, labelOptions);
        }
    });

    var DateValueAxis = Axis.extend({
        init: function(seriesMin, seriesMax, options) {
            var axis = this;

            options = options || {};

            deepExtend(options, {
                min: toDate(options.min),
                max: toDate(options.max),
                axisCrossingValue: toDate(options.axisCrossingValue)
            });

            options = axis.applyDefaults(toDate(seriesMin), toDate(seriesMax), options);

            Axis.fn.init.call(axis, options);
        },

        options: {
            type: DATE,
            labels: {
                dateFormats: DateLabelFormats
            }
        },

        applyDefaults: function(seriesMin, seriesMax, options) {
            var axis = this,
                min = options.min || seriesMin,
                max = options.max || seriesMax,
                baseUnit = options.baseUnit || axis.timeUnits(max - min),
                baseUnitTime = TIME_PER_UNIT[baseUnit],
                autoMin = floorDate(toTime(min) - 1, baseUnit),
                autoMax = ceilDate(toTime(max) + 1, baseUnit),
                userMajorUnit = options.majorUnit ? options.majorUnit : undefined,
                majorUnit = userMajorUnit || dataviz.ceil(
                                dataviz.autoMajorUnit(autoMin.getTime(), autoMax.getTime()),
                                baseUnitTime
                            ) / baseUnitTime,
                actualUnits = duration(autoMin, autoMax, baseUnit),
                totalUnits = dataviz.ceil(actualUnits, majorUnit),
                unitsToAdd = totalUnits - actualUnits,
                head = math.floor(unitsToAdd / 2),
                tail = unitsToAdd - head;

            if (!options.baseUnit) {
                delete options.baseUnit;
            }

            return deepExtend({
                    baseUnit: baseUnit,
                    min: addDuration(autoMin, -head, baseUnit),
                    max: addDuration(autoMax, tail, baseUnit),
                    minorUnit: majorUnit / 5
                }, options, {
                    majorUnit: majorUnit
                }
            );
        },

        range: function() {
            var options = this.options;
            return { min: options.min, max: options.max };
        },

        getDivisions: function(stepValue) {
            var options = this.options;

            return math.floor(
                duration(options.min, options.max, options.baseUnit) / stepValue + 1
            );
        },

        getTickPositions: function(stepValue) {
            var axis = this,
                options = axis.options,
                vertical = options.vertical,
                reverse = options.reverse,
                lineBox = axis.lineBox(),
                lineSize = vertical ? lineBox.height() : lineBox.width(),
                timeRange = duration(options.min, options.max, options.baseUnit),
                scale = lineSize / timeRange,
                step = stepValue * scale,
                divisions = axis.getDivisions(stepValue),
                dir = (vertical ? -1 : 1) * (reverse ? -1 : 1),
                startEdge = dir === 1 ? 1 : 2,
                pos = lineBox[(vertical ? Y : X) + startEdge],
                positions = [],
                i;

            for (i = 0; i < divisions; i++) {
                positions.push(round(pos, COORD_PRECISION));
                pos = pos + step * dir;
            }

            return positions;
        },

        getMajorTickPositions: function() {
            var axis = this;

            return axis.getTickPositions(axis.options.majorUnit);
        },

        getMinorTickPositions: function() {
            var axis = this;

            return axis.getTickPositions(axis.options.minorUnit);
        },

        getSlot: function(a, b) {
            return NumericAxis.fn.getSlot.call(
                this, toDate(a), toDate(b)
            );
        },

        getValue: function(point) {
            var value = NumericAxis.fn.getValue.call(this, point);

            return value !== null ? toDate(value) : null;
        },

        labelsCount: function() {
            return this.getDivisions(this.options.majorUnit);
        },

        createAxisLabel: function(index, labelOptions) {
            var options = this.options,
                offset =  index * options.majorUnit,
                date = addDuration(options.min, offset, options.baseUnit),
                unitFormat = labelOptions.dateFormats[options.baseUnit];

            labelOptions.format = labelOptions.format || unitFormat;

            return new AxisDateLabel(date, index, null, labelOptions);
        },

        timeUnits: function(delta) {
            var unit = HOURS;

            if (delta >= TIME_PER_YEAR) {
                unit = YEARS;
            } else if (delta >= TIME_PER_MONTH) {
                unit = MONTHS;
            } else if (delta >= TIME_PER_DAY) {
                unit = DAYS;
            }

            return unit;
        }
    });

    var ClusterLayout = ChartElement.extend({
        init: function(options) {
            var cluster = this;
            ChartElement.fn.init.call(cluster, options);
        },

        options: {
            vertical: false,
            gap: 0,
            spacing: 0
        },

        reflow: function(box) {
            var cluster = this,
                options = cluster.options,
                vertical = options.vertical,
                axis = vertical ? Y : X,
                children = cluster.children,
                gap = options.gap,
                spacing = options.spacing,
                count = children.length,
                slots = count + gap + (spacing * (count - 1)),
                slotSize = (vertical ? box.height() : box.width()) / slots,
                position = box[axis + 1] + slotSize * (gap / 2),
                childBox,
                i;

            for (i = 0; i < count; i++) {
                childBox = (children[i].box || box).clone();

                childBox[axis + 1] = position;
                childBox[axis + 2] = position + slotSize;

                children[i].reflow(childBox);
                if (i < count - 1) {
                    position += (slotSize * spacing);
                }

                position += slotSize;
            }
        }
    });

    var StackLayout = ChartElement.extend({
        init: function(options) {
            var stack = this;
            ChartElement.fn.init.call(stack, options);
        },

        options: {
            vertical: true,
            isReversed: false
        },

        reflow: function(targetBox) {
            var stack = this,
                options = stack.options,
                vertical = options.vertical,
                positionAxis = vertical ? X : Y,
                stackAxis = vertical ? Y : X,
                stackBase = targetBox[stackAxis + 2],
                children = stack.children,
                box = stack.box = new Box2D(),
                childrenCount = children.length,
                stackDirection,
                i;

            if (options.isReversed) {
                stackDirection = vertical ? BOTTOM : LEFT;
            } else {
                stackDirection = vertical ? TOP : RIGHT;
            }

            for (i = 0; i < childrenCount; i++) {
                var currentChild = children[i],
                    childBox = currentChild.box.clone();

                childBox.snapTo(targetBox, positionAxis);
                if (currentChild.options) {
                    currentChild.options.stackBase = stackBase;
                }

                if (i === 0) {
                    box = stack.box = childBox.clone();
                } else {
                    childBox.alignTo(children[i - 1].box, stackDirection);
                }

                currentChild.reflow(childBox);

                box.wrap(childBox);
            }
        }
    });

    var PointEventsMixin = {
        click: function(chart, e) {
            var point = this;

            chart.trigger(SERIES_CLICK, {
                value: point.value,
                category: point.category,
                series: point.series,
                dataItem: point.dataItem,
                element: $(e.target)
            });
        },

        hover: function(chart, e) {
            var point = this;

            chart.trigger(SERIES_HOVER, {
                value: point.value,
                category: point.category,
                series: point.series,
                dataItem: point.dataItem,
                element: $(e.target)
            });
        }
    };

    var Bar = ChartElement.extend({
        init: function(value, options) {
            var bar = this;

            ChartElement.fn.init.call(bar, options);

            bar.value = value;
            bar.options.id = uniqueId();
            bar.makeDiscoverable();
        },

        options: {
            color: WHITE,
            border: {
                width: 1
            },
            vertical: true,
            overlay: {
                gradient: GLASS
            },
            aboveAxis: true,
            labels: {
                visible: false
            },
            animation: {
                type: BAR
            },
            opacity: 1
        },

        render: function() {
            var bar = this,
                value = bar.value,
                options = bar.options,
                labels = options.labels,
                labelText = value,
                labelTemplate;

            if (bar._rendered) {
                return;
            } else {
                bar._rendered = true;
            }

            if (labels.visible && value) {
                if (labels.template) {
                    labelTemplate = template(labels.template);
                    labelText = labelTemplate({
                        dataItem: bar.dataItem,
                        category: bar.category,
                        value: bar.value,
                        series: bar.series
                    });
                } else if (labels.format) {
                    labelText = autoFormat(labels.format, labelText);
                }

                bar.append(
                    new BarLabel(labelText,
                        deepExtend({
                            vertical: options.vertical,
                            id: uniqueId()
                        },
                        options.labels
                    ))
                );
            }
        },

        reflow: function(targetBox) {
            this.render();

            var bar = this,
                options = bar.options,
                children = bar.children,
                label = children[0];

            bar.box = targetBox;

            if (label) {
                label.options.aboveAxis = options.aboveAxis;
                label.reflow(targetBox);
            }
        },

        getViewElements: function(view) {
            var bar = this,
                options = bar.options,
                vertical = options.vertical,
                border = options.border.width > 0 ? {
                    stroke: bar.getBorderColor(),
                    strokeWidth: options.border.width,
                    dashType: options.border.dashType
                } : {},
                box = bar.box,
                rectStyle = deepExtend({
                    id: options.id,
                    fill: options.color,
                    fillOpacity: options.opacity,
                    strokeOpacity: options.opacity,
                    vertical: options.vertical,
                    aboveAxis: options.aboveAxis,
                    stackBase: options.stackBase,
                    animation: options.animation,
                    data: { modelId: options.modelId }
                }, border),
                elements = [];

            if (box.width() > 0 && box.height() > 0) {
                if (options.overlay) {
                    rectStyle.overlay = deepExtend({
                        rotation: vertical ? 0 : 90
                    }, options.overlay);
                }

                elements.push(view.createRect(box, rectStyle));
            }

            append(elements, ChartElement.fn.getViewElements.call(bar, view));

            return elements;
        },

        highlightOverlay: function(view, options){
            var bar = this,
                box = bar.box;

            options = deepExtend({ data: { modelId: bar.options.modelId } }, options);

            return view.createRect(box, options);
        },

        getBorderColor: function() {
            var bar = this,
                options = bar.options,
                color = options.color,
                borderColor = options.border.color;

            if (!defined(borderColor)) {
                borderColor =
                    new Color(color).brightness(BAR_BORDER_BRIGHTNESS).toHex();
            }

            return borderColor;
        },

        tooltipAnchor: function(tooltipWidth, tooltipHeight) {
            var bar = this,
                options = bar.options,
                box = bar.box,
                vertical = options.vertical,
                aboveAxis = options.aboveAxis,
                x,
                y;

            if (vertical) {
                x = box.x2 + TOOLTIP_OFFSET;
                y = aboveAxis ? box.y1 : box.y2 - tooltipHeight;
            } else {
                if (options.isStacked) {
                    x = box.x2 - tooltipWidth;
                    y = box.y1 - tooltipHeight - TOOLTIP_OFFSET;
                } else {
                    x = box.x2 + TOOLTIP_OFFSET;
                    y = box.y1;
                }
            }

            return new Point2D(x, y);
        },

        formatValue: function(format) {
            var point = this;

            return point.owner.formatPointValue(point, format);
        }
    });
    deepExtend(Bar.fn, PointEventsMixin);

    var CategoricalChart = ChartElement.extend({
        init: function(plotArea, options) {
            var chart = this;

            ChartElement.fn.init.call(chart, options);

            chart.plotArea = plotArea;

            // Value axis ranges grouped by axis name, e.g.:
            // primary: { min: 0, max: 1 }
            chart.valueAxisRanges = {};

            chart.points = [];
            chart.categoryPoints = [];
            chart.seriesPoints = [];

            chart.render();
        },

        options: {
            series: [],
            invertAxes: false,
            isStacked: false
        },

        render: function() {
            var chart = this;

            chart.traverseDataPoints(proxy(chart.addValue, chart));
        },

        addValue: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                value = data.value,
                point,
                categoryPoints = chart.categoryPoints[categoryIx],
                seriesPoints = chart.seriesPoints[seriesIx];

            if (!categoryPoints) {
                chart.categoryPoints[categoryIx] = categoryPoints = [];
            }

            if (!seriesPoints) {
                chart.seriesPoints[seriesIx] = seriesPoints = [];
            }

            chart.updateRange(value, categoryIx, series);

            point = chart.createPoint(data, category, categoryIx, series, seriesIx);
            if (point) {
                point.category = category;
                point.series = series;
                point.seriesIx = seriesIx;
                point.owner = chart;
                point.dataItem = series.data[categoryIx];
            }

            chart.points.push(point);
            seriesPoints.push(point);
            categoryPoints.push(point);
        },

        updateRange: function(value, categoryIx, series) {
            var chart = this,
                axisName = series.axis || PRIMARY,
                axisRange = chart.valueAxisRanges[axisName];

            if (defined(value)) {
                axisRange = chart.valueAxisRanges[axisName] =
                    axisRange || { min: MAX_VALUE, max: MIN_VALUE };

                axisRange.min = math.min(axisRange.min, value);
                axisRange.max = math.max(axisRange.max, value);
            }
        },

        seriesValueAxis: function(series) {
            return this.plotArea.namedValueAxes[(series || {}).axis || PRIMARY];
        },

        reflow: function(targetBox) {
            var chart = this,
                options = chart.options,
                invertAxes = options.invertAxes,
                plotArea = chart.plotArea,
                pointIx = 0,
                categorySlots = chart.categorySlots = [],
                chartPoints = chart.points,
                categoryAxis = plotArea.categoryAxis,
                valueAxis,
                axisCrossingValue,
                point;

            chart.traverseDataPoints(function(data, category, categoryIx, currentSeries) {
                var value = data.value;

                valueAxis = chart.seriesValueAxis(currentSeries);
                axisCrossingValue = valueAxis.options.axisCrossingValue;
                point = chartPoints[pointIx++];

                if (point && point.plotValue) {
                    value = point.plotValue;
                }

                var categorySlot = chart.categorySlot(categoryAxis, categoryIx, valueAxis),
                    valueSlot = chart.valueSlot(valueAxis, value),
                    slotX = invertAxes ? valueSlot : categorySlot,
                    slotY = invertAxes ? categorySlot : valueSlot,
                    pointSlot = new Box2D(slotX.x1, slotY.y1, slotX.x2, slotY.y2),
                    aboveAxis = valueAxis.options.reverse ?
                                    value < axisCrossingValue : value >= axisCrossingValue;

                if (point) {
                    point.options.aboveAxis = aboveAxis;
                    point.reflow(pointSlot);
                }

                if (!categorySlots[categoryIx]) {
                    categorySlots[categoryIx] = categorySlot;
                }
            });

            chart.reflowCategories(categorySlots);

            chart.box = targetBox;
        },

        reflowCategories: function() { },

        valueSlot: function(valueAxis, value) {
            return valueAxis.getSlot(value);
        },

        categorySlot: function(categoryAxis, categoryIx) {
            return categoryAxis.getSlot(categoryIx);
        },

        traverseDataPoints: function(callback) {
            var chart = this,
                options = chart.options,
                series = options.series,
                categories = chart.plotArea.options.categoryAxis.categories || [],
                count = categoriesCount(series),
                valueFields = chart.valueFields(),
                bindableFields = chart.bindableFields(),
                categoryIx,
                seriesIx,
                pointData,
                currentCategory,
                currentSeries,
                seriesCount = series.length;

            for (categoryIx = 0; categoryIx < count; categoryIx++) {
                for (seriesIx = 0; seriesIx < seriesCount; seriesIx++) {
                    currentCategory = categories[categoryIx];
                    currentSeries = series[seriesIx];
                    pointData = bindPoint(currentSeries, categoryIx, valueFields, bindableFields);

                    callback(pointData, currentCategory, categoryIx, currentSeries, seriesIx);
                }
            }
        },

        valueFields: function() {
            return ["value"];
        },

        bindableFields: function() {
            return [];
        },

        formatPointValue: function(point, format) {
            return autoFormat(format, point.value);
        }
    });

    var BarChart = CategoricalChart.extend({
        init: function(plotArea, options) {
            var chart = this;

            chart._groupTotals = {};
            chart._groups = [];

            CategoricalChart.fn.init.call(chart, plotArea, options);
        },

        render: function() {
            var chart = this;

            CategoricalChart.fn.render.apply(chart);
            chart.computeAxisRanges();
        },

        createPoint: function(data, category, categoryIx, series, seriesIx) {
            var barChart = this,
                value = data.value,
                options = barChart.options,
                children = barChart.children,
                isStacked = barChart.options.isStacked,
                labelOptions = deepExtend({}, series.labels),
                bar,
                cluster;

            if (isStacked) {
                if (labelOptions.position == OUTSIDE_END) {
                    labelOptions.position = INSIDE_END;
                }
            }

            bar = new Bar(value,
                deepExtend({}, {
                    vertical: !options.invertAxes,
                    overlay: series.overlay,
                    labels: labelOptions,
                    isStacked: isStacked
                }, series, {
                    color: data.fields.color || undefined
                }));

            cluster = children[categoryIx];
            if (!cluster) {
                cluster = new ClusterLayout({
                    vertical: options.invertAxes,
                    gap: options.gap,
                    spacing: options.spacing
                });
                barChart.append(cluster);
            }

            if (isStacked) {
                var stackWrap = barChart.getStackWrap(series, cluster),
                    positiveStack,
                    negativeStack;

                if (stackWrap.children.length === 0) {
                    positiveStack = new StackLayout({
                        vertical: !options.invertAxes
                    });
                    negativeStack = new StackLayout({
                        vertical: !options.invertAxes,
                        isReversed: true
                    });

                    stackWrap.append(positiveStack, negativeStack);
                } else {
                    positiveStack = stackWrap.children[0];
                    negativeStack = stackWrap.children[1];
                }

                if (value > 0) {
                    positiveStack.append(bar);
                } else {
                    negativeStack.append(bar);
                }
            } else {
                cluster.append(bar);
            }

            return bar;
        },

        getStackWrap: function(series, cluster) {
            var wraps = cluster.children,
                stackGroup = series.stack,
                stackWrap,
                i,
                length = wraps.length;

            if (typeof stackGroup === STRING) {
                for (i = 0; i < length; i++) {
                    if (wraps[i]._stackGroup === stackGroup) {
                        stackWrap = wraps[i];
                        break;
                    }
                }
            } else {
                stackWrap = wraps[0];
            }

            if (!stackWrap) {
                stackWrap = new ChartElement();
                stackWrap._stackGroup = stackGroup;
                cluster.append(stackWrap);
            }

            return stackWrap;
        },

        updateRange: function(value, categoryIx, series) {
            var chart = this,
                isStacked = chart.options.isStacked,
                totals = chart.groupTotals(series.stack),
                positive = totals.positive,
                negative = totals.negative;

            if (defined(value)) {
                if (isStacked) {
                    incrementSlot(value > 0 ? positive : negative, categoryIx, value);
                } else {
                    CategoricalChart.fn.updateRange.apply(chart, arguments);
                }
            }
        },

        computeAxisRanges: function() {
            var chart = this,
                isStacked = chart.options.isStacked,
                axisName,
                categoryTotals;

            if (isStacked) {
                axisName = chart.options.series[0].axis || PRIMARY;
                categoryTotals = chart.categoryTotals();
                chart.valueAxisRanges[axisName] = {
                    min: sparseArrayMin(categoryTotals.negative.concat(0)),
                    max: sparseArrayMax(categoryTotals.positive.concat(0))
                };
            }
        },

        seriesValueAxis: function(series) {
            var chart = this,
                options = chart.options;

            return CategoricalChart.fn.seriesValueAxis.call(
                chart,
                options.isStacked ? chart.options.series[0] : series
            );
        },

        valueSlot: function(valueAxis, value) {
            return valueAxis.getSlot(value, this.options.isStacked ? 0 : undefined);
        },

        categorySlot: function(categoryAxis, categoryIx, valueAxis) {
            var chart = this,
                options = chart.options,
                categorySlot = categoryAxis.getSlot(categoryIx),
                stackAxis,
                zeroSlot;

            if (options.isStacked) {
                zeroSlot = valueAxis.getSlot(0, 0);
                stackAxis = options.invertAxes ? X : Y;
                categorySlot[stackAxis + 1] = categorySlot[stackAxis + 2] = zeroSlot[stackAxis + 1];
            }

            return categorySlot;
        },

        reflow: function(targetBox) {
            var chart = this;

            chart.setStacksDirection();

            CategoricalChart.fn.reflow.call(chart, targetBox);
        },

        setStacksDirection: function() {
            var chart = this,
                options = chart.options,
                series = options.series,
                count = categoriesCount(series),
                clusters = chart.children,
                categoryIx,
                seriesIx,
                currentSeries,
                valueAxis,
                seriesCount = series.length;

            for (seriesIx = 0; seriesIx < seriesCount; seriesIx++) {
                currentSeries = series[seriesIx];
                valueAxis = chart.seriesValueAxis(currentSeries);

                for (categoryIx = 0; categoryIx < count; categoryIx++) {
                    var cluster = clusters[categoryIx],
                        stackWrap = chart.getStackWrap(currentSeries, cluster),
                        stacks = stackWrap.children,
                        positiveStack = stacks[0],
                        negativeStack = stacks[1];

                    if (positiveStack && negativeStack) {
                        positiveStack.options.isReversed = valueAxis.options.reverse;
                        negativeStack.options.isReversed = !valueAxis.options.reverse;
                    }
                }
            }
        },

        reflowCategories: function(categorySlots) {
            var chart = this,
                children = chart.children,
                childrenLength = children.length,
                i;

            for (i = 0; i < childrenLength; i++) {
                children[i].reflow(categorySlots[i]);
            }
        },

        groupTotals: function(stackGroup) {
            var chart = this,
                groupName = typeof stackGroup === STRING ? stackGroup : "default",
                totals = chart._groupTotals[groupName];

            if (!totals) {
                totals = chart._groupTotals[groupName] = {
                    positive: [],
                    negative: []
                };

                chart._groups.push(groupName);
            }

            return totals;
        },

        categoryTotals: function() {
            var chart = this,
                groups = chart._groups,
                groupTotals = chart._groupTotals,
                name,
                totals,
                categoryTotals = { positive: [], negative: [] },
                i,
                length = groups.length;

            for (i = 0; i < length; i++) {
                name = groups[i];
                totals = groupTotals[name];
                append(categoryTotals.positive, totals.positive);
                append(categoryTotals.negative, totals.negative);
            }

            return categoryTotals;
        },

        bindableFields: function() {
            return ["color"];
        }
    });

    var ShapeElement = BoxElement.extend({
        init: function(options) {
            var marker = this;

            BoxElement.fn.init.call(marker, options);
        },

        options: {
            type: CIRCLE,
            align: CENTER,
            vAlign: CENTER
        },

        getViewElements: function(view, renderOptions) {
            var marker = this,
                options = marker.options,
                type = options.type,
                box = marker.paddingBox,
                element,
                elementOptions,
                halfWidth = box.width() / 2;

            if (!options.visible || !marker.hasBox()) {
                return [];
            }

            elementOptions = deepExtend(marker.elementStyle(), renderOptions);

            if (type === TRIANGLE) {
                element = view.createPolyline([
                    new Point2D(box.x1 + halfWidth, box.y1),
                    new Point2D(box.x1, box.y2),
                    new Point2D(box.x2, box.y2)
                ], true, elementOptions);
            } else if (type === CIRCLE) {
                element = view.createCircle(new Point2D(
                    round(box.x1 + halfWidth, COORD_PRECISION),
                    round(box.y1 + box.height() / 2, COORD_PRECISION)
                ), halfWidth, elementOptions);
            } else {
                element = view.createRect(box, elementOptions);
            }

            return [ element ];
        }
    });

    var LinePoint = ChartElement.extend({
        init: function(value, options) {
            var point = this;

            ChartElement.fn.init.call(point, options);

            point.value = value;
            point.options.id = uniqueId();
            point.makeDiscoverable();
        },

        options: {
            aboveAxis: true,
            vertical: true,
            markers: {
                visible: true,
                background: WHITE,
                size: LINE_MARKER_SIZE,
                type: CIRCLE,
                border: {
                    width: 2
                },
                opacity: 1
            },
            labels: {
                visible: false,
                position: ABOVE,
                margin: getSpacing(3),
                padding: getSpacing(4),
                animation: {
                    type: FADEIN,
                    delay: INITIAL_ANIMATION_DURATION
                }
            }
        },

        render: function() {
            var point = this,
                options = point.options,
                markers = options.markers,
                labels = options.labels,
                markerBackground = markers.background,
                markerBorder = deepExtend({}, markers.border),
                labelText = point.value;

            if (point._rendered) {
                return;
            } else {
                point._rendered = true;
            }

            if (!defined(markerBorder.color)) {
                markerBorder.color =
                    new Color(markerBackground).brightness(BAR_BORDER_BRIGHTNESS).toHex();
            }

            point.marker = new ShapeElement({
                id: point.options.id,
                visible: markers.visible,
                type: markers.type,
                width: markers.size,
                height: markers.size,
                background: markerBackground,
                border: markerBorder,
                opacity: markers.opacity,
                zIndex: markers.zIndex,
                animation: markers.animation
            });

            point.append(point.marker);

            if (labels.visible) {
                if (labels.template) {
                    var labelTemplate = template(labels.template);
                    labelText = labelTemplate({
                        dataItem: point.dataItem,
                        category: point.category,
                        value: point.value,
                        series: point.series
                    });
                } else if (labels.format) {
                    labelText = point.formatValue(labels.format);
                }
                point.label = new TextBox(labelText,
                    deepExtend({
                        id: uniqueId(),
                        align: CENTER,
                        vAlign: CENTER,
                        margin: {
                            left: 5,
                            right: 5
                        }
                    }, labels)
                );
                point.append(point.label);
            }
        },

        markerBox: function() {
            return this.marker.box;
        },

        reflow: function(targetBox) {
            var point = this,
                options = point.options,
                vertical = options.vertical,
                aboveAxis = options.aboveAxis,
                childBox;

            point.render();

            point.box = targetBox;
            childBox = targetBox.clone();

            if (vertical) {
                if (aboveAxis) {
                    childBox.y1 -= childBox.height();
                } else {
                    childBox.y2 += childBox.height();
                }
            } else {
                if (aboveAxis) {
                    childBox.x1 += childBox.width();
                } else {
                    childBox.x2 -= childBox.width();
                }
            }

            point.marker.reflow(childBox);
            point.reflowLabel(childBox);
        },

        reflowLabel: function(box) {
            var point = this,
                options = point.options,
                marker = point.marker,
                label = point.label,
                anchor = options.labels.position;

            if (label) {
                anchor = anchor === ABOVE ? TOP : anchor;
                anchor = anchor === BELOW ? BOTTOM : anchor;

                label.reflow(box);
                label.box.alignTo(marker.box, anchor);
                label.reflow(label.box);
            }
        },

        highlightOverlay: function(view, options) {
            var element = this,
                marker = element.marker;

            options = deepExtend({ data: { modelId: element.options.modelId } }, options);

            return marker.getViewElements(view, deepExtend(options, {
                fill: marker.options.border.color,
                fillOpacity: 1,
                strokeOpacity: 0
            }))[0];
        },

        tooltipAnchor: function(tooltipWidth, tooltipHeight) {
            var point = this,
                markerBox = point.marker.box,
                aboveAxis = point.options.aboveAxis;

            return new Point2D(
                markerBox.x2 + TOOLTIP_OFFSET,
                aboveAxis ? markerBox.y1 - tooltipHeight : markerBox.y2
            );
        },

        formatValue: function(format) {
            var point = this;

            return point.owner.formatPointValue(point, format);
        }
    });
    deepExtend(LinePoint.fn, PointEventsMixin);

    var Bubble = LinePoint.extend({
        init: function(value, options) {
            var point = this;

            LinePoint.fn.init.call(point, value, options);

            point.category = value.category;
        },

        options: {
            labels: {
                position: CENTER
            },
            highlight: {
                opacity: 1,
                border: {
                    width: 1
                }
            }
        },

        highlightOverlay: function(view) {
            var element = this,
                options = element.options,
                highlight = options.highlight,
                borderWidth = highlight.border.width,
                markers = options.markers,
                center = element.box.center(),
                radius = markers.size / 2 - borderWidth / 2,
                borderColor =
                    new Color(markers.background)
                    .brightness(BAR_BORDER_BRIGHTNESS)
                    .toHex();

            return view.createCircle(center, radius, {
                data: { modelId: element.options.modelId },
                stroke: borderColor,
                strokeWidth: borderWidth
            });
        },

        toggleHighlight: function(view, on) {
            var element = this,
                opacity = element.options.highlight.opacity;

            element.highlighted = !element.highlighted;

            var marker = element.marker.getViewElements(view, {
                fillOpacity: element.highlighted ? opacity : undefined
            })[0];

            marker.refresh(doc.getElementById(this.options.id));

        }
    });

    var LineSegment = ChartElement.extend({
        init: function(linePoints, series, seriesIx) {
            var segment = this;

            ChartElement.fn.init.call(segment);

            segment.linePoints = linePoints;
            segment.series = series;
            segment.seriesIx = seriesIx;
            segment.options.id = uniqueId();

            segment.makeDiscoverable();
        },

        options: {},

        points: function(visualPoints) {
            var segment = this,
                linePoints = segment.linePoints.concat(visualPoints || []),
                points = [],
                i,
                length = linePoints.length,
                pointCenter;

            for (i = 0; i < length; i++) {
                pointCenter = linePoints[i].markerBox().center();
                points.push(new Point2D(pointCenter.x, pointCenter.y));
            }

            return points;
        },

        getViewElements: function(view) {
            var segment = this,
                series = segment.series;

            ChartElement.fn.getViewElements.call(segment, view);

            return [
                view.createPolyline(segment.points(), false, {
                    id: segment.options.id,
                    stroke: series.color,
                    strokeWidth: series.width,
                    strokeOpacity: series.opacity,
                    fill: "",
                    dashType: series.dashType,
                    data: { modelId: segment.options.modelId },
                    zIndex: -1
                })
            ];
        },

        aliasFor: function(e, coords) {
            var segment = this,
                seriesIx = segment.seriesIx;

            return segment.parent.getNearestPoint(coords.x, coords.y, seriesIx);
        }
    });

    var LineChartMixin = {
        renderSegments: function() {
            var chart = this,
                options = chart.options,
                series = options.series,
                seriesPoints = chart.seriesPoints,
                currentSeries,
                seriesIx,
                seriesCount = seriesPoints.length,
                currentSeriesPoints,
                linePoints,
                point,
                pointIx,
                pointCount,
                segments = [];

            for (seriesIx = 0; seriesIx < seriesCount; seriesIx++) {
                currentSeriesPoints = seriesPoints[seriesIx];
                pointCount = currentSeriesPoints.length;
                currentSeries = series[seriesIx];
                linePoints = [];

                for (pointIx = 0; pointIx < pointCount; pointIx++) {
                    point = currentSeriesPoints[pointIx];
                    if (point) {
                        linePoints.push(point);
                    } else if (currentSeries.missingValues !== INTERPOLATE) {
                        if (linePoints.length > 1) {
                            segments.push(
                                chart.createSegment(
                                    linePoints, currentSeries, seriesIx, last(segments)
                                )
                            );
                        }
                        linePoints = [];
                    }
                }

                if (linePoints.length > 1) {
                    segments.push(
                        chart.createSegment(
                            linePoints, currentSeries, seriesIx, last(segments)
                        )
                    );
                }
            }

            chart._segments = segments;
            chart.append.apply(chart, segments);
        },

        createSegment: function(linePoints, currentSeries, seriesIx) {
            return new LineSegment(linePoints, currentSeries, seriesIx);
        },

        getNearestPoint: function(x, y, seriesIx) {
            var chart = this,
                invertAxes = chart.options.invertAxes,
                axis = invertAxes ? Y : X,
                pos = invertAxes ? y : x,
                points = chart.seriesPoints[seriesIx],
                nearestPointDistance = MAX_VALUE,
                pointsLength = points.length,
                currentPoint,
                pointBox,
                pointDistance,
                nearestPoint,
                i;

            for (i = 0; i < pointsLength; i++) {
                currentPoint = points[i];

                if (currentPoint && defined(currentPoint.value) && currentPoint.value !== null) {
                    pointBox = currentPoint.box;
                    pointDistance = math.abs(pointBox.center()[axis] - pos);

                    if (pointDistance < nearestPointDistance) {
                        nearestPoint = currentPoint;
                        nearestPointDistance = pointDistance;
                    }
                }
            }

            return nearestPoint;
        }
    };

    var LineChart = CategoricalChart.extend({
        init: function(plotArea, options) {
            var chart = this;

            chart._stackAxisRange = { min: MAX_VALUE, max: MIN_VALUE };
            chart._categoryTotals = [];
            chart.makeDiscoverable();

            CategoricalChart.fn.init.call(chart, plotArea, options);
        },

        render: function() {
            var chart = this;

            CategoricalChart.fn.render.apply(chart);

            chart.computeAxisRanges();
            chart.renderSegments();
        },

        createPoint: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                value = data.value,
                options = chart.options,
                isStacked = options.isStacked,
                categoryPoints = chart.categoryPoints[categoryIx],
                stackPoint,
                plotValue = 0;

            if (!defined(value) || value === null) {
                if (series.missingValues === ZERO) {
                    value = 0;
                } else {
                    return null;
                }
            }

            var point = new LinePoint(value,
                deepExtend({
                    vertical: !options.invertAxes,
                    markers: {
                        border: {
                            color: series.color
                        }
                    }
                }, series)
            );

            if (isStacked) {
                stackPoint = lastValue(categoryPoints);
                if (stackPoint) {
                    plotValue = stackPoint.plotValue;
                }

                point.plotValue = value + plotValue;
            }

            chart.append(point);

            return point;
        },

        updateRange: function(value, categoryIx, series) {
            var chart = this,
                isStacked = chart.options.isStacked,
                stackAxisRange = chart._stackAxisRange,
                totals = chart._categoryTotals;

            if (defined(value)) {
                if (isStacked) {
                    incrementSlot(totals, categoryIx, value);

                    stackAxisRange.min = math.min(stackAxisRange.min, sparseArrayMin(totals));
                    stackAxisRange.max = math.max(stackAxisRange.max, sparseArrayMax(totals));
                } else {
                    CategoricalChart.fn.updateRange.apply(chart, arguments);
                }
            }
        },

        computeAxisRanges: function() {
            var chart = this,
                isStacked = chart.options.isStacked,
                axisName;

            if (isStacked) {
                axisName = chart.options.series[0].axis || PRIMARY;
                chart.valueAxisRanges[axisName] = chart._stackAxisRange;
            }
        },

        getViewElements: function(view) {
            var chart = this,
                elements = CategoricalChart.fn.getViewElements.call(chart, view),
                group = view.createGroup({
                    animation: {
                        type: CLIP
                    }
                });

            group.children = elements;
            return [group];
        }
    });
    deepExtend(LineChart.fn, LineChartMixin);

    var AreaSegment = LineSegment.extend({
        init: function(linePoints, stackPoints, currentSeries, seriesIx) {
            var segment = this;

            segment.stackPoints = stackPoints;

            LineSegment.fn.init.call(segment, linePoints, currentSeries, seriesIx);
        },

        points: function() {
            var segment = this,
                chart = segment.parent,
                stack = chart.options.isStacked && segment.seriesIx > 0,
                plotArea = chart.plotArea,
                invertAxes = chart.options.invertAxes,
                axisLineBox = plotArea.categoryAxis.lineBox(),
                end = invertAxes ? axisLineBox.x1 : axisLineBox.y1,
                stackPoints = segment.stackPoints,
                points = LineSegment.fn.points.call(segment, stackPoints),
                firstPoint,
                lastPoint;

            if (!stack && points.length > 1) {
                firstPoint = points[0];
                lastPoint = last(points);

                if (invertAxes) {
                    points.unshift(new Point2D(end, firstPoint.y));
                    points.push(new Point2D(end, lastPoint.y));
                } else {
                    points.unshift(new Point2D(firstPoint.x, end));
                    points.push(new Point2D(lastPoint.x, end));
                }
            }

            return points;
        },

        getViewElements: function(view) {
            var segment = this,
                series = segment.series,
                lineOptions = deepExtend({
                        color: series.color,
                        opacity: series.opacity
                    }, series.line
                );

            ChartElement.fn.getViewElements.call(segment, view);

            return [
                view.createPolyline(segment.points(), true, {
                    id: segment.options.id,
                    stroke: lineOptions.color,
                    strokeWidth: lineOptions.width,
                    strokeOpacity: lineOptions.opacity,
                    dashType: lineOptions.dashType,
                    fillOpacity: series.opacity,
                    fill: series.color,
                    stack: series.stack,
                    data: { modelId: segment.options.modelId },
                    zIndex: -1
                })
            ];
        }
    });

    var AreaChart = LineChart.extend({
        createSegment: function(linePoints, currentSeries, seriesIx, prevSegment) {
            var chart = this,
                options = chart.options,
                stackPoints;

            if (options.isStacked && seriesIx > 0) {
                stackPoints = prevSegment.linePoints.slice(0).reverse();
            }

            return new AreaSegment(linePoints, stackPoints, currentSeries, seriesIx);
        }
    });

    var ScatterChart = ChartElement.extend({
        init: function(plotArea, options) {
            var chart = this;

            ChartElement.fn.init.call(chart, options);

            chart.plotArea = plotArea;

            // X and Y axis ranges grouped by name, e.g.:
            // primary: { min: 0, max: 1 }
            chart.xAxisRanges = {};
            chart.yAxisRanges = {};

            chart.points = [];
            chart.seriesPoints = [];

            chart.render();
        },

        options: {
            series: [],
            tooltip: {
                format: "{0}, {1}"
            },
            labels: {
                format: "{0}, {1}"
            }
        },

        render: function() {
            var chart = this;

            chart.traverseDataPoints(proxy(chart.addValue, chart));
        },

        addValue: function(value, fields) {
            var chart = this,
                point,
                x = value.x,
                y = value.y,
                seriesIx = fields.seriesIx,
                seriesPoints = chart.seriesPoints[seriesIx];

            chart.updateRange(value, fields.series);

            if (defined(x) && x !== null && defined(y) && y !== null) {
                point = chart.createPoint(value, fields.series, seriesIx, fields);
                if (point) {
                    extend(point, fields);
                }
            }

            chart.points.push(point);
            seriesPoints.push(point);
        },

        updateRange: function(value, series) {
            var chart = this,
                x = value.x,
                y = value.y,
                xAxisName = series.xAxis || PRIMARY,
                yAxisName = series.yAxis || PRIMARY,
                xAxisRange = chart.xAxisRanges[xAxisName],
                yAxisRange = chart.yAxisRanges[yAxisName];

            if (defined(x) && x !== null) {
                xAxisRange = chart.xAxisRanges[xAxisName] =
                    xAxisRange || { min: MAX_VALUE, max: MIN_VALUE };

                xAxisRange.min = math.min(xAxisRange.min, x);
                xAxisRange.max = math.max(xAxisRange.max, x);
            }

            if (defined(y) && y !== null) {
                yAxisRange = chart.yAxisRanges[yAxisName] =
                    yAxisRange || { min: MAX_VALUE, max: MIN_VALUE };

                yAxisRange.min = math.min(yAxisRange.min, y);
                yAxisRange.max = math.max(yAxisRange.max, y);
            }
        },

        createPoint: function(value, series, seriesIx) {
            var chart = this,
                point;

            point = new LinePoint(value,
                deepExtend({
                    markers: {
                        border: {
                            color: series.color
                        },
                        opacity: series.opacity
                    },
                    tooltip: {
                        format: chart.options.tooltip.format
                    },
                    labels: {
                        format: chart.options.labels.format
                    }
                }, series)
            );

            chart.append(point);

            return point;
        },

        seriesAxes: function(series) {
            var plotArea = this.plotArea,
                xAxis = series.xAxis || PRIMARY,
                yAxis = series.yAxis || PRIMARY;

            return {
                x: plotArea.namedXAxes[xAxis],
                y: plotArea.namedYAxes[yAxis]
            };
        },

        reflow: function(targetBox) {
            var chart = this,
                chartPoints = chart.points,
                pointIx = 0,
                point,
                seriesAxes;

            chart.traverseDataPoints(function(value, fields) {
                point = chartPoints[pointIx++];
                seriesAxes = chart.seriesAxes(fields.series);

                var slotX = seriesAxes.x.getSlot(value.x, value.x),
                    slotY = seriesAxes.y.getSlot(value.y, value.y),
                    pointSlot = new Box2D(slotX.x1, slotY.y1, slotX.x2, slotY.y2);

                if (point) {
                    point.reflow(pointSlot);
                }
            });

            chart.box = targetBox;
        },

        getViewElements: function(view) {
            var chart = this,
                elements = ChartElement.fn.getViewElements.call(chart, view),
                group = view.createGroup({
                    animation: {
                        type: CLIP
                    }
                });

            group.children = elements;
            return [group];
        },

        traverseDataPoints: function(callback) {
            var chart = this,
                options = chart.options,
                series = options.series,
                seriesPoints = chart.seriesPoints,
                valueFields = chart.valueFields(),
                bindableFields = chart.bindableFields(),
                pointIx,
                seriesIx,
                currentSeries,
                currentSeriesPoints,
                pointData,
                value,
                fields;

            for (seriesIx = 0; seriesIx < series.length; seriesIx++) {
                currentSeries = series[seriesIx];

                currentSeriesPoints = seriesPoints[seriesIx];
                if (!currentSeriesPoints) {
                    seriesPoints[seriesIx] = [];
                }

                for (pointIx = 0; pointIx < currentSeries.data.length; pointIx++) {
                    pointData = bindPoint(currentSeries, pointIx, valueFields, bindableFields);
                    value = pointData.value;
                    fields = pointData.fields;

                   callback(value, deepExtend({
                       pointIx: pointIx,
                       series: currentSeries,
                       seriesIx: seriesIx,
                       dataItem: currentSeries.data[pointIx],
                       owner: chart
                   }, fields));
                }
            }
        },

        valueFields: function() {
            return ["x", "y"];
        },

        bindableFields: function() {
            return [];
        },

        formatPointValue: function(point, format) {
            var value = point.value;
            return autoFormat(format, value.x, value.y);
        }
    });

    var ScatterLineChart = ScatterChart.extend({
        render: function() {
            var chart = this;

            ScatterChart.fn.render.call(chart);

            chart.renderSegments();
        }
    });
    deepExtend(ScatterLineChart.fn, LineChartMixin);

    var BubbleChart = ScatterChart.extend({
        options: {
            tooltip: {
                format: "{3}"
            },
            labels: {
                format: "{3}"
            }
        },

        addValue: function(value, fields) {
            var chart = this,
                color,
                series = fields.series,
                negativeValues = series.negativeValues,
                seriesColors = chart.plotArea.options.seriesColors || [],
                visible = true;

            color = fields.color || series.color ||
                seriesColors[fields.pointIx % seriesColors.length];

            if (value.size < 0) {
                color = negativeValues.color || color;
                visible = negativeValues.visible;
            }

            fields.color = color;

            if (visible) {
                ScatterChart.fn.addValue.call(this, value, fields);
            }
        },

        reflow: function(box) {
            var chart = this;

            chart.updateBubblesSize(box);
            ScatterChart.fn.reflow.call(chart, box);
        },

        createPoint: function(value, series, seriesIx, fields) {
            var chart = this,
                point,
                pointsCount = series.data.length,
                delay = fields.pointIx * (INITIAL_ANIMATION_DURATION / pointsCount),
                animationOptions = {
                    delay: delay,
                    duration: INITIAL_ANIMATION_DURATION - delay,
                    type: BUBBLE
                };

            point = new Bubble(value, deepExtend({
                    tooltip: {
                        format: chart.options.tooltip.format
                    },
                    labels: {
                        format: chart.options.labels.format,
                        animation: animationOptions
                    }
                },
                series,
                {
                    color: fields.color,
                    markers: {
                        type: CIRCLE,
                        background: fields.color,
                        border: series.border,
                        opacity: series.opacity,
                        animation: animationOptions
                    }
                })
            );

            chart.append(point);

            return point;
        },

        updateBubblesSize: function(box) {
            var chart = this,
                options = chart.options,
                series = options.series,
                boxSize = math.min(box.width(), box.height()),
                seriesIx,
                pointIx;

            for (seriesIx = 0; seriesIx < series.length; seriesIx++) {
                var currentSeries = series[seriesIx],
                    seriesPoints = chart.seriesPoints[seriesIx],
                    seriesMaxSize = chart.maxSize(seriesPoints),
                    minSize = currentSeries.minSize || math.max(boxSize * 0.02, 10),
                    maxSize = currentSeries.maxSize || boxSize * 0.2,
                    minR = minSize / 2,
                    maxR = maxSize / 2,
                    minArea = math.PI * minR * minR,
                    maxArea = math.PI * maxR * maxR,
                    areaRange = maxArea - minArea,
                    areaRatio = areaRange / seriesMaxSize;

                for (pointIx = 0; pointIx < seriesPoints.length; pointIx++) {
                    var point = seriesPoints[pointIx],
                        area = math.abs(point.value.size) * areaRatio,
                        r = math.sqrt((minArea + area) / math.PI);

                    deepExtend(point.options, {
                        markers: {
                            size: r * 2,
                            zIndex: maxR - r
                        },
                        labels: {
                            zIndex: maxR - r + 1
                        }
                    });
                }
            }
        },

        maxSize: function(seriesPoints) {
            var length = seriesPoints.length,
                max = 0,
                i,
                size;

            for (i = 0; i < length; i++) {
                size = seriesPoints[i].value.size;
                max = math.max(max, math.abs(size));
            }

            return max;
        },

        valueFields: function() {
            return ["x", "y", "size"];
        },

        bindableFields: function() {
            return ["color", "category", "visibleInLegend"];
        },

        getViewElements: function(view) {
            var chart = this;

            return ChartElement.fn.getViewElements.call(chart, view);
        },

        formatPointValue: function(point, format) {
            var value = point.value;
            return autoFormat(format, value.x, value.y, value.size, point.category);
        }
    });

    var PieSegment = ChartElement.extend({
        init: function(value, sector, options) {
            var segment = this;

            segment.value = value;
            segment.sector = sector;
            segment.makeDiscoverable();

            ChartElement.fn.init.call(segment, options);
        },

        options: {
            color: WHITE,
            overlay: {
                gradient: ROUNDED_BEVEL
            },
            border: {
                width: 0.5
            },
            labels: {
                visible: false,
                distance: 35,
                font: DEFAULT_FONT,
                margin: getSpacing(0.5),
                align: CIRCLE,
                zIndex: 1,
                position: OUTSIDE_END
            },
            animation: {
                type: PIE
            },
            highlight: {
                visible: true,
                border: {
                    width: 1
                }
            }
        },

        render: function() {
            var segment = this,
                options = segment.options,
                labels = options.labels,
                labelText = segment.value,
                labelTemplate;

            if (segment._rendered) {
                return;
            } else {
                segment._rendered = true;
            }

            if (labels.template) {
                labelTemplate = template(labels.template);
                labelText = labelTemplate({
                    dataItem: segment.dataItem,
                    category: segment.category,
                    value: segment.value,
                    series: segment.series,
                    percentage: segment.percentage
                });
            } else if (labels.format) {
                labelText = autoFormat(labels.format, labelText);
            }

            if (labels.visible && labelText) {
                segment.label = new TextBox(labelText, deepExtend({}, labels, {
                        id: uniqueId(),
                        align: CENTER,
                        vAlign: "",
                        animation: {
                            type: FADEIN,
                            delay: segment.animationDelay
                        }
                    }));

                segment.append(segment.label);
            }
        },

        reflow: function(targetBox) {
            var segment = this;

            segment.render();

            segment.box = targetBox;

            segment.reflowLabel();
        },

        reflowLabel: function() {
            var segment = this,
                sector = segment.sector.clone(),
                options = segment.options,
                label = segment.label,
                labelsOptions = options.labels,
                labelsDistance = labelsOptions.distance,
                lp,
                x1,
                angle = sector.middle(),
                labelWidth,
                labelHeight;

            if (label) {
                labelHeight = label.box.height();
                labelWidth = label.box.width();
                if (labelsOptions.position == CENTER) {
                    sector.r = math.abs((sector.r - labelHeight) / 2) + labelHeight;
                    lp = sector.point(angle);
                    label.reflow(new Box2D(lp.x, lp.y - labelHeight / 2, lp.x, lp.y));
                } else if (labelsOptions.position == INSIDE_END) {
                    sector.r = sector.r - labelHeight / 2;
                    lp = sector.point(angle);
                    label.reflow(new Box2D(lp.x, lp.y - labelHeight / 2, lp.x, lp.y));
                } else {
                    lp = sector.clone().expand(labelsDistance).point(angle);
                    if (lp.x >= sector.c.x) {
                        x1 = lp.x + labelWidth;
                        label.orientation = RIGHT;
                    } else {
                        x1 = lp.x - labelWidth;
                        label.orientation = LEFT;
                    }
                    label.reflow(new Box2D(x1, lp.y - labelHeight, lp.x, lp.y));
                }
            }
        },

        getViewElements: function(view) {
            var segment = this,
                sector = segment.sector,
                options = segment.options,
                borderOptions = options.border || {},
                border = borderOptions.width > 0 ? {
                    stroke: borderOptions.color,
                    strokeWidth: borderOptions.width,
                    dashType: borderOptions.dashType
                } : {},
                elements = [],
                overlay = options.overlay;

            if (overlay) {
                overlay = deepExtend({}, options.overlay, {
                    r: sector.r,
                    ir: sector.ir,
                    cx: sector.c.x,
                    cy: sector.c.y,
                    bbox: sector.getBBox()
                });
            }

            if (segment.value) {
                elements.push(segment.createSegment(view, sector, deepExtend({
                    id: options.id,
                    fill: options.color,
                    overlay: overlay,
                    fillOpacity: options.opacity,
                    strokeOpacity: options.opacity,
                    animation: deepExtend(options.animation, {
                        delay: segment.animationDelay
                    }),
                    data: { modelId: options.modelId },
                    zIndex: options.zIndex,
                    singleSegment: (segment.options.data || []).length === 1
                }, border)));
            }

            append(elements,
                ChartElement.fn.getViewElements.call(segment, view)
            );

            return elements;
        },

        createSegment: function(view, sector, options) {
            if (options.singleSegment) {
                return view.createCircle(sector.c, sector.r, options);
            } else {
                return view.createSector(sector, options);
            }
        },

        highlightOverlay: function(view, options) {
            var segment = this,
                highlight = segment.options.highlight || {},
                border = highlight.border || {},
                outlineId = segment.options.id + OUTLINE_SUFFIX,
                element;

            options = deepExtend({}, options, { id: outlineId });

            if (segment.value !== 0) {
                element = segment.createSegment(view, segment.sector, deepExtend({}, options, {
                    fill: highlight.color,
                    fillOpacity: highlight.opacity,
                    strokeOpacity: border.opacity,
                    strokeWidth: border.width,
                    stroke: border.color,
                    data: { modelId: segment.options.modelId }
                }));
            }

            return element;
        },

        tooltipAnchor: function(tooltipWidth, tooltipHeight) {
            var point = this,
                sector = point.sector.clone().expand(15),
                w = tooltipWidth / 2,
                h = tooltipHeight / 2,
                midAndle = sector.middle(),
                pointAngle = midAndle * DEGREE,
                lp = sector.point(midAndle),
                cx = lp.x - w,
                cy = lp.y - h,
                sa = math.sin(pointAngle),
                ca = math.cos(pointAngle);

            if (math.abs(sa) < 0.9) {
                cx += w * -ca / math.abs(ca);
            }

            if (math.abs(ca) < 0.9) {
                cy += h * -sa / math.abs(sa);
            }

            return new Point2D(cx, cy);
        },

        formatValue: function(format) {
            var point = this;

            return point.owner.formatPointValue(point, format);
        }
    });
    deepExtend(PieSegment.fn, PointEventsMixin);

    var PieChart = ChartElement.extend({
        init: function(plotArea, options) {
            var chart = this;

            ChartElement.fn.init.call(chart, options);

            chart.plotArea = plotArea;
            chart.segments = [];
            chart.legendItems = [];
            chart.render();
        },

        options: {
            startAngle: 90,
            connectors: {
                width: 1,
                color: "#939393",
                padding: 4
            }
        },

        render: function() {
            var chart = this;

            chart.traverseDataPoints(proxy(chart.addValue, chart));
        },

        traverseDataPoints: function(callback) {
            var chart = this,
                options = chart.options,
                colors = chart.plotArea.options.seriesColors || [],
                startAngle = options.startAngle,
                colorsCount = colors.length,
                series = options.series,
                seriesCount = series.length,
                overlayId = uniqueId(),
                valueFields = chart.valueFields(),
                bindableFields = chart.bindableFields(),
                currentSeries,
                pointData,
                fields,
                seriesIx,
                angle,
                data,
                anglePerValue,
                value,
                explode,
                total,
                currentAngle,
                i;

            for (seriesIx = 0; seriesIx < seriesCount; seriesIx++) {
                currentSeries = series[seriesIx];
                data = currentSeries.data;
                total = chart.pointsTotal(currentSeries);
                anglePerValue = 360 / total;
                currentAngle = startAngle;
                if (seriesIx != seriesCount - 1) {
                    if (currentSeries.labels.position == OUTSIDE_END) {
                        currentSeries.labels.position = CENTER;
                    }
                }

                for (i = 0; i < data.length; i++) {
                    pointData = bindPoint(currentSeries, i, valueFields, bindableFields);
                    value = pointData.value;
                    fields = pointData.fields;
                    angle = round(value * anglePerValue, DEFAULT_PRECISION);
                    explode = data.length != 1 && !!fields.explode;
                    currentSeries.color = fields.color || colors[i % colorsCount];

                    callback(value, new Ring(null, 0, 0, currentAngle, angle), {
                        owner: chart,
                        category: fields.category || "",
                        categoryIx: i,
                        series: currentSeries,
                        seriesIx: seriesIx,
                        dataItem: data[i],
                        percentage: value / total,
                        explode: explode,
                        visibleInLegend: fields.visibleInLegend,
                        overlay: {
                            id: overlayId + seriesIx
                        },
                        zIndex: seriesCount - seriesIx,
                        animationDelay: chart.animationDelay(i, seriesIx, seriesCount)
                    });

                    currentAngle += angle;
                }
            }
        },

        valueFields: function() {
            return ["value"];
        },

        bindableFields: function() {
            return ["category", "color", "explode", "visibleInLegend"];
        },

        addValue: function(value, sector, fields) {
            var chart = this,
                segment;

            chart.createLegendItem(value, fields);

            if (!value) {
                return;
            }
            segment = new PieSegment(value, sector, fields.series);
            segment.options.id = uniqueId();
            extend(segment, fields);
            chart.append(segment);
            chart.segments.push(segment);
        },

        createLegendItem: function(value, point) {
            var chart = this,
                options = (chart.options.legend || {}).labels || {},
                text, labelTemplate;

            if (point && point.visibleInLegend !== false) {
                text = point.category || "";
                if ((options || {}).template) {
                    labelTemplate = template(options.template);
                    text = labelTemplate({
                        text: text,
                        series: point.series,
                        dataItem: point.dataItem,
                        percentage: point.percentage,
                        value: value
                    });
                }

                chart.legendItems.push({
                    name: text,
                    color: point.series.color
                });
            }
        },

        pointsTotal: function(series) {
            var chart = this,
                valueFields = chart.valueFields(),
                data = series.data,
                length = data.length,
                sum = 0,
                i;

            for(i = 0; i < length; i++) {
                sum += bindPoint(series, i, valueFields).value;
            }

            return sum;
        },

        reflow: function(targetBox) {
            var chart = this,
                options = chart.options,
                box = targetBox.clone(),
                space = 5,
                minWidth = math.min(box.width(), box.height()),
                halfMinWidth = minWidth / 2,
                defaultPadding = minWidth - minWidth * 0.85,
                padding = defined(options.padding) ? options.padding : defaultPadding,
                newBox = new Box2D(box.x1, box.y1,
                    box.x1 + minWidth, box.y1 + minWidth),
                newBoxCenter = newBox.center(),
                seriesConfigs = chart.seriesConfigs || [],
                boxCenter = box.center(),
                segments = chart.segments,
                count = segments.length,
                seriesCount = options.series.length,
                leftSideLabels = [],
                rightSideLabels = [],
                seriesConfig,
                seriesIndex,
                label,
                segment,
                sector,
                r, i, c;

            padding = padding > halfMinWidth - space ? halfMinWidth - space : padding,
            newBox.translate(boxCenter.x - newBoxCenter.x, boxCenter.y - newBoxCenter.y);
            r = halfMinWidth - padding;
            c = new Point2D(
                r + newBox.x1 + padding,
                r + newBox.y1 + padding
            );

            for (i = 0; i < count; i++) {
                segment = segments[i];

                sector = segment.sector;
                sector.r = r;
                sector.c = c;
                seriesIndex = segment.seriesIx;
                if (seriesConfigs.length) {
                    seriesConfig = seriesConfigs[seriesIndex];
                    sector.ir = seriesConfig.ir;
                    sector.r = seriesConfig.r;
                }

                if (seriesIndex == seriesCount - 1 && segment.explode) {
                    sector.c = sector.clone().radius(sector.r * 0.15).point(sector.middle());
                }

                segment.reflow(newBox);

                label = segment.label;
                if (label) {
                    if (label.options.position === OUTSIDE_END) {
                        if (seriesIndex == seriesCount - 1) {
                            if (label.orientation === RIGHT) {
                                rightSideLabels.push(label);
                            } else {
                                leftSideLabels.push(label);
                            }
                        }
                    }
                }
            }

            if (leftSideLabels.length > 0) {
                leftSideLabels.sort(chart.labelComparator(true));
                chart.leftLabelsReflow(leftSideLabels);
            }

            if (rightSideLabels.length > 0) {
                rightSideLabels.sort(chart.labelComparator(false));
                chart.rightLabelsReflow(rightSideLabels);
            }

            chart.box = newBox;
        },

        leftLabelsReflow: function(labels) {
            var chart = this,
                distances = chart.distanceBetweenLabels(labels);

            chart.distributeLabels(distances, labels);
        },

        rightLabelsReflow: function(labels) {
            var chart = this,
                distances = chart.distanceBetweenLabels(labels);

            chart.distributeLabels(distances, labels);
        },

        distanceBetweenLabels: function(labels) {
            var chart = this,
                segments = chart.segments,
                segment = segments[segments.length - 1],
                sector = segment.sector,
                firstBox = labels[0].box,
                secondBox,
                count = labels.length - 1,
                distances = [],
                distance,
                lr = sector.r + segment.options.labels.distance,
                i;

            distance = round(firstBox.y1 - (sector.c.y - lr - firstBox.height() - firstBox.height() / 2));
            distances.push(distance);
            for (i = 0; i < count; i++) {
                firstBox = labels[i].box;
                secondBox = labels[i + 1].box;
                distance = round(secondBox.y1 - firstBox.y2);
                distances.push(distance);
            }
            distance = round(sector.c.y + lr - labels[count].box.y2 - labels[count].box.height() / 2);
            distances.push(distance);

            return distances;
        },

        distributeLabels: function(distances, labels) {
            var chart = this,
                count = distances.length,
                remaining,
                left,
                right,
                i;

            for (i = 0; i < count; i++) {
                left = right = i;
                remaining = -distances[i];
                while(remaining > 0 && (left >= 0 || right < count)) {
                    remaining = chart._takeDistance(distances, i, --left, remaining);
                    remaining = chart._takeDistance(distances, i, ++right, remaining);
                }
            }

            chart.reflowLabels(distances, labels);
        },

        _takeDistance: function(distances, anchor, position, amount) {
            if (distances[position] > 0) {
                var available = math.min(distances[position], amount);
                amount -= available;
                distances[position] -= available;
                distances[anchor] += available;
            }

            return amount;
        },

        reflowLabels: function(distances, labels) {
            var chart = this,
                segments = chart.segments,
                segment = segments[segments.length - 1],
                sector = segment.sector,
                labelsCount = labels.length,
                labelOptions = segment.options.labels,
                labelDistance = labelOptions.distance,
                boxY = sector.c.y - (sector.r + labelDistance) - labels[0].box.height(),
                label,
                boxX,
                box,
                i;

            distances[0] += 2;
            for (i = 0; i < labelsCount; i++) {
                label = labels[i];
                boxY += distances[i];
                box = label.box;
                boxX = chart.hAlignLabel(
                    box.x2,
                    sector.clone().expand(labelDistance),
                    boxY,
                    boxY + box.height(),
                    label.orientation == RIGHT);

                if (label.orientation == RIGHT) {
                    if (labelOptions.align !== CIRCLE) {
                        boxX = sector.r + sector.c.x + labelDistance;
                    }
                    label.reflow(new Box2D(boxX + box.width(), boxY,
                        boxX, boxY));
                } else {
                    if (labelOptions.align !== CIRCLE) {
                        boxX = sector.c.x - sector.r - labelDistance;
                    }
                    label.reflow(new Box2D(boxX - box.width(), boxY,
                        boxX, boxY));
                }

                boxY += box.height();
            }
        },

        getViewElements: function(view) {
            var chart = this,
                options = chart.options,
                connectors = options.connectors,
                segments = chart.segments,
                connectorLine,
                sector,
                count = segments.length,
                space = 4,
                angle,
                lines = [],
                points,
                segment,
                seriesIx,
                label,
                i;

            for (i = 0; i < count; i++) {
                segment = segments[i];
                sector = segment.sector;
                angle = sector.middle();
                label = segment.label;
                seriesIx = { seriesId: segment.seriesIx };

                if (label) {
                    points = [];
                    if (label.options.position === OUTSIDE_END && segment.value !== 0) {
                        var box = label.box,
                            centerPoint = sector.c,
                            start = sector.point(angle),
                            middle = new Point2D(box.x1, box.center().y),
                            sr,
                            end,
                            crossing;

                        start = sector.clone().expand(connectors.padding).point(angle);
                        points.push(start);
                        if (label.orientation == RIGHT) {
                            end = new Point2D(box.x1 - connectors.padding, box.center().y);
                            crossing = intersection(centerPoint, start, middle, end);
                            middle = new Point2D(end.x - space, end.y);
                            crossing = crossing || middle;
                            crossing.x = math.min(crossing.x, middle.x);

                            if (chart.pointInCircle(crossing, sector.c, sector.r + space) ||
                                crossing.x < sector.c.x) {
                                sr = sector.c.x + sector.r + space;
                                if (segment.options.labels.align !== COLUMN) {
                                    if (sr < middle.x) {
                                        points.push(new Point2D(sr, start.y));
                                    } else {
                                        points.push(new Point2D(start.x + space * 2, start.y));
                                    }
                                } else {
                                    points.push(new Point2D(sr, start.y));
                                }
                                points.push(new Point2D(middle.x, end.y));
                            } else {
                                crossing.y = end.y;
                                points.push(crossing);
                            }
                        } else {
                            end = new Point2D(box.x2 + connectors.padding, box.center().y);
                            crossing = intersection(centerPoint, start, middle, end);
                            middle = new Point2D(end.x + space, end.y);
                            crossing = crossing || middle;
                            crossing.x = math.max(crossing.x, middle.x);

                            if (chart.pointInCircle(crossing, sector.c, sector.r + space) ||
                                crossing.x > sector.c.x) {
                                sr = sector.c.x - sector.r - space;
                                if (segment.options.labels.align !== COLUMN) {
                                    if (sr > middle.x) {
                                        points.push(new Point2D(sr, start.y));
                                    } else {
                                        points.push(new Point2D(start.x - space * 2, start.y));
                                    }
                                } else {
                                    points.push(new Point2D(sr, start.y));
                                }
                                points.push(new Point2D(middle.x, end.y));
                            } else {
                                crossing.y = end.y;
                                points.push(crossing);
                            }
                        }

                        points.push(end);
                        connectorLine = view.createPolyline(points, false, {
                            id: uniqueId(),
                            stroke: connectors.color,
                            strokeWidth: connectors.width,
                            animation: {
                                type: FADEIN,
                                delay: segment.animationDelay
                            },
                            data: { modelId: segment.options.modelId }
                        });

                        lines.push(connectorLine);
                    }
                }
            }

            append(lines,
                ChartElement.fn.getViewElements.call(chart, view));

            return lines;
        },

        labelComparator: function (reverse) {
            reverse = (reverse) ? -1 : 1;

            return function(a, b) {
                a = (a.parent.sector.middle() + 270) % 360;
                b = (b.parent.sector.middle() + 270) % 360;
                return (a - b) * reverse;
            };
        },

        hAlignLabel: function(originalX, sector, y1, y2, direction) {
            var cx = sector.c.x,
                cy = sector.c.y,
                r = sector.r,
                t = math.min(math.abs(cy - y1), math.abs(cy - y2));

            if (t > r) {
                return originalX;
            } else {
                return cx + math.sqrt((r * r) - (t * t)) * (direction ? 1 : -1);
            }
        },

        pointInCircle: function(point, c, r) {
            return sqr(c.x - point.x) + sqr(c.y - point.y) < sqr(r);
        },

        formatPointValue: function(point, format) {
            return autoFormat(format, point.value);
        },

        animationDelay: function(categoryIndex, seriesIndex, seriesCount) {
            return categoryIndex * PIE_SECTOR_ANIM_DELAY;
        }
    });

    var DonutSegment = PieSegment.extend({
        options: {
            overlay: {
                gradient: ROUNDED_GLASS
            },
            labels: {
                position: CENTER
            },
            animation: {
                type: PIE
            }
        },

        reflowLabel: function() {
            var segment = this,
                sector = segment.sector.clone(),
                options = segment.options,
                label = segment.label,
                labelsOptions = options.labels,
                lp,
                angle = sector.middle(),
                labelHeight;

            if (label) {
                labelHeight = label.box.height();
                if (labelsOptions.position == CENTER) {
                    sector.r -= (sector.r - sector.ir) / 2;
                    lp = sector.point(angle);
                    label.reflow(new Box2D(lp.x, lp.y - labelHeight / 2, lp.x, lp.y));
                } else {
                    PieSegment.fn.reflowLabel.call(segment);
                }
            }
        },

        createSegment: function(view, sector, options) {
            return view.createRing(sector, options);
        }
    });
    deepExtend(DonutSegment.fn, PointEventsMixin);

    var DonutChart = PieChart.extend({
        options: {
            startAngle: 90,
            connectors: {
                width: 1,
                color: "#939393",
                padding: 4
            }
        },

        addValue: function(value, sector, fields) {
            var chart = this,
                segment;

            chart.createLegendItem(value, fields);

            if (!value) {
                return;
            }

            segment = new DonutSegment(value, sector, fields.series);
            segment.options.id = uniqueId();
            extend(segment, fields);
            chart.append(segment);
            chart.segments.push(segment);
        },

        reflow: function(targetBox) {
            var chart = this,
                options = chart.options,
                box = targetBox.clone(),
                space = 5,
                minWidth = math.min(box.width(), box.height()),
                halfMinWidth = minWidth / 2,
                defaultPadding = minWidth - minWidth * 0.85,
                padding = defined(options.padding) ? options.padding : defaultPadding,
                series = options.series,
                currentSeries,
                seriesCount = series.length,
                seriesWithoutSize = 0,
                holeSize,
                totalSize,
                size,
                margin = 0,
                i, r, ir = 0,
                currentSize = 0;

            chart.seriesConfigs = [];
            padding = padding > halfMinWidth - space ? halfMinWidth - space : padding,
            totalSize = halfMinWidth - padding;

            for (i = 0; i < seriesCount; i++) {
                currentSeries = series[i];
                if (i === 0) {
                    if (defined(currentSeries.holeSize)) {
                        holeSize = currentSeries.holeSize;
                        totalSize -= currentSeries.holeSize;
                    }
                }

                if (defined(currentSeries.size)) {
                    totalSize -= currentSeries.size;
                } else {
                    seriesWithoutSize++;
                }

                if (defined(currentSeries.margin) && i != seriesCount - 1) {
                    totalSize -= currentSeries.margin;
                }
            }

            if (!defined(holeSize)) {
                currentSize = (halfMinWidth - padding) / (seriesCount + 0.75);
                holeSize = currentSize * 0.75;
                totalSize -= holeSize;
            }

            ir = holeSize;

            for (i = 0; i < seriesCount; i++) {
                currentSeries = series[i];
                size = defined(currentSeries.size) ? currentSeries.size : totalSize / seriesWithoutSize;
                ir += margin;
                r = ir + size;
                chart.seriesConfigs.push({ ir: ir, r: r });
                margin = currentSeries.margin || 0;
                ir = r;
            }

            PieChart.fn.reflow.call(chart, targetBox);
        },

        animationDelay: function(categoryIndex, seriesIndex, seriesCount) {
            return categoryIndex * DONUT_SECTOR_ANIM_DELAY +
                (INITIAL_ANIMATION_DURATION * (seriesIndex + 1) / (seriesCount + 1));
        }
    });

    var PlotAreaBase = ChartElement.extend({
        init: function(series, options) {
            var plotArea = this;

            ChartElement.fn.init.call(plotArea, options);

            plotArea.series = series;
            plotArea.charts = [];
            plotArea.options.legend.items = [];
            plotArea.axes = [];

            plotArea.options.id = uniqueId();
            plotArea.makeDiscoverable();
            plotArea.render();
        },

        options: {
            series: [],
            plotArea: {
                margin: {}
            },
            background: "",
            border: {
                color: BLACK,
                width: 0
            },
            legend: {}
        },

        appendChart: function(chart) {
            var plotArea = this;

            plotArea.charts.push(chart);
            plotArea.addToLegend(chart);
            plotArea.append(chart);
        },

        addToLegend: function(chart) {
            var series = chart.options.series,
                count = series.length,
                data = [],
                i, currentSeries, text, labelTemplate,
                labels = this.options.legend.labels || {};

            if (chart.legendItems) {
                data = chart.legendItems;
            } else {
                for (i = 0; i < count; i++) {
                    currentSeries = series[i];
                    if (currentSeries.visibleInLegend !== false) {
                        text = currentSeries.name || "";
                        if (labels.template) {
                            labelTemplate = template(labels.template);
                            text = labelTemplate({
                                text: text,
                                series: currentSeries
                            });
                        }
                        data.push({ name: text, color: currentSeries.color });
                    }
                }
            }

            append(this.options.legend.items, data);
        },

        reflow: function(targetBox) {
            var plotArea = this,
                options = plotArea.options.plotArea,
                margin = getSpacing(options.margin);

            plotArea.box = targetBox.clone().unpad(margin);

            if (plotArea.axes.length > 0) {
                plotArea.reflowAxes();
                plotArea.box = plotArea.axisBox();
            }

            plotArea.reflowCharts();
        },

        axisCrossingValues: function(axis, crossingAxes) {
            var options = axis.options,
                crossingValues = [].concat(options.axisCrossingValue),
                valuesToAdd = crossingAxes.length - crossingValues.length,
                defaultValue = crossingValues[0] || 0,
                i;

            for (i = 0; i < valuesToAdd; i++) {
                crossingValues.push(defaultValue);
            }

            return crossingValues;
        },

        alignAxisTo: function(axis, targetAxis, crossingValue, targetCrossingValue) {
            var slot = axis.getSlot(crossingValue, crossingValue),
                slotEdge = axis.options.reverse ? 2 : 1,
                targetSlot = targetAxis.getSlot(targetCrossingValue, targetCrossingValue),
                targetEdge = targetAxis.options.reverse ? 2 : 1;

            axis.reflow(
                axis.box.translate(
                    targetSlot[X + targetEdge] - slot[X + slotEdge],
                    targetSlot[Y + targetEdge] - slot[Y + slotEdge]
                )
            );
        },

        alignAxes: function(xAxes, yAxes) {
            var plotArea = this,
                xAnchor = xAxes[0],
                yAnchor = yAxes[0],
                xAnchorCrossings = plotArea.axisCrossingValues(xAnchor, yAxes),
                yAnchorCrossings = plotArea.axisCrossingValues(yAnchor, xAxes),
                leftAnchor,
                rightAnchor,
                topAnchor,
                bottomAnchor,
                axis,
                i;

            // TODO: Refactor almost-identical loops
            for (i = 0; i < yAxes.length; i++) {
                axis = yAxes[i];
                plotArea.alignAxisTo(axis, xAnchor, yAnchorCrossings[i], xAnchorCrossings[i]);

                if (round(axis.lineBox().x1) === round(xAnchor.lineBox().x1)) {
                    if (leftAnchor) {
                        axis.reflow(axis.box
                            .alignTo(leftAnchor.box, LEFT)
                            .translate(-axis.options.margin, 0)
                        );
                    }

                    leftAnchor = axis;
                }

                if (round(axis.lineBox().x2) === round(xAnchor.lineBox().x2)) {
                    if (!axis._mirrored) {
                        axis.options.labels.mirror = !axis.options.labels.mirror;
                        axis._mirrored = true;
                    }
                    plotArea.alignAxisTo(axis, xAnchor, yAnchorCrossings[i], xAnchorCrossings[i]);

                    if (rightAnchor) {
                        axis.reflow(axis.box
                            .alignTo(rightAnchor.box, RIGHT)
                            .translate(axis.options.margin, 0)
                        );
                    }

                    rightAnchor = axis;
                }

                if (i !== 0) {
                    axis.alignTo(yAnchor);
                }
            }

            for (i = 0; i < xAxes.length; i++) {
                axis = xAxes[i];
                plotArea.alignAxisTo(axis, yAnchor, xAnchorCrossings[i], yAnchorCrossings[i]);

                if (round(axis.lineBox().y1) === round(yAnchor.lineBox().y1)) {
                    if (!axis._mirrored) {
                        axis.options.labels.mirror = !axis.options.labels.mirror;
                        axis._mirrored = true;
                    }
                    plotArea.alignAxisTo(axis, yAnchor, xAnchorCrossings[i], yAnchorCrossings[i]);

                    if (topAnchor) {
                        axis.reflow(axis.box
                            .alignTo(topAnchor.box, TOP)
                            .translate(0, -axis.options.margin)
                        );
                    }

                    topAnchor = axis;
                }

                if (round(axis.lineBox().y2, COORD_PRECISION) === round(yAnchor.lineBox().y2, COORD_PRECISION)) {
                    if (bottomAnchor) {
                        axis.reflow(axis.box
                            .alignTo(bottomAnchor.box, BOTTOM)
                            .translate(0, axis.options.margin)
                        );
                    }

                    bottomAnchor = axis;
                }

                if (i !== 0) {
                    axis.alignTo(xAnchor);
                }
            }
        },

        axisBox: function() {
            var plotArea = this,
                axes = plotArea.axes,
                box = axes[0].box.clone(),
                i,
                length = axes.length;

            for (i = 1; i < length; i++) {
                box.wrap(axes[i].box);
            }

            return box;
        },

        shrinkAxes: function() {
            var plotArea = this,
                box = plotArea.box,
                axisBox = plotArea.axisBox(),
                overflowY = axisBox.height() - box.height(),
                overflowX = axisBox.width() - box.width(),
                axes = plotArea.axes,
                currentAxis,
                vertical,
                i,
                length = axes.length;

            // Shrink all axes so they don't overflow out of the bounding box
            for (i = 0; i < length; i++) {
                currentAxis = axes[i];
                vertical = currentAxis.options.vertical;

                currentAxis.reflow(
                    currentAxis.box.shrink(
                        vertical ? 0 : overflowX,
                        vertical ? overflowY : 0
                    )
                );
            }
        },

        shrinkAdditionalAxes: function(xAxes, yAxes) {
            var plotArea = this,
                axes = plotArea.axes,
                xAnchor = xAxes[0],
                yAnchor = yAxes[0],
                anchorLineBox = xAnchor.lineBox().clone().wrap(yAnchor.lineBox()),
                overflowX,
                overflowY,
                currentAxis,
                vertical,
                lineBox,
                i,
                length = axes.length;

            for (i = 0; i < length; i++) {
                currentAxis = axes[i];
                vertical = currentAxis.options.vertical;
                lineBox = currentAxis.lineBox();

                overflowX = math.max(0, lineBox.x2 - anchorLineBox.x2) +
                            math.max(0, anchorLineBox.x1 - lineBox.x1);

                overflowY = math.max(0, lineBox.y2 - anchorLineBox.y2) +
                            math.max(0, anchorLineBox.y1 - lineBox.y1);

                currentAxis.reflow(
                    currentAxis.box.shrink(
                        vertical ? 0 : overflowX,
                        vertical ? overflowY : 0
                    )
                );
            }
        },

        fitAxes: function() {
            var plotArea = this,
                axes = plotArea.axes,
                box = plotArea.box,
                axisBox = plotArea.axisBox(),
                offsetX = box.x1 - axisBox.x1,
                offsetY = box.y1 - axisBox.y1,
                currentAxis,
                i,
                length = axes.length;

            for (i = 0; i < length; i++) {
                currentAxis = axes[i];

                currentAxis.reflow(
                    currentAxis.box.translate(offsetX, offsetY)
                );
            }
        },

        reflowAxes: function() {
            var plotArea = this,
                axes = plotArea.axes,
                xAxes = grep(axes, (function(axis) { return !axis.options.vertical; })),
                yAxes = grep(axes, (function(axis) { return axis.options.vertical; })),
                i,
                length = axes.length;

            for (i = 0; i < length; i++) {
                axes[i].reflow(plotArea.box);
            }

            plotArea.alignAxes(xAxes, yAxes);
            plotArea.shrinkAdditionalAxes(xAxes, yAxes);
            plotArea.alignAxes(xAxes, yAxes);
            plotArea.shrinkAxes();
            plotArea.alignAxes(xAxes, yAxes);
            plotArea.fitAxes();
        },

        reflowCharts: function() {
            var plotArea = this,
                charts = plotArea.charts,
                count = charts.length,
                box = plotArea.box,
                i;

            for (i = 0; i < count; i++) {
                charts[i].reflow(box);
            }

            plotArea.box = box;
        },

        renderGridLines: function(view, axis, secondaryAxis) {
            var plotArea = this,
                options = axis.options,
                vertical = options.vertical,
                crossingSlot = axis.getSlot(options.axisCrossingValue),
                secAxisPos = round(crossingSlot[vertical ? "y1" : "x1"]),
                lineBox = secondaryAxis.lineBox(),
                lineStart = lineBox[vertical ? "x1" : "y1"],
                lineEnd = lineBox[vertical ? "x2" : "y2" ],
                majorTicks = axis.getMajorTickPositions(),
                gridLines = [],
                gridLine = function (pos, options) {
                    return {
                        pos: pos,
                        options: options
                    };
                };

            if (options.majorGridLines.visible) {
                gridLines = map(majorTicks, function(pos) {
                                return gridLine(pos, options.majorGridLines);
                            });
            }

            if (options.minorGridLines.visible) {
                gridLines = gridLines.concat(
                    map(axis.getMinorTickPositions(), function(pos) {
                        if (options.majorGridLines.visible) {
                            if (!inArray(pos, majorTicks)) {
                                return gridLine(pos, options.minorGridLines);
                            }
                        } else {
                            return gridLine(pos, options.minorGridLines);
                        }
                    }
                ));
            }

            return map(gridLines, function(line) {
                var gridLineOptions = {
                        data: { modelId: plotArea.options.modelId },
                        strokeWidth: line.options.width,
                        stroke: line.options.color,
                        dashType: line.options.dashType
                    },
                    linePos = round(line.pos);

                if (secAxisPos === linePos && secondaryAxis.options.line.visible) {
                    return null;
                }

                if (vertical) {
                    return view.createLine(
                        lineStart, linePos, lineEnd, linePos,
                        gridLineOptions);
                } else {
                    return view.createLine(
                        linePos, lineStart, linePos, lineEnd,
                        gridLineOptions);
                }
            });
        },

        backgroundBox: function() {
            var plotArea = this,
                axes = plotArea.axes,
                axesCount = axes.length,
                lineBox,
                box,
                i,
                j,
                axisA,
                axisB;

            for (i = 0; i < axesCount; i++) {
                axisA = axes[i];

                for (j = 0; j < axesCount; j++) {
                    axisB = axes[j];

                    if (axisA.options.vertical !== axisB.options.vertical) {
                        lineBox = axisA.lineBox().clone().wrap(axisB.lineBox());

                        if (!box) {
                            box = lineBox;
                        } else {
                            box = box.wrap(lineBox);
                        }
                    }
                }
            }

            return box || plotArea.box;
        },

        getViewElements: function(view) {
            var plotArea = this,
                bgBox = plotArea.backgroundBox(),
                options = plotArea.options,
                userOptions = options.plotArea,
                axisY = plotArea.axisY,
                axisX = plotArea.axisX,
                gridLinesY = axisY ? plotArea.renderGridLines(view, axisY, axisX) : [],
                gridLinesX = axisX ? plotArea.renderGridLines(view, axisX, axisY) : [],
                childElements = ChartElement.fn.getViewElements.call(plotArea, view),
                border = userOptions.border || {},
                elements = [
                    view.createRect(bgBox, {
                        fill: userOptions.background,
                        fillOpacity: userOptions.opacity,
                        zIndex: -2,
                        strokeWidth: 0.1
                    }),
                    view.createRect(bgBox, {
                        id: options.id,
                        data: { modelId: options.modelId },
                        stroke: border.width ? border.color : "",
                        strokeWidth: border.width,
                        fill: WHITE,
                        fillOpacity: 0,
                        zIndex: -1,
                        dashType: border.dashType
                    })
                ];

            return [].concat(gridLinesY, gridLinesX, childElements, elements);
        }
    });

    var CategoricalPlotArea = PlotAreaBase.extend({
        init: function(series, options) {
            var plotArea = this,
                axisOptions = deepExtend({}, plotArea.options, options);

            plotArea.namedValueAxes = {};
            plotArea.valueAxisRangeTracker = new AxisGroupRangeTracker(axisOptions.valueAxis);

            if (series.length > 0) {
                plotArea.invertAxes = inArray(
                    series[0].type, [BAR, VERTICAL_LINE, VERTICAL_AREA]
                );
            }

            PlotAreaBase.fn.init.call(plotArea, series, options);
        },

        options: {
            categoryAxis: {
                categories: []
            },
            valueAxis: {}
        },

        render: function() {
            var plotArea = this,
                series = plotArea.series;

            plotArea.createCategoryAxis();

            if (equalsIgnoreCase(plotArea.categoryAxis.options.type, DATE)) {
                plotArea.aggregateDateSeries();
            }

            series = plotArea.series;
            plotArea.createAreaChart(grep(series, function(s) {
                return inArray(s.type, [AREA, VERTICAL_AREA]);
            }));

            plotArea.createBarChart(grep(series, function(s) {
                return inArray(s.type, [BAR, COLUMN]);
            }));

            plotArea.createLineChart(grep(series, function(s) {
                return inArray(s.type, [LINE, VERTICAL_LINE]);
            }));

            plotArea.createValueAxes();
        },

        aggregateDateSeries: function() {
            var plotArea = this,
                series = plotArea.series,
                processedSeries = [],
                categoryAxis = plotArea.categoryAxis,
                categories = categoryAxis.options.categories,
                categoryMap = categoryAxis.categoryMap,
                groupIx,
                categoryIndicies,
                seriesIx,
                currentSeries,
                seriesClone,
                srcData,
                data,
                aggregate,
                srcValues,
                i,
                categoryIx,
                pointData,
                value;

            for (seriesIx = 0; seriesIx < series.length; seriesIx++) {
                currentSeries = series[seriesIx];
                seriesClone = deepExtend({}, currentSeries);
                aggregate = plotArea.seriesAggregate(seriesClone);

                srcData = seriesClone.data;

                seriesClone.data = data = [];

                for (groupIx = 0; groupIx < categories.length; groupIx++) {
                    categoryIndicies = categoryMap[groupIx];
                    srcValues = [];

                    for (i = 0; i < categoryIndicies.length; i++) {
                        categoryIx = categoryIndicies[i];
                        pointData = bindPoint(currentSeries, categoryIx, ["value"]);
                        value = pointData.value;

                        if (defined(value)) {
                            srcValues.push(pointData.value);
                        }
                    }

                    if (srcValues.length > 1) {
                        data[groupIx] = aggregate(srcValues, currentSeries);
                    } else {
                        data[groupIx] = srcData[categoryIndicies[0]];
                    }
                }

                processedSeries.push(seriesClone);
            }

            plotArea.series = processedSeries;
        },

        seriesAggregate: function(series) {
            var aggregate = series.aggregate;
            if (typeof aggregate === STRING) {
                aggregate = Aggregates[aggregate];
            }

            return aggregate || Aggregates.max;
        },

        appendChart: function(chart) {
            var plotArea = this,
                options = plotArea.options,
                series = chart.options.series,
                categories = options.categoryAxis.categories,
                categoriesToAdd = math.max(0, categoriesCount(series) - categories.length);

            append(categories, new Array(categoriesToAdd));

            plotArea.valueAxisRangeTracker.update(chart.valueAxisRanges);

            PlotAreaBase.fn.appendChart.call(plotArea, chart);
        },

        createBarChart: function(series) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                barChart = new BarChart(plotArea, {
                    series: series,
                    invertAxes: plotArea.invertAxes,
                    isStacked: firstSeries.stack && series.length > 1,
                    gap: firstSeries.gap,
                    spacing: firstSeries.spacing
                });

            plotArea.appendChart(barChart);
        },

        createLineChart: function(series) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                lineChart = new LineChart(plotArea, {
                    invertAxes: plotArea.invertAxes,
                    isStacked: firstSeries.stack && series.length > 1,
                    series: series
                });

            plotArea.appendChart(lineChart);
        },

        createAreaChart: function(series) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                areaChart = new AreaChart(plotArea, {
                    invertAxes: plotArea.invertAxes,
                    isStacked: firstSeries.stack && series.length > 1,
                    series: series
                });

            plotArea.appendChart(areaChart);
        },

        createCategoryAxis: function() {
            var plotArea = this,
                options = plotArea.options,
                invertAxes = plotArea.invertAxes,
                categoryAxisOptions = options.categoryAxis,
                categories = categoryAxisOptions.categories,
                categoriesCount = categories.length,
                axisType  = categoryAxisOptions.type || "",
                dateCategory = categories[0] instanceof Date,
                categoryAxis;

            if (equalsIgnoreCase(axisType, DATE) || (!axisType && dateCategory)) {
                categoryAxis = new DateCategoryAxis(deepExtend({
                        vertical: invertAxes
                    },
                    categoryAxisOptions)
                );
            } else {
                categoryAxis = new CategoryAxis(deepExtend({
                        vertical: invertAxes,
                        axisCrossingValue: invertAxes ? categoriesCount : 0
                    },
                    categoryAxisOptions)
                );
            }

            if (invertAxes) {
                plotArea.axisY = categoryAxis;
            } else {
                plotArea.axisX = categoryAxis;
            }

            plotArea.categoryAxis = categoryAxis;
            plotArea.axes.push(categoryAxis);
            plotArea.append(plotArea.categoryAxis);
        },

        createValueAxes: function() {
            var plotArea = this,
                options = plotArea.options,
                range,
                invertAxes = plotArea.invertAxes,
                axis,
                axisName,
                namedValueAxes = plotArea.namedValueAxes,
                valueAxisOptions = [].concat(options.valueAxis),
                primaryValueAxis;

            each(valueAxisOptions, function() {
                axisName = this.name || PRIMARY;
                range = plotArea.valueAxisRangeTracker.query(axisName);

                axis = namedValueAxes[axisName] =
                    new NumericAxis(range.min, range.max, deepExtend({
                        vertical: !invertAxes
                    },
                    this)
                );

                plotArea.axes.push(axis);
                plotArea.append(axis);
            });

            primaryValueAxis = plotArea.getPrimaryValueAxis();

            // TODO: Consider removing axisX and axisY aliases
            if (invertAxes) {
                plotArea.axisX = primaryValueAxis;
            } else {
                plotArea.axisY = primaryValueAxis;
            }
        },

        click: function(chart, e) {
            var plotArea = this,
                coords = chart._eventCoordinates(e),
                point = new Point2D(coords.x, coords.y),
                categoryAxis = plotArea.categoryAxis,
                allAxes = plotArea.axes,
                i,
                length = allAxes.length,
                axis,
                currentValue,
                category = categoryAxis.getCategory(point),
                values = [];

            for (i = 0; i < length; i++) {
                axis = allAxes[i];
                if (axis != categoryAxis) {
                    currentValue = axis.getValue(point);
                    if (currentValue !== null) {
                        values.push(currentValue);
                    }
                }
            }

            if (defined(category) && values.length > 0) {
                chart.trigger(PLOT_AREA_CLICK, {
                    element: $(e.target),
                    category: category,
                    value: singleItemOrArray(values)
                });
            }
        },

        getPrimaryValueAxis: function() {
            var plotArea = this,
                axes = plotArea.axes,
                primaryValueAxis = plotArea.namedValueAxes[PRIMARY],
                axesCount = axes.length,
                axis, i;

            for (i = 0; i < axesCount && !primaryValueAxis; i++) {
                axis = axes[i];

                if (!equalsIgnoreCase(axis.options.type, CATEGORY)) {
                    primaryValueAxis = axis;
                    break;
                }
            }

            return primaryValueAxis;
        }
    });

    var AxisGroupRangeTracker = Class.extend({
        init: function(axisOptions) {
            var tracker = this;

            tracker.axisRanges = {},
            tracker.axisOptions = [].concat(axisOptions),
            tracker.defaultRange = { min: 0, max: 1 };
        },

        update: function(chartAxisRanges) {
            var tracker = this,
                axisRanges = tracker.axisRanges,
                axisOptions = tracker.axisOptions,
                range,
                chartRange,
                i,
                axis,
                axisName,
                length = axisOptions.length;

            if (!chartAxisRanges) {
                return;
            }

            for (i = 0; i < length; i++) {
                axis = axisOptions[i];
                axisName = axis.name || PRIMARY;
                range = axisRanges[axisName];
                chartRange = chartAxisRanges[axisName];
                if (chartRange) {
                    axisRanges[axisName] = range =
                        range || { min: MAX_VALUE, max: MIN_VALUE };

                    range.min = math.min(range.min, chartRange.min);
                    range.max = math.max(range.max, chartRange.max);
                }
            }
        },

        query: function(axisName) {
            var tracker = this;

            return tracker.axisRanges[axisName] || deepExtend({}, tracker.defaultRange);
        }
    });

    var XYPlotArea = PlotAreaBase.extend({
        init: function(series, options) {
            var plotArea = this,
                axisOptions = deepExtend({}, plotArea.options, options);

            plotArea.namedXAxes = {};
            plotArea.namedYAxes = {};

            plotArea.xAxisRangeTracker = new AxisGroupRangeTracker(axisOptions.xAxis);
            plotArea.yAxisRangeTracker = new AxisGroupRangeTracker(axisOptions.yAxis);

            PlotAreaBase.fn.init.call(plotArea, series, options);
        },

        options: {
            xAxis: {},
            yAxis: {}
        },

        render: function() {
            var plotArea = this,
                series = plotArea.series;

            plotArea.createScatterChart(grep(series, function(s) {
                return s.type === SCATTER;
            }));

            plotArea.createScatterLineChart(grep(series, function(s) {
                return s.type === SCATTER_LINE;
            }));

            plotArea.createBubbleChart(grep(series, function(s) {
                return s.type === BUBBLE;
            }));

            plotArea.createAxes();
        },

        appendChart: function(chart) {
            var plotArea = this;

            plotArea.xAxisRangeTracker.update(chart.xAxisRanges);
            plotArea.yAxisRangeTracker.update(chart.yAxisRanges);

            PlotAreaBase.fn.appendChart.call(plotArea, chart);
        },

        createScatterChart: function(series) {
            var plotArea = this;

            if (series.length > 0) {
                plotArea.appendChart(
                    new ScatterChart(plotArea, { series: series })
                );
            }
        },

        createScatterLineChart: function(series) {
            var plotArea = this;

            if (series.length > 0) {
                plotArea.appendChart(
                    new ScatterLineChart(plotArea, { series: series })
                );
            }
        },

        createBubbleChart: function(series) {
            var plotArea = this;

            if (series.length > 0) {
                plotArea.appendChart(
                    new BubbleChart(plotArea, { series: series })
                );
            }
        },

        createXYAxis: function(options, vertical) {
            var plotArea = this,
                axisName = options.name || PRIMARY,
                namedAxes = vertical ? plotArea.namedYAxes : plotArea.namedXAxes,
                rangeTracker = vertical ? plotArea.yAxisRangeTracker : plotArea.xAxisRangeTracker,
                range = rangeTracker.query(axisName),
                axisOptions = deepExtend({}, options, { vertical: vertical }),
                axis,
                seriesIx,
                series = plotArea.series,
                currentSeries,
                firstPointValue,
                dateData;

            for (seriesIx = 0; seriesIx < series.length; seriesIx++) {
                currentSeries = series[seriesIx];
                if (currentSeries[vertical ? "yAxis" : "xAxis"] == axisOptions.name) {
                    firstPointValue = bindPoint(currentSeries, 0, ["x", "y"]).value;
                    dateData = firstPointValue[vertical ? "y" : "x"] instanceof Date;

                    break;
                }
            }

            if (equalsIgnoreCase(axisOptions.type, DATE) || (!axisOptions.type && dateData)) {
                axis = new DateValueAxis(range.min, range.max, axisOptions);
            } else {
                axis = new NumericAxis(range.min, range.max, axisOptions);
            }
            namedAxes[axisName] = axis;
            plotArea.append(axis);
            plotArea.axes.push(axis);
        },

        createAxes: function() {
            var plotArea = this,
                options = plotArea.options,
                xAxesOptions = [].concat(options.xAxis),
                yAxesOptions = [].concat(options.yAxis);

            each(xAxesOptions, function() {
                plotArea.createXYAxis(this, false);
            });

            each(yAxesOptions, function() {
                plotArea.createXYAxis(this, true);
            });

            // TODO: Remove axisX and axisY aliases
            plotArea.axisX = plotArea.namedXAxes.primary || plotArea.namedXAxes[xAxesOptions[0].name];
            plotArea.axisY = plotArea.namedYAxes.primary || plotArea.namedYAxes[yAxesOptions[0].name];
        },

        click: function(chart, e) {
            var plotArea = this,
                coords = chart._eventCoordinates(e),
                point = new Point2D(coords.x, coords.y),
                allAxes = plotArea.axes,
                i,
                length = allAxes.length,
                axis,
                xValues = [],
                yValues = [],
                currentValue,
                values;

            for (i = 0; i < length; i++) {
                axis = allAxes[i];
                values = axis.options.vertical ? yValues : xValues;
                currentValue = axis.getValue(point);
                if (currentValue !== null) {
                    values.push(currentValue);
                }
            }

            if (xValues.length > 0 && yValues.length > 0) {
                chart.trigger(PLOT_AREA_CLICK, {
                    element: $(e.target),
                    x: singleItemOrArray(xValues),
                    y: singleItemOrArray(yValues)
                });
            }
        }
    });

    var PiePlotArea = PlotAreaBase.extend({
        render: function() {
            var plotArea = this,
                series = plotArea.series;

            plotArea.createPieChart(series);
        },

        createPieChart: function(series) {
            var plotArea = this,
                firstSeries = series[0],
                pieChart = new PieChart(plotArea, {
                    series: series,
                    padding: firstSeries.padding,
                    startAngle: firstSeries.startAngle,
                    connectors: firstSeries.connectors,
                    legend: plotArea.options.legend
                });

            plotArea.appendChart(pieChart);
        }
    });

    var DonutPlotArea = PiePlotArea.extend({
        render: function() {
            var plotArea = this,
                series = plotArea.series;

            plotArea.createDonutChart(series);
        },

        createDonutChart: function(series) {
            var plotArea = this,
                firstSeries = series[0],
                donutChart = new DonutChart(plotArea, {
                    series: series,
                    padding: firstSeries.padding,
                    startAngle: firstSeries.startAngle,
                    connectors: firstSeries.connectors,
                    legend: plotArea.options.legend
                });

            plotArea.appendChart(donutChart);
        }
    });

    var PieAnimation = ElementAnimation.extend({
        options: {
            easing: "easeOutElastic",
            duration: INITIAL_ANIMATION_DURATION
        },

        setup: function() {
            var element = this.element,
                sector = element.config,
                startRadius;

            if (element.options.singleSegment) {
                sector = element;
            }

            this.endRadius = sector.r;
            startRadius = this.startRadius = sector.ir || 0;
            sector.r = startRadius;
        },

        step: function(pos) {
            var animation = this,
                element = animation.element,
                endRadius = animation.endRadius,
                sector = element.config,
                startRadius = animation.startRadius;

            if (element.options.singleSegment) {
                sector = element;
            }

            sector.r = interpolateValue(startRadius, endRadius, pos);
        }
    });

    var BubbleAnimation = ElementAnimation.extend({
        options: {
            easing: "easeOutElastic",
            duration: INITIAL_ANIMATION_DURATION
        },

        setup: function() {
            var circle = this.element;

            circle.endRadius = circle.radius;
            circle.radius = 0;
        },

        step: function(pos) {
            var circle = this.element,
                endRadius = circle.endRadius;

            circle.radius = interpolateValue(0, endRadius, pos);
        }
    });

    var BarAnimationDecorator = animationDecorator(BAR, BarAnimation),
        PieAnimationDecorator = animationDecorator(PIE, PieAnimation),
        BubbleAnimationDecorator = animationDecorator(BUBBLE, BubbleAnimation);

    var Highlight = Class.extend({
        init: function(view, viewElement, options) {
            var highlight = this;
            highlight.options = deepExtend({}, highlight.options, options);

            highlight.view = view;
            highlight.viewElement = viewElement;
        },

        options: {
            fill: WHITE,
            fillOpacity: 0.2,
            stroke: WHITE,
            strokeWidth: 1,
            strokeOpacity: 0.2
        },

        show: function(point) {
            var highlight = this,
                view = highlight.view,
                viewElement = highlight.viewElement,
                overlay,
                overlayElement;

            highlight.hide();

            if (point.highlightOverlay) {
                overlay = point.highlightOverlay(view, highlight.options);

                if (overlay) {
                    overlayElement = view.renderElement(overlay);
                    viewElement.appendChild(overlayElement);

                    highlight.overlayElement = overlayElement;
                    highlight.visible = true;
                }
            }

            if (point.toggleHighlight) {
                point.toggleHighlight(view);
                highlight.point = point;
                highlight.visible = true;
            }
        },

        hide: function() {
            var highlight = this,
                overlayElement = highlight.overlayElement;

            if (overlayElement) {
                if (overlayElement.parentNode) {
                    overlayElement.parentNode.removeChild(overlayElement);
                }

                delete highlight.overlayElement;
            }

            if (highlight.point) {
                highlight.point.toggleHighlight(highlight.view);
                delete highlight.point;
            }

            highlight.visible = false;
        }
    });

    var Tooltip = Class.extend({
        init: function(chartElement, options) {
            var tooltip = this;

            tooltip.options = deepExtend({}, tooltip.options, options);
            options = tooltip.options;

            tooltip.chartElement = chartElement;
            tooltip.chartPadding = {
                top: parseInt(chartElement.css("paddingTop"), 10),
                left: parseInt(chartElement.css("paddingLeft"), 10)
            };

            tooltip.template = Tooltip.template;
            if (!tooltip.template) {
                tooltip.template = Tooltip.template = renderTemplate(
                    "<div class='" + CSS_PREFIX + "tooltip' " +
                    "style='display:none; position: absolute; font: #= d.font #;" +
                    "border: #= d.border.width #px solid;" +
                    "opacity: #= d.opacity #; filter: alpha(opacity=#= d.opacity * 100 #);'>" +
                    "</div>"
                );
            }

            tooltip.element = $(tooltip.template(tooltip.options)).appendTo(chartElement);
        },

        options: {
            background: BLACK,
            color: WHITE,
            border: {
                width: 3
            },
            opacity: 1,
            animation: {
                duration: TOOLTIP_ANIMATION_DURATION
            }
        },

        show: function(point) {
            var tooltip = this;

            tooltip.point = point;
            tooltip.showTimeout =
                setTimeout(proxy(tooltip._show, tooltip), TOOLTIP_SHOW_DELAY);
        },

        _show: function() {
            var tooltip = this,
                point = tooltip.point,
                element = tooltip.element,
                options = tooltip.options,
                chartPadding = tooltip.chartPadding,
                anchor,
                tooltipTemplate,
                content,
                tooltipOptions,
                top,
                left;

            if (!point) {
                return;
            }
            content = point.value.toString();

            tooltipOptions = deepExtend({}, tooltip.options, point.options.tooltip);

            if (tooltipOptions.template) {
                tooltipTemplate = template(tooltipOptions.template);
                content = tooltipTemplate({
                    value: point.value,
                    category: point.category,
                    series: point.series,
                    dataItem: point.dataItem,
                    percentage: point.percentage
                });
            } else if (tooltipOptions.format) {
                content = point.formatValue(tooltipOptions.format);
            }

            element.html(content);

            anchor = point.tooltipAnchor(element.outerWidth(), element.outerHeight());
            top = round(anchor.y + chartPadding.top) + "px";
            left = round(anchor.x + chartPadding.left) + "px";

            if (!tooltip.visible) {
                tooltip.element.css({ top: top, left: left });
            }

            tooltip.element
                .css({
                   backgroundColor: tooltipOptions.background,
                   borderColor: tooltipOptions.border.color || point.options.color,
                   color: tooltipOptions.color,
                   opacity: tooltipOptions.opacity,
                   borderWidth: tooltipOptions.border.width
                })
                .stop(true, true)
                .show()
                .animate({
                    left: left,
                    top: top
                }, options.animation.duration);

            tooltip.visible = true;
        },

        hide: function() {
            var tooltip = this;

            clearTimeout(tooltip.showTimeout);

            if (tooltip.visible) {
                tooltip.element.fadeOut();

                tooltip.point = null;
                tooltip.visible = false;
            }
        }
    });

    var Aggregates = {
        max: function(values) {
            return math.max.apply(math, values);
        },

        min: function(values) {
            return math.min.apply(math, values);
        },

        sum: function(values) {
            var i,
                length = values.length,
                sum = 0;

            for (i = 0; i < length; i++) {
                sum += values[i];
            }

            return sum;
        },

        count: function(values) {
            return values.length;
        },

        avg: function(values) {
            return Aggregates.sum(values) / Aggregates.count(values);
        }
    };

    function sparseArrayMin(arr) {
        return sparseArrayLimits(arr).min;
    }

    function sparseArrayMax(arr) {
        return sparseArrayLimits(arr).max;
    }

    function sparseArrayLimits(arr) {
        var min = MAX_VALUE,
            max = MIN_VALUE,
            i,
            length = arr.length,
            n;

        for (i = 0; i < length; i++) {
            n = arr[i];
            if (defined(n)) {
                min = math.min(min, n);
                max = math.max(max, n);
            }
        }

        return { min: min, max: max };
    }

    function intersection(a1, a2, b1, b2) {
        var result,
            ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
            u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y),
            ua;

        if (u_b !== 0) {
            ua = (ua_t / u_b);

            result = new Point2D(
                a1.x + ua * (a2.x - a1.x),
                a1.y + ua * (a2.y - a1.y)
            );
        }

        return result;
    }

    function applySeriesDefaults(options, themeOptions) {
        var series = options.series,
            i,
            seriesLength = series.length,
            seriesType,
            seriesDefaults = options.seriesDefaults,
            commonDefaults = deepExtend({}, options.seriesDefaults),
            themeSeriesDefaults = themeOptions ? deepExtend({}, themeOptions.seriesDefaults) : {},
            commonThemeDefaults = deepExtend({}, themeSeriesDefaults);

        cleanupNestedSeriesDefaults(commonDefaults);
        cleanupNestedSeriesDefaults(commonThemeDefaults);

        for (i = 0; i < seriesLength; i++) {
            seriesType = series[i].type || options.seriesDefaults.type;

            series[i] = deepExtend(
                {},
                commonThemeDefaults,
                themeSeriesDefaults[seriesType],
                { tooltip: options.tooltip },
                commonDefaults,
                seriesDefaults[seriesType],
                series[i]);
        }
    }

    function cleanupNestedSeriesDefaults(seriesDefaults) {
        delete seriesDefaults.bar;
        delete seriesDefaults.column;
        delete seriesDefaults.line;
        delete seriesDefaults.verticalLine;
        delete seriesDefaults.pie;
        delete seriesDefaults.area;
        delete seriesDefaults.verticalArea;
        delete seriesDefaults.scatter;
        delete seriesDefaults.scatterLine;
        delete seriesDefaults.bubble;
    }

    function applySeriesColors(options) {
        var series = options.series,
            i,
            seriesLength = series.length,
            colors = options.seriesColors || [];

        for (i = 0; i < seriesLength; i++) {
            series[i].color = series[i].color || colors[i % colors.length];
        }
    }

    function applyAxisDefaults(options, themeOptions) {
        var themeAxisDefaults = deepExtend({}, (themeOptions || {}).axisDefaults);

        each(["category", "value", "x", "y"], function() {
            var axisName = this + "Axis",
                axes = [].concat(options[axisName]);

            axes = $.map(axes, function(axisOptions) {
                var axisColor = (axisOptions || {}).color;
                return deepExtend({},
                    themeAxisDefaults,
                    themeAxisDefaults[axisName],
                    options.axisDefaults,
                    { line: { color: axisColor }, labels: { color: axisColor }, title: { color: axisColor } },
                    axisOptions
                );
            });

            options[axisName] = axes.length > 1 ? axes : axes[0];
        });
    }

    function applyDefaults(options, themeOptions) {
        applyAxisDefaults(options, themeOptions);
        applySeriesDefaults(options, themeOptions);
    }

    function incrementSlot(slots, index, value) {
        slots[index] = (slots[index] || 0) + value;
    }

    function categoriesCount(series) {
        var seriesCount = series.length,
            categories = 0,
            i;

        for (i = 0; i < seriesCount; i++) {
            categories = math.max(categories, series[i].data.length);
        }

        return categories;
    }

    function sqr(value) {
        return value * value;
    }

    extend($.easing, {
        easeOutElastic: function (n, d, first, diff) {
            var s = 1.70158,
                p = 0,
                a = diff;

            if ( n === 0 ) {
                return first;
            }

            if ( n === 1) {
                return first + diff;
            }

            if (!p) {
                p = 0.5;
            }

            if (a < math.abs(diff)) {
                a=diff;
                s = p / 4;
            } else {
                s = p / (2 * math.PI) * math.asin(diff / a);
            }

            return a * math.pow(2,-10 * n) *
                   math.sin((n * 1 - s) * (1.1 * math.PI) / p) +
                   diff + first;
        }
    });

    function getField(field, row) {
        if (row === null) {
            return null;
        }

        var get = getField.cache[field] =
                getField.cache[field] || getter(field, true);

        return get(row);
    }
    getField.cache = {};

    function toDate(value) {
        if (isArray(value)) {
            return map(value, toDate);
        } else if (value) {
            if (value instanceof Date) {
                return value;
            } else {
                if (typeof value === STRING) {
                    var date = DATE_REGEXP.exec(value);
                    return new Date(date ? parseInt(date[1], 10) : value);
                } else {
                    return new Date(value);
                }
            }
        }
    }

    function toTime(value) {
        if (isArray(value)) {
            return map(value, toTime);
        } else if (value) {
            return toDate(value).getTime();
        }
    }

    function addDuration(date, value, unit) {
        date = toDate(date);

        if (unit === YEARS) {
            return new Date(date.getFullYear() + value, 0, 1);
        } else if (unit === MONTHS) {
            return new Date(date.getFullYear(), date.getMonth() + value, 1);
        } else if (unit === DAYS) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + value);
        } else if (unit === HOURS) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                            date.getHours() + value);
        } else if (unit === MINUTES) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                            date.getHours(), date.getMinutes() + value);
        }

        return date;
    }

    function floorDate(date, unit) {
        date = toDate(date);

        return addDuration(date, 0, unit);
    }

    function ceilDate(date, unit) {
        date = toDate(date);

        if (floorDate(date, unit).getTime() === date.getTime()) {
            return date;
        }

        return addDuration(date, 1, unit);
    }

    function dateDiff(a, b) {
        var diff = a.getTime() - b,
            offsetDiff = a.getTimezoneOffset() - b.getTimezoneOffset();

        return diff - (offsetDiff * TIME_PER_MINUTE);
    }

    function duration(a, b, unit) {
        var diff;

        if (unit === YEARS) {
            diff = b.getFullYear() - a.getFullYear();
        } else if (unit === MONTHS) {
            diff = duration(a, b, YEARS) * 12 + b.getMonth() - a.getMonth();
        } else if (unit === DAYS) {
            diff = math.floor(dateDiff(b, a) / TIME_PER_DAY);
        } else {
            diff = math.floor((b - a) / TIME_PER_UNIT[unit]);
        }

        return diff;
    }

    function bindPoint(series, pointIx, valueFields, pointFields) {
        var pointData = series.data[pointIx],
            fieldData,
            fields = {},
            srcValueFields,
            srcPointFields,
            value,
            result = { value: pointData };

        if (defined(pointData))
        {
            if (isArray(pointData)) {
                fieldData = pointData.slice(valueFields.length);
                value = bindFromArray(pointData, valueFields);
                fields = bindFromArray(fieldData, pointFields);
            } else if (typeof pointData === "object") {
                srcValueFields = mapSeriesFields(series, valueFields);
                srcPointFields = mapSeriesFields(series, pointFields);

                value = bindFromObject(pointData, valueFields, srcValueFields);
                fields = bindFromObject(pointData, pointFields, srcPointFields);
            }
        } else {
            value = bindFromObject({}, valueFields);
        }

        if (defined(value)) {
            if (valueFields.length === 1) {
                value = value[valueFields[0]];
            }

            result.value = value;
        }

        result.fields = fields;

        return result;
    }

    function bindFromArray(array, fields) {
        var value = {},
            i,
            length;

        if (fields) {
            length = math.min(fields.length, array.length);

            for (i = 0; i < length; i++) {
                value[fields[i]] = array[i];
            }
        }

        return value;
    }

    function bindFromObject(object, fields, srcFields) {
        var value = {},
            i,
            length,
            fieldName,
            srcFieldName;

        if (fields) {
            length = fields.length;
            srcFields = srcFields || fields;

            for (i = 0; i < length; i++) {
                fieldName = fields[i];
                srcFieldName = srcFields[i];
                value[fieldName] = getField(srcFieldName, object);
            }
        }

        return value;
    }

    function mapSeriesFields(series, fields) {
        var i,
            length,
            fieldName,
            sourceFields,
            sourceFieldName;

        if (fields) {
            length = fields.length;
            sourceFields = [];

            for (i = 0; i < length; i++) {
                fieldName = fields[i];
                sourceFieldName = fieldName === "value" ? "field" : fieldName + "Field";

                sourceFields.push(series[sourceFieldName] || fieldName);
            }
        }

        return sourceFields;
    }

    function singleItemOrArray(array) {
        return array.length === 1 ? array[0] : array;
    }

    function equalsIgnoreCase(a, b) {
        if (a && b) {
            return a.toLowerCase() === b.toLowerCase();
        }

        return a === b;
    }

    function lastValue(array) {
        var i = array.length,
            value;

        while (i--) {
            value = array[i];
            if (defined(value) && value !== null) {
                return value;
            }
        }
    }

    // Exports ================================================================

    dataviz.ui.plugin(Chart);

    deepExtend(dataviz, {
        Aggregates: Aggregates,
        AreaChart: AreaChart,
        Bar: Bar,
        BarAnimationDecorator: BarAnimationDecorator,
        BarChart: BarChart,
        BarLabel: BarLabel,
        BubbleAnimationDecorator: BubbleAnimationDecorator,
        BubbleChart: BubbleChart,
        CategoricalPlotArea: CategoricalPlotArea,
        CategoryAxis: CategoryAxis,
        ClusterLayout: ClusterLayout,
        DateCategoryAxis: DateCategoryAxis,
        DateValueAxis: DateValueAxis,
        DonutChart: DonutChart,
        DonutPlotArea: DonutPlotArea,
        DonutSegment: DonutSegment,
        Highlight: Highlight,
        Legend: Legend,
        LineChart: LineChart,
        LinePoint: LinePoint,
        PieAnimation: PieAnimation,
        PieAnimationDecorator: PieAnimationDecorator,
        PieChart: PieChart,
        PiePlotArea: PiePlotArea,
        PieSegment: PieSegment,
        ScatterChart: ScatterChart,
        ScatterLineChart: ScatterLineChart,
        ShapeElement: ShapeElement,
        StackLayout: StackLayout,
        Tooltip: Tooltip,
        XYPlotArea: XYPlotArea,

        addDuration: addDuration,
        categoriesCount: categoriesCount,
        ceilDate: ceilDate,
        duration: duration,
        floorDate: floorDate,
        bindPoint: bindPoint,
        toDate: toDate
    });

})(jQuery);
;