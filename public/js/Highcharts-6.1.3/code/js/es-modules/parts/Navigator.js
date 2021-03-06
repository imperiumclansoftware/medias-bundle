/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Color.js';
import './Axis.js';
import './Chart.js';
import './Series.js';
import './Options.js';
import './Scrollbar.js';

var addEvent = H.addEvent,
    Axis = H.Axis,
    Chart = H.Chart,
    color = H.color,
    defaultDataGroupingUnits = H.defaultDataGroupingUnits,
    defaultOptions = H.defaultOptions,
    defined = H.defined,
    destroyObjectProperties = H.destroyObjectProperties,
    each = H.each,
    erase = H.erase,
    error = H.error,
    extend = H.extend,
    grep = H.grep,
    hasTouch = H.hasTouch,
    isArray = H.isArray,
    isNumber = H.isNumber,
    isObject = H.isObject,
    isTouchDevice = H.isTouchDevice,
    merge = H.merge,
    pick = H.pick,
    removeEvent = H.removeEvent,
    Scrollbar = H.Scrollbar,
    Series = H.Series,
    seriesTypes = H.seriesTypes,
    wrap = H.wrap,

    units = [].concat(defaultDataGroupingUnits), // copy
    defaultSeriesType,

    // Finding the min or max of a set of variables where we don't know if they
    // are defined, is a pattern that is repeated several places in Highcharts.
    // Consider making this a global utility method.
    numExt = function (extreme) {
        var numbers = grep(arguments, isNumber);
        if (numbers.length) {
            return Math[extreme].apply(0, numbers);
        }
    };

// add more resolution to units
units[4] = ['day', [1, 2, 3, 4]]; // allow more days
units[5] = ['week', [1, 2, 3]]; // allow more weeks

defaultSeriesType = seriesTypes.areaspline === undefined ?
    'line' :
    'areaspline';

extend(defaultOptions, {

    /**
     * The navigator is a small series below the main series, displaying
     * a view of the entire data set. It provides tools to zoom in and
     * out on parts of the data as well as panning across the dataset.
     *
     * @product highstock
     * @optionparent navigator
     */
    navigator: {

        /**
         * Whether the navigator and scrollbar should adapt to updated data
         * in the base X axis. When loading data async, as in the demo below,
         * this should be `false`. Otherwise new data will trigger navigator
         * redraw, which will cause unwanted looping. In the demo below, the
         * data in the navigator is set only once. On navigating, only the main
         * chart content is updated.
         *
         * @sample {highstock} stock/demo/lazy-loading/
         *         Set to false with async data loading
         *
         * @type       {boolean}
         * @default    true
         * @product    highstock
         * @apioption  navigator.adaptToUpdatedData
         */

        /**
         * An integer identifying the index to use for the base series, or a
         * string representing the id of the series.
         *
         * **Note**: As of Highcharts 5.0, this is now a deprecated option.
         * Prefer [series.showInNavigator](#plotOptions.series.showInNavigator).
         *
         * @see [series.showInNavigator](#plotOptions.series.showInNavigator)
         *
         * @deprecated
         * @type       {*}
         * @default    0
         * @product    highstock
         * @apioption  navigator.baseSeries
         */

        /**
         * Enable or disable the navigator.
         *
         * @sample {highstock} stock/navigator/enabled/ Disable the navigator
         *
         * @type       {boolean}
         * @default    true
         * @product    highstock
         * @apioption  navigator.enabled
         */

        /**
         * When the chart is inverted, whether to draw the navigator on the
         * opposite side.
         *
         * @type       {boolean}
         * @default    false
         * @since      5.0.8
         * @product    highstock
         * @apioption  navigator.opposite
         */

        /**
         * The height of the navigator.
         *
         * @sample {highstock} stock/navigator/height/
         *         A higher navigator
         *
         * @type       {number}
         * @default    40
         * @product    highstock
         * @apioption  navigator.height
         */
        height: 40,

        /**
         * The distance from the nearest element, the X axis or X axis labels.
         *
         * @sample {highstock} stock/navigator/margin/
         *         A margin of 2 draws the navigator closer to the X axis labels
         *
         * @type       {number}
         * @default    25
         * @product    highstock
         * @apioption  navigator.margin
         */
        margin: 25,

        /**
         * Whether the mask should be inside the range marking the zoomed
         * range, or outside. In Highstock 1.x it was always `false`.
         *
         * @sample {highstock} stock/navigator/maskinside-false/
         *         False, mask outside
         *
         * @type       {boolean}
         * @default    true
         * @since      2.0
         * @product    highstock
         * @apioption  navigator.maskInside
         */
        maskInside: true,

        /**
         * Options for the handles for dragging the zoomed area.
         *
         * @sample {highstock} stock/navigator/handles/
         *         Colored handles
         *
         * @type       {*}
         * @product    highstock
         * @apioption  navigator.handles
         */
        handles: {
            /**
             * Width for handles.
             *
             * @sample {highstock} stock/navigator/styled-handles/
             *         Styled handles
             *
             * @type       {number}
             * @default    7
             * @since      6.0.0
             * @product    highstock
             * @apioption  navigator.handles.width
             */
            width: 7,

            /**
             * Height for handles.
             *
             * @sample {highstock} stock/navigator/styled-handles/
             *         Styled handles
             *
             * @type       {number}
             * @default    15
             * @since      6.0.0
             * @product    highstock
             * @apioption  navigator.handles.height
             */
            height: 15,

            /**
             * Array to define shapes of handles. 0-index for left, 1-index for
             * right.
             *
             * Additionally, the URL to a graphic can be given on this form:
             * `url(graphic.png)`. Note that for the image to be applied to
             * exported charts, its URL needs to be accessible by the export
             * server.
             *
             * Custom callbacks for symbol path generation can also be added to
             * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
             * used by its method name, as shown in the demo.
             *
             * @sample {highstock} stock/navigator/styled-handles/
             *         Styled handles
             *
             * @type       {Array<string>}
             * @default    ['navigator-handle', 'navigator-handle']
             * @since      6.0.0
             * @product    highstock
             * @apioption  navigator.handles.symbols
             */
            symbols: ['navigator-handle', 'navigator-handle'],

            /**
             * Allows to enable/disable handles.
             *
             * @type       {boolean}
             * @default    true
             * @since      6.0.0
             * @product    highstock
             * @apioption  navigator.handles.enabled
             */
            enabled: true

            
        },

        

        /**
         * Options for the navigator series. Available options are the same
         * as any series, documented at [plotOptions](#plotOptions.series)
         * and [series](#series).
         *
         * Unless data is explicitly defined on navigator.series, the data
         * is borrowed from the first series in the chart.
         *
         * Default series options for the navigator series are:
         *
         * <pre>series: {
         *     type: 'areaspline',
         *     fillOpacity: 0.05,
         *     dataGrouping: {
         *         smoothed: true
         *     },
         *     lineWidth: 1,
         *     marker: {
         *         enabled: false
         *     }
         * }</pre>
         *
         * @see In styled mode, the navigator series is styled with the
         *      `.highcharts-navigator-series` class.
         *
         * @sample {highstock} stock/navigator/series-data/
         *         Using a separate data set for the navigator
         * @sample {highstock} stock/navigator/series/
         *         A green navigator series
         *
         * @type       {*}
         * @product    highstock
         * @apioption  navigator.series
         */
        series: {

            /**
             * The type of the navigator series. Defaults to `areaspline` if
             * defined, otherwise `line`.
             *
             * @type       {string}
             * @default    areaspline
             * @apioption  navigator.series.type
             */
            type: defaultSeriesType,
            

            /**
             * @ignore-option
             */
            compare: null,

            /**
             * Data grouping options for the navigator series.
             *
             * @type       {*}
             * @extends    plotOptions.series.dataGrouping
             * @apioption  navigator.series.dataGrouping
             */
            dataGrouping: {
                approximation: 'average',
                enabled: true,
                groupPixelWidth: 2,
                smoothed: true,
                units: units
            },

            /**
             * Data label options for the navigator series. Data labels are
             * disabled by default on the navigator series.
             *
             * @type       {*}
             * @extends    plotOptions.series.dataLabels
             * @apioption  navigator.series.dataLabels
             */
            dataLabels: {
                enabled: false,
                zIndex: 2 // #1839
            },

            id: 'highcharts-navigator-series',
            className: 'highcharts-navigator-series',

            /**
             * Line color for the navigator series. Allows setting the color
             * while disallowing the default candlestick setting.
             *
             * @type       {Highcharts.ColorString|null}
             * @default    null
             * @apioption  navigator.series.lineColor
             */
            lineColor: null, // #4602

            marker: {
                enabled: false
            },

            pointRange: 0,
            /**
             * The threshold option. Setting it to 0 will make the default
             * navigator area series draw its area from the 0 value and up.
             *
             * @type       {number|null}
             * @default    null
             * @apioption  navigator.series.threshold
             */
            threshold: null
        },

        /**
         * Options for the navigator X axis. Default series options
         * for the navigator xAxis are:
         *
         * <pre>xAxis: {
         *     tickWidth: 0,
         *     lineWidth: 0,
         *     gridLineWidth: 1,
         *     tickPixelInterval: 200,
         *     labels: {
         *            align: 'left',
         *         style: {
         *             color: '#888'
         *         },
         *         x: 3,
         *         y: -4
         *     }
         * }</pre>
         *
         * @type       {*}
         * @extends    xAxis
         * @excluding  linkedTo,maxZoom,minRange,opposite,range,scrollbar,
         *             showEmpty,maxRange
         * @product    highstock
         * @apioption  navigator.xAxis
         */
        xAxis: {
            /**
             * Additional range on the right side of the xAxis. Works similar to
             * xAxis.maxPadding, but value is set in milliseconds.
             * Can be set for both, main xAxis and navigator's xAxis.
             *
             * @type       {number}
             * @default    0
             * @since      6.0.0
             * @product    highstock
             * @apioption  navigator.xAxis.overscroll
             */
            overscroll: 0,

            className: 'highcharts-navigator-xaxis',
            tickLength: 0,

            

            tickPixelInterval: 200,

            labels: {
                align: 'left',

                

                x: 3,
                y: -4
            },

            crosshair: false
        },

        /**
         * Options for the navigator Y axis. Default series options
         * for the navigator yAxis are:
         *
         * <pre>yAxis: {
         *     gridLineWidth: 0,
         *     startOnTick: false,
         *     endOnTick: false,
         *     minPadding: 0.1,
         *     maxPadding: 0.1,
         *     labels: {
         *         enabled: false
         *     },
         *     title: {
         *         text: null
         *     },
         *     tickWidth: 0
         * }</pre>
         *
         * @type       {*}
         * @extends    yAxis
         * @excluding  height,linkedTo,maxZoom,minRange,ordinal,range,showEmpty,
         *             scrollbar,top,units,maxRange,minLength,maxLength,resize
         * @product    highstock
         * @apioption  navigator.yAxis
         */
        yAxis: {

            className: 'highcharts-navigator-yaxis',

            

            startOnTick: false,
            endOnTick: false,
            minPadding: 0.1,
            maxPadding: 0.1,
            labels: {
                enabled: false
            },
            crosshair: false,
            title: {
                text: null
            },
            tickLength: 0,
            tickWidth: 0
        }
    }
});

