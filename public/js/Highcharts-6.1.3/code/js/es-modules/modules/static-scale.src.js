/**
 * (c) 2017 Torstein Honsi, Lars Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var Chart = H.Chart,
    each = H.each,
    pick = H.pick;

Chart.prototype.adjustHeight = function () {
    each(this.axes || [], function (axis) {
        var chart = axis.chart,
            animate = !!chart.initiatedScale && chart.options.animation,
            statICScale = axis.options.statICScale,
            height,
            diff;
        if (
            H.isNumber(statICScale) &&
            !axis.horiz &&
            H.defined(axis.min)
        ) {
            height = pick(
                axis.unitLength,
                axis.max + axis.tickInterval - axis.min
            ) * statICScale;

            // Minimum height is 1 x statICScale.
            height = Math.max(height, statICScale);

            diff = height - chart.plotHeight;

            if (Math.abs(diff) >= 1) {
                chart.plotHeight = height;
                chart.setSize(null, chart.chartHeight + diff, animate);
            }
        }

    });
    this.initiatedScale = true;
};
H.addEvent(Chart, 'render', Chart.prototype.adjustHeight);
