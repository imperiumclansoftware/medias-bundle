/**
 * @license  Highcharts JS v6.1.3 (2018-09-12)
 *
 * Item series type for Highcharts
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return factory;
		});
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {
	(function (H) {
		/**
		 * (c) 2009-2017 Torstein Honsi
		 *
		 * Item series type for Highcharts
		 *
		 * License: www.highcharts.com/license
		 */

		/**
		 * @todo
		 * - Check update, remove etc.
		 * - Custom icons like persons, carts etc. Either as images, font icons or
		 *   Highcharts symbols.
		 */
		var each = H.each,
		    extend = H.extend,
		    pick = H.pick,
		    seriesType = H.seriesType;

		seriesType('item', 'column', {
		    itemPadding: 0.2,
		    marker: {
		        symbol: 'circle',
		        states: {
		            hover: {},
		            select: {}
		        }
		    }
		}, {
		    drawPoints: function () {
		        var series = this,
		            renderer = series.chart.renderer,
		            seriesMarkerOptions = this.options.marker,
		            itemPaddingTranslated = this.yAxis.transA *
		                series.options.itemPadding,
		            borderWidth = this.borderWidth,
		            crisp = borderWidth % 2 ? 0.5 : 1;

		        each(this.points, function (point) {
		            var yPos,
		                attr,
		                graphICS,
		                itemY,
		                pointAttr,
		                pointMarkerOptions = point.marker || {},
		                symbol = (
		                    pointMarkerOptions.symbol ||
		                    seriesMarkerOptions.symbol
		                ),
		                radius = pick(
		                    pointMarkerOptions.radius,
		                    seriesMarkerOptions.radius
		                ),
		                size,
		                yTop,
		                isSquare = symbol !== 'rect',
		                x,
		                y;

		            point.graphICS = graphICS = point.graphICS || {};
		            pointAttr = point.pointAttr ?
		                (
		                    point.pointAttr[point.selected ? 'selected' : ''] ||
		                    series.pointAttr['']
		                ) :
		                series.pointAttribs(point, point.selected && 'select');
		            delete pointAttr.r;

		            if (point.y !== null) {

		                if (!point.graphic) {
		                    point.graphic = renderer.g('point').add(series.group);
		                }

		                itemY = point.y;
		                yTop = pick(point.stackY, point.y);
		                size = Math.min(
		                    point.pointWidth,
		                    series.yAxis.transA - itemPaddingTranslated
		                );
		                for (yPos = yTop; yPos > yTop - point.y; yPos--) {

		                    x = point.barX + (
		                        isSquare ?
		                            point.pointWidth / 2 - size / 2 :
		                            0
		                    );
		                    y = series.yAxis.toPixels(yPos, true) +
		                        itemPaddingTranslated / 2;

		                    if (series.options.crisp) {
		                        x = Math.round(x) - crisp;
		                        y = Math.round(y) + crisp;
		                    }
		                    attr = {
		                        x: x,
		                        y: y,
		                        width: Math.round(isSquare ? size : point.pointWidth),
		                        height: Math.round(size),
		                        r: radius
		                    };

		                    if (graphICS[itemY]) {
		                        graphICS[itemY].animate(attr);
		                    } else {
		                        graphICS[itemY] = renderer.symbol(symbol)
		                            .attr(extend(attr, pointAttr))
		                            .add(point.graphic);
		                    }
		                    graphICS[itemY].isActive = true;
		                    itemY--;
		                }
		            }
		            H.objectEach(graphICS, function (graphic, key) {
		                if (!graphic.isActive) {
		                    graphic.destroy();
		                    delete graphic[key];
		                } else {
		                    graphic.isActive = false;
		                }
		            });
		        });

		    }
		});

		H.SVGRenderer.prototype.symbols.rect = function (x, y, w, h, options) {
		    return H.SVGRenderer.prototype.symbols.callout(x, y, w, h, options);
		};


	}(Highcharts));
	return (function () {


	}());
}));