/**
 * Draw one of the handles on the side of the zoomed range in the navigator
 *
 * @function Highcharts.Renderer#symbols.navigator-handle
 *
 * @param  {boolean} inverted
 *         flag for chart.inverted
 *
 * @return {Array<number|string>}
 *         Path to be used in a handle
 */
H.Renderer.prototype.symbols['navigator-handle'] = function (
    x,
    y,
    w,
    h,
    options
) {
    var halfWidth = options.width / 2,
        markerPosition = Math.round(halfWidth / 3) + 0.5,
        height = options.height;

    return [
        'M',
        -halfWidth - 1, 0.5,
        'L',
        halfWidth, 0.5,
        'L',
        halfWidth, height + 0.5,
        'L',
        -halfWidth - 1, height + 0.5,
        'L',
        -halfWidth - 1, 0.5,
        'M',
        -markerPosition, 4,
        'L',
        -markerPosition, height - 3,
        'M',
        markerPosition - 1, 4,
        'L',
        markerPosition - 1, height - 3
    ];
};

/**
 * The Navigator class
 *
 * @class Highcharts.Navigator
 *
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
function Navigator(chart) {
    this.init(chart);
}

Navigator.prototype = {
    /**
     * Draw one of the handles on the side of the zoomed range in the navigator
     *
     * @function Highcharts.Navigator#drawHandle
     *
     * @param  {number} x
     *         The x center for the handle
     *
     * @param  {number} index
     *         0 for left and 1 for right
     * @param  {boolean} inverted
     *         flag for chart.inverted
     * @param  {string} verb
     *         use 'animate' or 'attr'
     *
     * @return {void}
     */
    drawHandle: function (x, index, inverted, verb) {
        var navigator = this,
            height = navigator.navigatorOptions.handles.height;

        // Place it
        navigator.handles[index][verb](inverted ? {
            translateX: Math.round(navigator.left + navigator.height / 2),
            translateY: Math.round(
                navigator.top + parseInt(x, 10) + 0.5 - height
            )
        } : {
            translateX: Math.round(navigator.left + parseInt(x, 10)),
            translateY: Math.round(
                navigator.top + navigator.height / 2 - height / 2 - 1
            )
        });
    },

    /**
     * Render outline around the zoomed range
     *
     * @function Highcharts.Navigator#drawOutline
     *
     * @param  {number} zoomedMin
     *         in pixels position where zoomed range starts
     *
     * @param  {number} zoomedMax
     *         in pixels position where zoomed range ends
     *
     * @param  {boolean} inverted
     *         flag if chart is inverted
     *
     * @param  {string} verb
     *         use 'animate' or 'attr'
     *
     * @return {void}
     */
    drawOutline: function (zoomedMin, zoomedMax, inverted, verb) {
        var navigator = this,
            maskInside = navigator.navigatorOptions.maskInside,
            outlineWidth = navigator.outline.strokeWidth(),
            halfOutline = outlineWidth / 2,
            outlineCorrection = (outlineWidth % 2) / 2, // #5800
            outlineHeight = navigator.outlineHeight,
            scrollbarHeight = navigator.scrollbarHeight,
            navigatorSize = navigator.size,
            left = navigator.left - scrollbarHeight,
            navigatorTop = navigator.top,
            verticalMin,
            path;

        if (inverted) {
            left -= halfOutline;
            verticalMin = navigatorTop + zoomedMax + outlineCorrection;
            zoomedMax = navigatorTop + zoomedMin + outlineCorrection;

            path = [
                'M',
                left + outlineHeight,
                navigatorTop - scrollbarHeight - outlineCorrection, // top edge
                'L',
                left + outlineHeight,
                verticalMin, // top right of zoomed range
                'L',
                left,
                verticalMin, // top left of z.r.
                'L',
                left,
                zoomedMax, // bottom left of z.r.
                'L',
                left + outlineHeight,
                zoomedMax, // bottom right of z.r.
                'L',
                left + outlineHeight,
                navigatorTop + navigatorSize + scrollbarHeight // bottom edge
            ].concat(maskInside ? [
                'M',
                left + outlineHeight,
                verticalMin - halfOutline, // upper left of zoomed range
                'L',
                left + outlineHeight,
                zoomedMax + halfOutline // upper right of z.r.
            ] : []);
        } else {
            zoomedMin += left + scrollbarHeight - outlineCorrection;
            zoomedMax += left + scrollbarHeight - outlineCorrection;
            navigatorTop += halfOutline;

            path = [
                'M',
                left,
                navigatorTop, // left
                'L',
                zoomedMin,
                navigatorTop, // upper left of zoomed range
                'L',
                zoomedMin,
                navigatorTop + outlineHeight, // lower left of z.r.
                'L',
                zoomedMax,
                navigatorTop + outlineHeight, // lower right of z.r.
                'L',
                zoomedMax,
                navigatorTop, // upper right of z.r.
                'L',
                left + navigatorSize + scrollbarHeight * 2,
                navigatorTop // right
            ].concat(maskInside ? [
                'M',
                zoomedMin - halfOutline,
                navigatorTop, // upper left of zoomed range
                'L',
                zoomedMax + halfOutline,
                navigatorTop // upper right of z.r.
            ] : []);
        }
        navigator.outline[verb]({
            d: path
        });
    },

    /**
     * Render outline around the zoomed range
     *
     * @function Highcharts.Navigator#drawMasks
     *
     * @param  {number} zoomedMin
     *         in pixels position where zoomed range starts
     *
     * @param  {number} zoomedMax
     *         in pixels position where zoomed range ends
     *
     * @param  {boolean} inverted
     *         flag if chart is inverted
     *
     * @param  {string} verb
     *         use 'animate' or 'attr'
     *
     * @return {void}
     */
    drawMasks: function (zoomedMin, zoomedMax, inverted, verb) {
        var navigator = this,
            left = navigator.left,
            top = navigator.top,
            navigatorHeight = navigator.height,
            height,
            width,
            x,
            y;

        // Determine rectangle position & size
        // According to (non)inverted position:
        if (inverted) {
            x = [left, left, left];
            y = [top, top + zoomedMin, top + zoomedMax];
            width = [navigatorHeight, navigatorHeight, navigatorHeight];
            height = [
                zoomedMin,
                zoomedMax - zoomedMin,
                navigator.size - zoomedMax
            ];
        } else {
            x = [left, left + zoomedMin, left + zoomedMax];
            y = [top, top, top];
            width = [
                zoomedMin,
                zoomedMax - zoomedMin,
                navigator.size - zoomedMax
            ];
            height = [navigatorHeight, navigatorHeight, navigatorHeight];
        }
        each(navigator.shades, function (shade, i) {
            shade[verb]({
                x: x[i],
                y: y[i],
                width: width[i],
                height: height[i]
            });
        });
    },

    /**
     * Generate DOM elements for a navigator:
     * - main navigator group
     * - all shades
     * - outline
     * - handles
     *
     * @function Highcharts.Navigator#renderElements
     *
     * @return {void}
     */
    renderElements: function () {
        var navigator = this,
            navigatorOptions = navigator.navigatorOptions,
            maskInside = navigatorOptions.maskInside,
            chart = navigator.chart,
            inverted = chart.inverted,
            renderer = chart.renderer,
            navigatorGroup;

        // Create the main navigator group
        navigator.navigatorGroup = navigatorGroup = renderer.g('navigator')
            .attr({
                zIndex: 8,
                visibility: 'hidden'
            })
            .add();


        

        // Create masks, each mask will get events and fill:
        each([!maskInside, maskInside, !maskInside], function (hasMask, index) {
            navigator.shades[index] = renderer.rect()
                .addClass('highcharts-navigator-mask' +
                    (index === 1 ? '-inside' : '-outside'))
                
                .add(navigatorGroup);
        });

        // Create the outline:
        navigator.outline = renderer.path()
            .addClass('highcharts-navigator-outline')
            
            .add(navigatorGroup);

        // Create the handlers:
        if (navigatorOptions.handles.enabled) {
            each([0, 1], function (index) {
                navigatorOptions.handles.inverted = chart.inverted;
                navigator.handles[index] = renderer.symbol(
                    navigatorOptions.handles.symbols[index],
                    -navigatorOptions.handles.width / 2 - 1,
                    0,
                    navigatorOptions.handles.width,
                    navigatorOptions.handles.height,
                    navigatorOptions.handles
                );
                // zIndex = 6 for right handle, 7 for left.
                // Can't be 10, because of the tooltip in inverted chart #2908
                navigator.handles[index].attr({ zIndex: 7 - index })
                    .addClass(
                        'highcharts-navigator-handle ' +
                        'highcharts-navigator-handle-' +
                        ['left', 'right'][index]
                    ).add(navigatorGroup);

                
            });
        }
    },

    /**
     * Update navigator
     *
     * @function Highcharts.Navigator#update
     *
     * @param  {Highcharts.NavigatorOptions} options
     *         Options to merge in when updating navigator
     *
     * @return {void}
     */
    update: function (options) {
        // Remove references to old navigator series in base series
        each(this.series || [], function (series) {
            if (series.baseSeries) {
                delete series.baseSeries.navigatorSeries;
            }
        });
        // Destroy and rebuild navigator
        this.destroy();
        var chartOptions = this.chart.options;
        merge(true, chartOptions.navigator, this.options, options);
        this.init(this.chart);
    },

    /**
     * Render the navigator
     *
     * @function Highcharts.Navigator#render
     *
     * @param  {number} min
     *         X axis value minimum
     *
     * @param  {number} max
     *         X axis value maximum
     *
     * @param  {number} pxMin
     *         Pixel value minimum
     *
     * @param  {number} pxMax
     *         Pixel value maximum
     *
     * @return {void}
     */
    render: function (min, max, pxMin, pxMax) {

        var navigator = this,
            chart = navigator.chart,
            navigatorWidth,
            scrollbarLeft,
            scrollbarTop,
            scrollbarHeight = navigator.scrollbarHeight,
            navigatorSize,
            xAxis = navigator.xAxis,
            scrollbarXAxis = xAxis.fake ? chart.xAxis[0] : xAxis,
            navigatorEnabled = navigator.navigatorEnabled,
            zoomedMin,
            zoomedMax,
            rendered = navigator.rendered,
            inverted = chart.inverted,
            verb,
            newMin,
            newMax,
            currentRange,
            minRange = chart.xAxis[0].minRange,
            maxRange = chart.xAxis[0].options.maxRange;

        // Don't redraw while moving the handles (#4703).
        if (this.hasDragged && !defined(pxMin)) {
            return;
        }

        // Don't render the navigator until we have data (#486, #4202, #5172).
        if (!isNumber(min) || !isNumber(max)) {
            // However, if navigator was already rendered, we may need to resize
            // it. For example hidden series, but visible navigator (#6022).
            if (rendered) {
                pxMin = 0;
                pxMax = pick(xAxis.width, scrollbarXAxis.width);
            } else {
                return;
            }
        }

        navigator.left = pick(
            xAxis.left,
            // in case of scrollbar only, without navigator
            chart.plotLeft + scrollbarHeight + (inverted ? chart.plotWidth : 0)
        );

        navigator.size = zoomedMax = navigatorSize = pick(
            xAxis.len,
            (inverted ? chart.plotHeight : chart.plotWidth) -
                2 * scrollbarHeight
        );

        if (inverted) {
            navigatorWidth = scrollbarHeight;
        } else {
            navigatorWidth = navigatorSize + 2 * scrollbarHeight;
        }

        // Get the pixel position of the handles
        pxMin = pick(pxMin, xAxis.toPixels(min, true));
        pxMax = pick(pxMax, xAxis.toPixels(max, true));

        // Verify (#1851, #2238)
        if (!isNumber(pxMin) || Math.abs(pxMin) === Infinity) {
            pxMin = 0;
            pxMax = navigatorWidth;
        }

        // Are we below the minRange? (#2618, #6191)
        newMin = xAxis.toValue(pxMin, true);
        newMax = xAxis.toValue(pxMax, true);
        currentRange = Math.abs(H.correctFloat(newMax - newMin));
        if (currentRange < minRange) {
            if (this.grabbedLeft) {
                pxMin = xAxis.toPixels(newMax - minRange, true);
            } else if (this.grabbedRight) {
                pxMax = xAxis.toPixels(newMin + minRange, true);
            }
        } else if (defined(maxRange) && currentRange > maxRange) {
            /**
             * Maximum range which can be set using the navigator's handles.
             * Opposite of [xAxis.minRange](#xAxis.minRange).
             *
             * @type {Number}
             * @default undefined
             * @product highstock
             * @sample {highstock} stock/navigator/maxrange/
             *         Defined max and min range
             * @since 6.0.0
             * @apioption xAxis.maxRange
             */
            if (this.grabbedLeft) {
                pxMin = xAxis.toPixels(newMax - maxRange, true);
            } else if (this.grabbedRight) {
                pxMax = xAxis.toPixels(newMin + maxRange, true);
            }
        }

        // Handles are allowed to cross, but never exceed the plot area
        navigator.zoomedMax = Math.min(Math.max(pxMin, pxMax, 0), zoomedMax);
        navigator.zoomedMin = Math.min(
            Math.max(
                navigator.fixedWidth ?
                    navigator.zoomedMax - navigator.fixedWidth :
                    Math.min(pxMin, pxMax),
                0
            ),
            zoomedMax
        );

        navigator.range = navigator.zoomedMax - navigator.zoomedMin;

        zoomedMax = Math.round(navigator.zoomedMax);
        zoomedMin = Math.round(navigator.zoomedMin);

        if (navigatorEnabled) {
            navigator.navigatorGroup.attr({
                visibility: 'visible'
            });
            // Place elements
            verb = rendered && !navigator.hasDragged ? 'animate' : 'attr';

            navigator.drawMasks(zoomedMin, zoomedMax, inverted, verb);
            navigator.drawOutline(zoomedMin, zoomedMax, inverted, verb);

            if (navigator.navigatorOptions.handles.enabled) {
                navigator.drawHandle(zoomedMin, 0, inverted, verb);
                navigator.drawHandle(zoomedMax, 1, inverted, verb);
            }
        }

        if (navigator.scrollbar) {
            if (inverted) {
                scrollbarTop = navigator.top - scrollbarHeight;
                scrollbarLeft = navigator.left - scrollbarHeight +
                    (navigatorEnabled || !scrollbarXAxis.opposite ? 0 :
                        // Multiple axes has offsets:
                        (scrollbarXAxis.titleOffset || 0) +
                        // Self margin from the axis.title
                        scrollbarXAxis.axisTitleMargin
                    );
                scrollbarHeight = navigatorSize + 2 * scrollbarHeight;
            } else {
                scrollbarTop = navigator.top +
                    (navigatorEnabled ? navigator.height : -scrollbarHeight);
                scrollbarLeft = navigator.left - scrollbarHeight;
            }
            // Reposition scrollbar
            navigator.scrollbar.position(
                scrollbarLeft,
                scrollbarTop,
                navigatorWidth,
                scrollbarHeight
            );
            // Keep scale 0-1
            navigator.scrollbar.setRange(
                // Use real value, not rounded because range can be very small
                // (#1716)
                navigator.zoomedMin / (navigatorSize || 1),
                navigator.zoomedMax / (navigatorSize || 1)
            );
        }
        navigator.rendered = true;
    },

    /**
     * Set up the mouse and touch events for the navigator
     *
     * @function Highcharts.Navigator#addMouseEvents
     *
     * @return {void}
     */
    addMouseEvents: function () {
        var navigator = this,
            chart = navigator.chart,
            container = chart.container,
            eventsToUnbind = [],
            mouseMoveHandler,
            mouseUpHandler;

        /**
         * Create mouse events' handlers.
         * Make them as separate functions to enable wrapping them:
         */
        navigator.mouseMoveHandler = mouseMoveHandler = function (e) {
            navigator.onMouseMove(e);
        };
        navigator.mouseUpHandler = mouseUpHandler = function (e) {
            navigator.onMouseUp(e);
        };

        // Add shades and handles mousedown events
        eventsToUnbind = navigator.getPartsEvents('mousedown');
        // Add mouse move and mouseup events. These are bind to doc/container,
        // because Navigator.grabbedSomething flags are stored in mousedown
        // events
        eventsToUnbind.push(
            addEvent(container, 'mousemove', mouseMoveHandler),
            addEvent(container.ownerDocument, 'mouseup', mouseUpHandler)
        );

        // Touch events
        if (hasTouch) {
            eventsToUnbind.push(
                addEvent(container, 'touchmove', mouseMoveHandler),
                addEvent(container.ownerDocument, 'touchend', mouseUpHandler)
            );
            eventsToUnbind.concat(navigator.getPartsEvents('touchstart'));
        }

        navigator.eventsToUnbind = eventsToUnbind;

        // Data events
        if (navigator.series && navigator.series[0]) {
            eventsToUnbind.push(
                addEvent(
                    navigator.series[0].xAxis,
                    'foundExtremes',
                    function () {
                        chart.navigator.modifyNavigatorAxisExtremes();
                    }
                )
            );
        }
    },

    /**
     * Generate events for handles and masks
     *
     * @function Highcharts.Navigator#getPartsEvents
     *
     * @param  {string} eventName
     *         Event name handler, 'mousedown' or 'touchstart'
     *
     * @return {Array<*>}
     *         An array of arrays: [DOMElement, eventName, callback].
     */
    getPartsEvents: function (eventName) {
        var navigator = this,
            events = [];
        each(['shades', 'handles'], function (name) {
            each(navigator[name], function (navigatorItem, index) {
                events.push(
                    addEvent(
                        navigatorItem.element,
                        eventName,
                        function (e) {
                            navigator[name + 'Mousedown'](e, index);
                        }
                    )
                );
            });
        });
        return events;
    },

    /**
     * Mousedown on a shaded mask, either:
     * - will be stored for future drag&drop
     * - will directly shift to a new range
     *
     * @function Highcharts.Navigator#shadesMousedown
     *
     * @param  {*} e
     *         Mouse event
     *
     * @param  {number} index
     *         Index of a mask in Navigator.shades array
     *
     * @return {void}
     */
    shadesMousedown: function (e, index) {
        e = this.chart.pointer.normalize(e);

        var navigator = this,
            chart = navigator.chart,
            xAxis = navigator.xAxis,
            zoomedMin = navigator.zoomedMin,
            navigatorPosition = navigator.left,
            navigatorSize = navigator.size,
            range = navigator.range,
            chartX = e.chartX,
            fixedMax,
            fixedMin,
            ext,
            left;

        // For inverted chart, swap some options:
        if (chart.inverted) {
            chartX = e.chartY;
            navigatorPosition = navigator.top;
        }

        if (index === 1) {
            // Store information for drag&drop
            navigator.grabbedCenter = chartX;
            navigator.fixedWidth = range;
            navigator.dragOffset = chartX - zoomedMin;
        } else {
            // Shift the range by clicking on shaded areas
            left = chartX - navigatorPosition - range / 2;
            if (index === 0) {
                left = Math.max(0, left);
            } else if (index === 2 && left + range >= navigatorSize) {
                left = navigatorSize - range;
                if (xAxis.reversed) {
                    // #7713
                    left -= range;
                    fixedMin = navigator.getUnionExtremes().dataMin;
                } else {
                    // #2293, #3543
                    fixedMax = navigator.getUnionExtremes().dataMax;
                }
            }
            if (left !== zoomedMin) { // it has actually moved
                navigator.fixedWidth = range; // #1370

                ext = xAxis.toFixedRange(
                    left,
                    left + range,
                    fixedMin,
                    fixedMax
                );
                if (defined(ext.min)) { // #7411
                    chart.xAxis[0].setExtremes(
                        Math.min(ext.min, ext.max),
                        Math.max(ext.min, ext.max),
                        true,
                        null, // auto animation
                        { trigger: 'navigator' }
                    );
                }
            }
        }
    },

    /**
     * Mousedown on a handle mask.
     * Will store necessary information for drag&drop.
     *
     * @function Highcharts.Navigator#handlesMousedown
     *
     * @param  {*} e
     *         Mouse event
     *
     * @param  {number} index
     *         Index of a handle in Navigator.handles array
     *
     * @return {void}
     */
    handlesMousedown: function (e, index) {
        e = this.chart.pointer.normalize(e);

        var navigator = this,
            chart = navigator.chart,
            baseXAxis = chart.xAxis[0],
            // For reversed axes, min and max are chagned,
            // so the other extreme should be stored
            reverse = (chart.inverted && !baseXAxis.reversed) ||
                (!chart.inverted && baseXAxis.reversed);

        if (index === 0) {
            // Grab the left handle
            navigator.grabbedLeft = true;
            navigator.otherHandlePos = navigator.zoomedMax;
            navigator.fixedExtreme = reverse ? baseXAxis.min : baseXAxis.max;
        } else {
            // Grab the right handle
            navigator.grabbedRight = true;
            navigator.otherHandlePos = navigator.zoomedMin;
            navigator.fixedExtreme = reverse ? baseXAxis.max : baseXAxis.min;
        }

        chart.fixedRange = null;
    },
    /**
     * Mouse move event based on x/y mouse position.
     *
     * @function Highcharts.Navigator#onMouseMove
     *
     * @param  {*} e
     *         Mouse event
     *
     * @return {void}
     */
    onMouseMove: function (e) {
        var navigator = this,
            chart = navigator.chart,
            left = navigator.left,
            navigatorSize = navigator.navigatorSize,
            range = navigator.range,
            dragOffset = navigator.dragOffset,
            inverted = chart.inverted,
            chartX;


        // In iOS, a mousemove event with e.pageX === 0 is fired when holding
        // the finger down in the center of the scrollbar. This should be
        // ignored.
        if (!e.touches || e.touches[0].pageX !== 0) { // #4696

            e = chart.pointer.normalize(e);
            chartX = e.chartX;

            // Swap some options for inverted chart
            if (inverted) {
                left = navigator.top;
                chartX = e.chartY;
            }

            // Drag left handle or top handle
            if (navigator.grabbedLeft) {
                navigator.hasDragged = true;
                navigator.render(
                    0,
                    0,
                    chartX - left,
                    navigator.otherHandlePos
                );
            // Drag right handle or bottom handle
            } else if (navigator.grabbedRight) {
                navigator.hasDragged = true;
                navigator.render(
                    0,
                    0,
                    navigator.otherHandlePos,
                    chartX - left
                );
            // Drag scrollbar or open area in navigator
            } else if (navigator.grabbedCenter) {
                navigator.hasDragged = true;
                if (chartX < dragOffset) { // outside left
                    chartX = dragOffset;
                // outside right
                } else if (chartX > navigatorSize + dragOffset - range) {
                    chartX = navigatorSize + dragOffset - range;
                }

                navigator.render(
                    0,
                    0,
                    chartX - dragOffset,
                    chartX - dragOffset + range
                );
            }
            if (
                navigator.hasDragged &&
                navigator.scrollbar &&
                pick(
                    navigator.scrollbar.options.liveRedraw,

                    // By default, don't run live redraw on VML, on touch
                    // devices or if the chart is in boost.
                    H.svg && !isTouchDevice && !this.chart.isBoosting
                )
            ) {
                e.DOMType = e.type; // DOMType is for IE8
                setTimeout(function () {
                    navigator.onMouseUp(e);
                }, 0);
            }
        }
    },

    /**
     * Mouse up event based on x/y mouse position.
     *
     * @function Highcharts.Navigator#onMouseUp
     *
     * @param  {*} e
     *         Mouse event
     *
     * @return {void}
     */
    onMouseUp: function (e) {
        var navigator = this,
            chart = navigator.chart,
            xAxis = navigator.xAxis,
            reversed = xAxis && xAxis.reversed,
            scrollbar = navigator.scrollbar,
            unionExtremes,
            fixedMin,
            fixedMax,
            ext,
            DOMEvent = e.DOMEvent || e;

        if (
            // MouseUp is called for both, navigator and scrollbar (that order),
            // which causes calling afterSetExtremes twice. Prevent first call
            // by checking if scrollbar is going to set new extremes (#6334)
            (navigator.hasDragged && (!scrollbar || !scrollbar.hasDragged)) ||
            e.trigger === 'scrollbar'
        ) {
            unionExtremes = navigator.getUnionExtremes();

            // When dragging one handle, make sure the other one doesn't change
            if (navigator.zoomedMin === navigator.otherHandlePos) {
                fixedMin = navigator.fixedExtreme;
            } else if (navigator.zoomedMax === navigator.otherHandlePos) {
                fixedMax = navigator.fixedExtreme;
            }
            // Snap to right edge (#4076)
            if (navigator.zoomedMax === navigator.size) {
                fixedMax = reversed ?
                    unionExtremes.dataMin : unionExtremes.dataMax;
            }

            // Snap to left edge (#7576)
            if (navigator.zoomedMin === 0) {
                fixedMin = reversed ?
                    unionExtremes.dataMax : unionExtremes.dataMin;
            }

            ext = xAxis.toFixedRange(
                navigator.zoomedMin,
                navigator.zoomedMax,
                fixedMin,
                fixedMax
            );

            if (defined(ext.min)) {
                chart.xAxis[0].setExtremes(
                    Math.min(ext.min, ext.max),
                    Math.max(ext.min, ext.max),
                    true,
                    // Run animation when clicking buttons, scrollbar track etc,
                    // but not when dragging handles or scrollbar
                    navigator.hasDragged ? false : null,
                    {
                        trigger: 'navigator',
                        triggerOp: 'navigator-drag',
                        DOMEvent: DOMEvent // #1838
                    }
                );
            }
        }

        if (e.DOMType !== 'mousemove') {
            navigator.grabbedLeft = navigator.grabbedRight =
                navigator.grabbedCenter = navigator.fixedWidth =
                navigator.fixedExtreme = navigator.otherHandlePos =
                navigator.hasDragged = navigator.dragOffset = null;
        }
    },

    /**
     * Removes the event handlers attached previously with addEvents.
     *
     * @function Highcharts.Navigator#removeEvents
     *
     * @return {void}
     */
    removeEvents: function () {
        if (this.eventsToUnbind) {
            each(this.eventsToUnbind, function (unbind) {
                unbind();
            });
            this.eventsToUnbind = undefined;
        }
        this.removeBaseSeriesEvents();
    },

    /**
     * Remove data events.
     *
     * @function Highcharts.Navigator#removeBaseSeriesEvents
     *
     * @return {void}
     */
    removeBaseSeriesEvents: function () {
        var baseSeries = this.baseSeries || [];
        if (this.navigatorEnabled && baseSeries[0]) {
            if (this.navigatorOptions.adaptToUpdatedData !== false) {
                each(baseSeries, function (series) {
                    removeEvent(series, 'updatedData', this.updatedDataHandler);
                }, this);
            }

            // We only listen for extremes-events on the first baseSeries
            if (baseSeries[0].xAxis) {
                removeEvent(
                    baseSeries[0].xAxis,
                    'foundExtremes',
                    this.modifyBaseAxisExtremes
                );
            }
        }
    },

    /**
     * Initiate the Navigator object
     *
     * @function Highcharts.Navigator#init
     *
     * @param  {Highcharts.Chart} chart
     *
     * @return {void}
     */
    init: function (chart) {
        var chartOptions = chart.options,
            navigatorOptions = chartOptions.navigator,
            navigatorEnabled = navigatorOptions.enabled,
            scrollbarOptions = chartOptions.scrollbar,
            scrollbarEnabled = scrollbarOptions.enabled,
            height = navigatorEnabled ? navigatorOptions.height : 0,
            scrollbarHeight = scrollbarEnabled ? scrollbarOptions.height : 0;

        this.handles = [];
        this.shades = [];

        this.chart = chart;
        this.setBaseSeries();

        this.height = height;
        this.scrollbarHeight = scrollbarHeight;
        this.scrollbarEnabled = scrollbarEnabled;
        this.navigatorEnabled = navigatorEnabled;
        this.navigatorOptions = navigatorOptions;
        this.scrollbarOptions = scrollbarOptions;
        this.outlineHeight = height + scrollbarHeight;

        this.opposite = pick(
            navigatorOptions.opposite,
            !navigatorEnabled && chart.inverted
        ); // #6262

        var navigator = this,
            baseSeries = navigator.baseSeries,
            xAxisIndex = chart.xAxis.length,
            yAxisIndex = chart.yAxis.length,
            baseXaxis = baseSeries && baseSeries[0] && baseSeries[0].xAxis ||
                chart.xAxis[0] || { options: {} };

        chart.iICSrtyBox = true;

        if (navigator.navigatorEnabled) {
            // an x axis is required for scrollbar also
            navigator.xAxis = new Axis(chart, merge({
                // inherit base xAxis' break and ordinal options
                breaks: baseXaxis.options.breaks,
                ordinal: baseXaxis.options.ordinal
            }, navigatorOptions.xAxis, {
                id: 'navigator-x-axis',
                yAxis: 'navigator-y-axis',
                isX: true,
                type: 'datetime',
                index: xAxisIndex,
                isInternal: true,
                offset: 0,
                keepOrdinalPadding: true, // #2436
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                zoomEnabled: false
            }, chart.inverted ? {
                offsets: [scrollbarHeight, 0, -scrollbarHeight, 0],
                width: height
            } : {
                offsets: [0, -scrollbarHeight, 0, scrollbarHeight],
                height: height
            }));

            navigator.yAxis = new Axis(chart, merge(navigatorOptions.yAxis, {
                id: 'navigator-y-axis',
                alignTicks: false,
                offset: 0,
                index: yAxisIndex,
                isInternal: true,
                zoomEnabled: false
            }, chart.inverted ? {
                width: height
            } : {
                height: height
            }));

            // If we have a base series, initialize the navigator series
            if (baseSeries || navigatorOptions.series.data) {
                navigator.updateNavigatorSeries(false);

            // If not, set up an event to listen for added series
            } else if (chart.series.length === 0) {

                navigator.unbindRedraw = addEvent(
                    chart,
                    'beforeRedraw',
                    function () {
                        // We've got one, now add it as base
                        if (chart.series.length > 0 && !navigator.series) {
                            navigator.setBaseSeries();
                            navigator.unbindRedraw(); // reset
                        }
                    }
                );
            }

            // Render items, so we can bind events to them:
            navigator.renderElements();
            // Add mouse events
            navigator.addMouseEvents();

        // in case of scrollbar only, fake an x axis to get translation
        } else {
            navigator.xAxis = {
                translate: function (value, reverse) {
                    var axis = chart.xAxis[0],
                        ext = axis.getExtremes(),
                        scrollTrackWidth = axis.len - 2 * scrollbarHeight,
                        min = numExt('min', axis.options.min, ext.dataMin),
                        valueRange = numExt(
                            'max',
                            axis.options.max,
                            ext.dataMax
                        ) - min;

                    return reverse ?
                        // from pixel to value
                        (value * valueRange / scrollTrackWidth) + min :
                        // from value to pixel
                        scrollTrackWidth * (value - min) / valueRange;
                },
                toPixels: function (value) {
                    return this.translate(value);
                },
                toValue: function (value) {
                    return this.translate(value, true);
                },
                toFixedRange: Axis.prototype.toFixedRange,
                fake: true
            };
        }


        // Initialize the scrollbar
        if (chart.options.scrollbar.enabled) {
            chart.scrollbar = navigator.scrollbar = new Scrollbar(
                chart.renderer,
                merge(chart.options.scrollbar, {
                    margin: navigator.navigatorEnabled ? 0 : 10,
                    vertical: chart.inverted
                }),
                chart
            );
            addEvent(navigator.scrollbar, 'changed', function (e) {
                var range = navigator.size,
                    to = range * this.to,
                    from = range * this.from;

                navigator.hasDragged = navigator.scrollbar.hasDragged;
                navigator.render(0, 0, from, to);

                if (
                    chart.options.scrollbar.liveRedraw ||
                    (
                        e.DOMType !== 'mousemove' &&
                        e.DOMType !== 'touchmove'
                    )
                ) {
                    setTimeout(function () {
                        navigator.onMouseUp(e);
                    });
                }
            });
        }

        // Add data events
        navigator.addBaseSeriesEvents();
        // Add redraw events
        navigator.addChartEvents();
    },

    /**
     * Get the union data extremes of the chart - the outer data extremes of the
     * base X axis and the navigator axis.
     *
     * @function Highcharts.Navigator#getUnionExtremes
     *
     * @param  {boolean} returnFalseOnNoBaseSeries
     *         as the param says.
     *
     * @return {*}
     */
    getUnionExtremes: function (returnFalseOnNoBaseSeries) {
        var baseAxis = this.chart.xAxis[0],
            navAxis = this.xAxis,
            navAxisOptions = navAxis.options,
            baseAxisOptions = baseAxis.options,
            ret;

        if (!returnFalseOnNoBaseSeries || baseAxis.dataMin !== null) {
            ret = {
                dataMin: pick( // #4053
                    navAxisOptions && navAxisOptions.min,
                    numExt(
                        'min',
                        baseAxisOptions.min,
                        baseAxis.dataMin,
                        navAxis.dataMin,
                        navAxis.min
                    )
                ),
                dataMax: pick(
                    navAxisOptions && navAxisOptions.max,
                    numExt(
                        'max',
                        baseAxisOptions.max,
                        baseAxis.dataMax,
                        navAxis.dataMax,
                        navAxis.max
                    )
                )
            };
        }
        return ret;
    },

    /**
     * Set the base series and update the navigator series from this. With a bit
     * of modification we should be able to make this an API method to be called
     * from the outside
     *
     * @function Highcharts.Navigator#setBaseSeries
     *
     * @param  {*} baseSeriesOptions
     *         Additional series options for a navigator
     *
     * @param  {boolean} [redraw]
     *         Whether to redraw after update.
     *
     * @return {void}
     */
    setBaseSeries: function (baseSeriesOptions, redraw) {
        var chart = this.chart,
            baseSeries = this.baseSeries = [];

        baseSeriesOptions = (
            baseSeriesOptions ||
            chart.options && chart.options.navigator.baseSeries ||
            0
        );

        // Iterate through series and add the ones that should be shown in
        // navigator.
        each(chart.series || [], function (series, i) {
            if (
                // Don't include existing nav series
                !series.options.isInternal &&
                (
                    series.options.showInNavigator ||
                    (
                        i === baseSeriesOptions ||
                        series.options.id === baseSeriesOptions
                    ) &&
                    series.options.showInNavigator !== false
                )
            ) {
                baseSeries.push(series);
            }
        });

        // When run after render, this.xAxis already exists
        if (this.xAxis && !this.xAxis.fake) {
            this.updateNavigatorSeries(true, redraw);
        }
    },

    /**
     * Update series in the navigator from baseSeries, adding new if does not
     * exist.
     *
     * @function Highcharts.Navigator.updateNavigatorSeries
     *
     * @param  {boolean} addEvents
     *
     * @param  {boolean} redraw
     *
     * @return {void}
     */
    updateNavigatorSeries: function (addEvents, redraw) {
        var navigator = this,
            chart = navigator.chart,
            baseSeries = navigator.baseSeries,
            baseOptions,
            mergedNavSeriesOptions,
            chartNavigatorSeriesOptions = navigator.navigatorOptions.series,
            baseNavigatorOptions,
            navSeriesMixin = {
                enableMouseTracking: false,
                index: null, // #6162
                linkedTo: null, // #6734
                group: 'nav', // for columns
                padXAxis: false,
                xAxis: 'navigator-x-axis',
                yAxis: 'navigator-y-axis',
                showInLegend: false,
                stacking: false, // #4823
                isInternal: true
            },
            // Remove navigator series that are no longer in the baseSeries
            navigatorSeries = navigator.series = H.grep(
                navigator.series || [], function (navSeries) {
                    var base = navSeries.baseSeries;
                    if (H.inArray(base, baseSeries) < 0) { // Not in array
                        // If there is still a base series connected to this
                        // series, remove event handler and reference.
                        if (base) {
                            removeEvent(
                                base,
                                'updatedData',
                                navigator.updatedDataHandler
                            );
                            delete base.navigatorSeries;
                        }
                        // Kill the nav series. It may already have been
                        // destroyed (#8715).
                        if (navSeries.chart) {
                            navSeries.destroy();
                        }
                        return false;
                    }
                    return true;
                }
            );

        // Go through each base series and merge the options to create new
        // series
        if (baseSeries && baseSeries.length) {
            each(baseSeries, function eachBaseSeries(base) {
                var linkedNavSeries = base.navigatorSeries,
                    userNavOptions = extend(
                        // Grab color and visibility from base as default
                        {
                            color: base.color,
                            visible: base.visible
                        },
                        !isArray(chartNavigatorSeriesOptions) ?
                            chartNavigatorSeriesOptions :
                            defaultOptions.navigator.series
                    );

                // Don't update if the series exists in nav and we have disabled
                // adaptToUpdatedData.
                if (
                    linkedNavSeries &&
                    navigator.navigatorOptions.adaptToUpdatedData === false
                ) {
                    return;
                }

                navSeriesMixin.name = 'Navigator ' + baseSeries.length;

                baseOptions = base.options || {};
                baseNavigatorOptions = baseOptions.navigatorOptions || {};
                mergedNavSeriesOptions = merge(
                    baseOptions,
                    navSeriesMixin,
                    userNavOptions,
                    baseNavigatorOptions
                );

                // Merge data separately. Do a slice to avoid mutating the
                // navigator options from base series (#4923).
                var navigatorSeriesData =
                    baseNavigatorOptions.data || userNavOptions.data;
                navigator.hasNavigatorData =
                    navigator.hasNavigatorData || !!navigatorSeriesData;
                mergedNavSeriesOptions.data =
                    navigatorSeriesData ||
                    baseOptions.data && baseOptions.data.slice(0);

                // Update or add the series
                if (linkedNavSeries && linkedNavSeries.options) {
                    linkedNavSeries.update(mergedNavSeriesOptions, redraw);
                } else {
                    base.navigatorSeries = chart.initSeries(
                        mergedNavSeriesOptions
                    );
                    base.navigatorSeries.baseSeries = base; // Store ref
                    navigatorSeries.push(base.navigatorSeries);
                }
            });
        }

        // If user has defined data (and no base series) or explicitly defined
        // navigator.series as an array, we create these series on top of any
        // base series.
        if (
            chartNavigatorSeriesOptions.data &&
            !(baseSeries && baseSeries.length) ||
            isArray(chartNavigatorSeriesOptions)
        ) {
            navigator.hasNavigatorData = false;
            // Allow navigator.series to be an array
            chartNavigatorSeriesOptions = H.splat(chartNavigatorSeriesOptions);
            each(chartNavigatorSeriesOptions, function (userSeriesOptions, i) {
                navSeriesMixin.name =
                    'Navigator ' + (navigatorSeries.length + 1);
                mergedNavSeriesOptions = merge(
                    defaultOptions.navigator.series,
                    {
                        // Since we don't have a base series to pull color from,
                        // try to fake it by using color from series with same
                        // index. Otherwise pull from the colors array. We need
                        // an explicit color as otherwise updates will increment
                        // color counter and we'll get a new color for each
                        // update of the nav series.
                        color: chart.series[i] &&
                            !chart.series[i].options.isInternal &&
                            chart.series[i].color ||
                            chart.options.colors[i] ||
                            chart.options.colors[0]
                    },
                    navSeriesMixin,
                    userSeriesOptions
                );
                mergedNavSeriesOptions.data = userSeriesOptions.data;
                if (mergedNavSeriesOptions.data) {
                    navigator.hasNavigatorData = true;
                    navigatorSeries.push(
                        chart.initSeries(mergedNavSeriesOptions)
                    );
                }
            });
        }

        if (addEvents) {
            this.addBaseSeriesEvents();
        }
    },

    /**
     * Add data events.
     * For example when main series is updated we need to recalculate extremes
     *
     * @function Highcharts.Navigator#addBaseSeriesEvent
     *
     * @return {void}
     */
    addBaseSeriesEvents: function () {
        var navigator = this,
            baseSeries = navigator.baseSeries || [];

        // Bind modified extremes event to first base's xAxis only.
        // In event of > 1 base-xAxes, the navigator will ignore those.
        // Adding this multiple times to the same axis is no problem, as
        // duplicates should be discarded by the browser.
        if (baseSeries[0] && baseSeries[0].xAxis) {
            addEvent(
                baseSeries[0].xAxis,
                'foundExtremes',
                this.modifyBaseAxisExtremes
            );
        }

        each(baseSeries, function (base) {
            // Link base series show/hide to navigator series visibility
            addEvent(base, 'show', function () {
                if (this.navigatorSeries) {
                    this.navigatorSeries.setVisible(true, false);
                }
            });
            addEvent(base, 'hide', function () {
                if (this.navigatorSeries) {
                    this.navigatorSeries.setVisible(false, false);
                }
            });

            // Respond to updated data in the base series, unless explicitily
            // not adapting to data changes.
            if (this.navigatorOptions.adaptToUpdatedData !== false) {
                if (base.xAxis) {
                    addEvent(base, 'updatedData', this.updatedDataHandler);
                }
            }

            // Handle series removal
            addEvent(base, 'remove', function () {
                if (this.navigatorSeries) {
                    erase(navigator.series, this.navigatorSeries);
                    if (defined(this.navigatorSeries.options)) {
                        this.navigatorSeries.remove(false);
                    }
                    delete this.navigatorSeries;
                }
            });
        }, this);
    },

    /**
     * Set the navigator x axis extremes to reflect the total. The navigator
     * extremes should always be the extremes of the union of all series in the
     * chart as well as the navigator series.
     *
     * @function Highcharts.Navigator#modifyNavigatorAxisExtremes
     *
     * @return {void}
     */
    modifyNavigatorAxisExtremes: function () {
        var xAxis = this.xAxis,
            unionExtremes;

        if (xAxis.getExtremes) {
            unionExtremes = this.getUnionExtremes(true);
            if (
                unionExtremes &&
                (
                    unionExtremes.dataMin !== xAxis.min ||
                    unionExtremes.dataMax !== xAxis.max
                )
            ) {
                xAxis.min = unionExtremes.dataMin;
                xAxis.max = unionExtremes.dataMax;
            }
        }
    },

    /**
     * Hook to modify the base axis extremes with information from the Navigator
     *
     * @function Highcharts.Navigator#modifyBaseAxisExtremes
     *
     * @return {void}
     */
    modifyBaseAxisExtremes: function () {
        var baseXAxis = this,
            navigator = baseXAxis.chart.navigator,
            baseExtremes = baseXAxis.getExtremes(),
            baseMin = baseExtremes.min,
            baseMax = baseExtremes.max,
            baseDataMin = baseExtremes.dataMin,
            baseDataMax = baseExtremes.dataMax,
            range = baseMax - baseMin,
            stickToMin = navigator.stickToMin,
            stickToMax = navigator.stickToMax,
            overscroll = pick(baseXAxis.options.overscroll, 0),
            newMax,
            newMin,
            navigatorSeries = navigator.series && navigator.series[0],
            hasSetExtremes = !!baseXAxis.setExtremes,

            // When the extremes have been set by range selector button, don't
            // stick to min or max. The range selector buttons will handle the
            // extremes. (#5489)
            unmutable = baseXAxis.eventArgs &&
                baseXAxis.eventArgs.trigger === 'rangeSelectorButton';

        if (!unmutable) {

            // If the zoomed range is already at the min, move it to the right
            // as new data comes in
            if (stickToMin) {
                newMin = baseDataMin;
                newMax = newMin + range;
            }

            // If the zoomed range is already at the max, move it to the right
            // as new data comes in
            if (stickToMax) {
                newMax = baseDataMax + overscroll;

                // if stickToMin is true, the new min value is set above
                if (!stickToMin) {
                    newMin = Math.max(
                        newMax - range,
                        navigatorSeries && navigatorSeries.xData ?
                            navigatorSeries.xData[0] : -Number.MAX_VALUE
                    );
                }
            }

            // Update the extremes
            if (hasSetExtremes && (stickToMin || stickToMax)) {
                if (isNumber(newMin)) {
                    baseXAxis.min = baseXAxis.userMin = newMin;
                    baseXAxis.max = baseXAxis.userMax = newMax;
                }
            }
        }

        // Reset
        navigator.stickToMin = navigator.stickToMax = null;
    },

    /**
     * Handler for updated data on the base series. When data is modified, the
     * navigator series must reflect it. This is called from the Chart.redraw
     * function before axis and series extremes are computed.
     *
     * @function Highcharts.Navigator#updateDataHandler
     *
     * @return {void}
     */
    updatedDataHandler: function () {
        var navigator = this.chart.navigator,
            baseSeries = this,
            navigatorSeries = this.navigatorSeries;

        // If the scrollbar is scrolled all the way to the right, keep right as
        // new data  comes in.
        navigator.stickToMax = navigator.xAxis.reversed ?
            Math.round(navigator.zoomedMin) === 0 :
            Math.round(navigator.zoomedMax) >= Math.round(navigator.size);

        // Detect whether the zoomed area should stick to the minimum or
        // maximum. If the current axis minimum falls outside the new updated
        // dataset, we must adjust.
        navigator.stickToMin = isNumber(baseSeries.xAxis.min) &&
            (baseSeries.xAxis.min <= baseSeries.xData[0]) &&
            (!this.chart.fixedRange || !navigator.stickToMax);

        // Set the navigator series data to the new data of the base series
        if (navigatorSeries && !navigator.hasNavigatorData) {
            navigatorSeries.options.pointStart = baseSeries.xData[0];
            navigatorSeries.setData(
                baseSeries.options.data,
                false,
                null,
                false
            ); // #5414
        }
    },

    /**
     * Add chart events, like redrawing navigator, when chart requires that.
     *
     * @function Highcharts.Navigator#addChartEvents
     *
     * @return {void}
     */
    addChartEvents: function () {
        if (!this.eventsToUnbind) {
            this.eventsToUnbind = [];
        }

        this.eventsToUnbind.push(
            // Move the scrollbar after redraw, like after data updata even if
            // axes don't redraw
            addEvent(
                this.chart,
                'redraw',
                function () {
                    var navigator = this.navigator,
                        xAxis = navigator && (
                            navigator.baseSeries &&
                            navigator.baseSeries[0] &&
                            navigator.baseSeries[0].xAxis ||
                            navigator.scrollbar && this.xAxis[0]
                        ); // #5709

                    if (xAxis) {
                        navigator.render(xAxis.min, xAxis.max);
                    }
                }
            ),
            // Make room for the navigator, can be placed around the chart:
            addEvent(
                this.chart,
                'getMargins',
                function () {
                    var chart = this,
                        navigator = chart.navigator,
                        marginName = navigator.opposite ?
                            'plotTop' : 'marginBottom';
                    if (chart.inverted) {
                        marginName = navigator.opposite ?
                            'marginRight' : 'plotLeft';
                    }

                    chart[marginName] = (chart[marginName] || 0) + (
                        navigator.navigatorEnabled || !chart.inverted ?
                            navigator.outlineHeight :
                            0
                    ) + navigator.navigatorOptions.margin;
                }
            )
        );
    },

    /**
     * Destroys allocated elements.
     *
     * @function Highcharts.Navigator#destroy
     *
     * @return {void}
     */
    destroy: function () {

        // Disconnect events added in addEvents
        this.removeEvents();

        if (this.xAxis) {
            erase(this.chart.xAxis, this.xAxis);
            erase(this.chart.axes, this.xAxis);
        }
        if (this.yAxis) {
            erase(this.chart.yAxis, this.yAxis);
            erase(this.chart.axes, this.yAxis);
        }
        // Destroy series
        each(this.series || [], function (s) {
            if (s.destroy) {
                s.destroy();
            }
        });

        // Destroy properties
        each([
            'series', 'xAxis', 'yAxis', 'shades', 'outline', 'scrollbarTrack',
            'scrollbarRifles', 'scrollbarGroup', 'scrollbar', 'navigatorGroup',
            'rendered'
        ], function (prop) {
            if (this[prop] && this[prop].destroy) {
                this[prop].destroy();
            }
            this[prop] = null;
        }, this);

        // Destroy elements in collection
        each([this.handles], function (coll) {
            destroyObjectProperties(coll);
        }, this);
    }
};

H.Navigator = Navigator;

/**
 * For Stock charts, override selection zooming with some special features
 * because X axis zooming is already allowed by the Navigator and Range
 * selector.
 */
wrap(Axis.prototype, 'zoom', function (proceed, newMin, newMax) {
    var chart = this.chart,
        chartOptions = chart.options,
        zoomType = chartOptions.chart.zoomType,
        pinchType = chartOptions.chart.pinchType,
        previousZoom,
        navigator = chartOptions.navigator,
        rangeSelector = chartOptions.rangeSelector,
        ret;

    if (this.isXAxis && ((navigator && navigator.enabled) ||
            (rangeSelector && rangeSelector.enabled))) {
        // For x only zooming, fool the chart.zoom method not to create the zoom
        // button because the property already exists
        if (
            (!isTouchDevice && zoomType === 'x') ||
            (isTouchDevice && pinchType === 'x')
        ) {
            chart.resetZoomButton = 'blocked';

        // For y only zooming, ignore the X axis completely
        } else if (zoomType === 'y') {
            ret = false;

        // For xy zooming, record the state of the zoom before zoom selection,
        // then when the reset button is pressed, revert to this state. This
        // should apply only if the chart is initialized with a range (#6612),
        // otherwise zoom all the way out.
        } else if (
            (
                (!isTouchDevice && zoomType === 'xy') ||
                (isTouchDevice && pinchType === 'xy')
            ) &&
            this.options.range
        ) {

            previousZoom = this.previousZoom;
            if (defined(newMin)) {
                this.previousZoom = [this.min, this.max];
            } else if (previousZoom) {
                newMin = previousZoom[0];
                newMax = previousZoom[1];
                delete this.previousZoom;
            }
        }

    }
    return ret !== undefined ? ret : proceed.call(this, newMin, newMax);
});

// Initialize navigator for stock charts
addEvent(Chart, 'beforeRender', function () {
    var options = this.options;
    if (options.navigator.enabled || options.scrollbar.enabled) {
        this.scroller = this.navigator = new Navigator(this);
    }
});

/**
 * For stock charts, extend the Chart.setChartSize method so that we can set the
 * final top position of the navigator once the height of the chart, including
 * the legend, is determined. #367. We can't use Chart.getMargins, because
 * labels offsets are not calculated yet.
 */
addEvent(Chart, 'afterSetChartSize', function () {

    var legend = this.legend,
        navigator = this.navigator,
        scrollbarHeight,
        legendOptions,
        xAxis,
        yAxis;

    if (navigator) {
        legendOptions = legend && legend.options;
        xAxis = navigator.xAxis;
        yAxis = navigator.yAxis;
        scrollbarHeight = navigator.scrollbarHeight;

        // Compute the top position
        if (this.inverted) {
            navigator.left = navigator.opposite ?
                this.chartWidth - scrollbarHeight - navigator.height :
                this.spacing[3] + scrollbarHeight;
            navigator.top = this.plotTop + scrollbarHeight;
        } else {
            navigator.left = this.plotLeft + scrollbarHeight;
            navigator.top = navigator.navigatorOptions.top ||
                this.chartHeight -
                navigator.height -
                scrollbarHeight -
                this.spacing[2] -
                (
                    this.rangeSelector && this.extraBottomMargin ?
                        this.rangeSelector.getHeight() :
                        0
                ) -
                (
                    (
                        legendOptions &&
                        legendOptions.verticalAlign === 'bottom' &&
                        legendOptions.enabled &&
                        !legendOptions.floating
                    ) ?
                        legend.legendHeight + pick(legendOptions.margin, 10) :
                        0
                );
        }

        if (xAxis && yAxis) { // false if navigator is disabled (#904)

            if (this.inverted) {
                xAxis.options.left = yAxis.options.left = navigator.left;
            } else {
                xAxis.options.top = yAxis.options.top = navigator.top;
            }

            xAxis.setAxisSize();
            yAxis.setAxisSize();
        }
    }
});

// Merge options, if no scrolling exists yet
addEvent(Chart, 'update', function (e) {

    var navigatorOptions = (e.options.navigator || {}),
        scrollbarOptions = (e.options.scrollbar || {});

    if (!this.navigator && !this.scroller &&
        (navigatorOptions.enabled || scrollbarOptions.enabled)
    ) {
        merge(true, this.options.navigator, navigatorOptions);
        merge(true, this.options.scrollbar, scrollbarOptions);
        delete e.options.navigator;
        delete e.options.scrollbar;
    }

});

// Initiate navigator, if no scrolling exists yet
addEvent(Chart, 'afterUpdate', function () {

    if (!this.navigator && !this.scroller &&
        (this.options.navigator.enabled || this.options.scrollbar.enabled)
    ) {
        this.scroller = this.navigator = new Navigator(this);
    }

});

// Pick up badly formatted point options to addPoint
wrap(Series.prototype, 'addPoint', function (
    proceed,
    options,
    redraw,
    shift,
    animation
) {
    var turboThreshold = this.options.turboThreshold;
    if (
        turboThreshold &&
        this.xData.length > turboThreshold &&
        isObject(options, true) &&
        this.chart.navigator
    ) {
        error(20, true);
    }
    proceed.call(this, options, redraw, shift, animation);
});

// Handle adding new series
addEvent(Chart, 'afterAddSeries', function () {
    if (this.navigator) {
        // Recompute which series should be shown in navigator, and add them
        this.navigator.setBaseSeries(null, false);
    }
});

// Handle updating series
addEvent(Series, 'afterUpdate', function () {
    if (this.chart.navigator && !this.options.isInternal) {
        this.chart.navigator.setBaseSeries(null, false);
    }
});

Chart.prototype.callbacks.push(function (chart) {
    var extremes,
        navigator = chart.navigator;

    // Initiate the navigator
    if (navigator && chart.xAxis[0]) {
        extremes = chart.xAxis[0].getExtremes();
        navigator.render(extremes.min, extremes.max);
    }
});

