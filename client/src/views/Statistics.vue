<script setup lang="ts">
import * as Plot from "@observablehq/plot";
import { onMounted, onUnmounted, ref } from 'vue';

let resizeObserver: ResizeObserver | null = null;

import axios from 'axios';
import type { HoursPerTask, TimeHeatmap } from 'timeclicker_server';
import { UiError, useErrorStore } from '@/stores/error';
import { useI18n } from 'vue-i18n';

const errorStore = useErrorStore();
const { t } = useI18n();

const barChartData = ref<{ taskId: string; taskTitle: string; hours: number }[]>([])
const heatmapData = ref<{
    date: string;
    totalHours: number;
    activityCount: number;
}[]>([])

const barChartContainer = ref<HTMLElement | null>(null)
const heatmapContainer = ref<HTMLElement | null>(null)
const tooltip = ref<HTMLElement | null>(null)

const getWeekOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek);
}

const showTooltip = (event: MouseEvent, content: string) => {
    if (!tooltip.value) return;
    tooltip.value.innerHTML = content;
    tooltip.value.style.opacity = '1';
    tooltip.value.style.left = event.pageX + 10 + 'px';
    tooltip.value.style.top = event.pageY - 10 + 'px';
}

const hideTooltip = () => {
    if (!tooltip.value) return;
    tooltip.value.style.opacity = '0';
}

const setupBarChartInteractivity = () => {
    if (!barChartContainer.value) return;

    const bars = barChartContainer.value.querySelectorAll('rect');
    bars.forEach((bar, index) => {
        const data = barChartData.value.slice().sort((a, b) => b.hours - a.hours)[index];
        if (!data) return;

        bar.addEventListener('mouseover', (e) => {
            bar.style.stroke = '#333';
            bar.style.strokeWidth = '2px';
            showTooltip(e as MouseEvent, `<strong>${data.taskTitle}</strong><br>${data.hours.toFixed(1)} ${t('hour', data.hours)}`);
        });
        bar.addEventListener('mousemove', (e) => {
            showTooltip(e as MouseEvent, `<strong>${data.taskTitle}</strong><br>${data.hours.toFixed(1)} ${t('hour', data.hours)}`);
        });
        bar.addEventListener('mouseout', () => {
            bar.style.stroke = 'none';
            bar.style.strokeWidth = '0';
            hideTooltip();
        });
    });
}

const setupHeatmapInteractivity = () => {
    if (!heatmapContainer.value) return;

    const cells = heatmapContainer.value.querySelectorAll('rect');
    cells.forEach((cell) => {
        const titleEl = cell.querySelector('title');
        const titleText = titleEl?.textContent || '';

        cell.addEventListener('mouseover', (e) => {
            cell.style.stroke = '#333';
            cell.style.strokeWidth = '2px';
            showTooltip(e as MouseEvent, titleText);
        });
        cell.addEventListener('mousemove', (e) => {
            showTooltip(e as MouseEvent, titleText);
        });
        cell.addEventListener('mouseout', () => {
            cell.style.stroke = 'none';
            cell.style.strokeWidth = '0';
            hideTooltip();
        });
    });
}

const renderCharts = () => {
    if (barChartContainer.value) {
        barChartContainer.value.innerHTML = '';
        const barChart = Plot.plot({
            title: t('hours_per_task'),
            marginBottom: 60,
            width: barChartContainer.value.clientWidth - 40,
            x: {
                label: t('task', 2),
                domain: barChartData.value.slice().sort((a, b) => b.hours - a.hours).map(d => d.taskTitle),
                tickFormat: (d) => d.length > 15 ? d.slice(0, 12) + '…' : d
            },
            y: {
                label: t('hour', 2),
                grid: true
            },
            style: {
                background: "transparent",
                color: "var(--plot-fg)",
                fontFamily: "inherit",
            },
            marks: [
                Plot.barY(barChartData.value, {
                    x: 'taskTitle',
                    y: 'hours',
                    fill: 'taskTitle',
                    sort: { x: 'y', reverse: true }
                }),
                Plot.textY(barChartData.value, {
                    x: 'taskTitle',
                    y: 'hours',
                    text: (d) => d.hours.toFixed(1),
                    textAnchor: 'middle',
                    dy: -5
                })
            ],
            color: {
                legend: false
            }
        })
        barChartContainer.value.appendChild(barChart)
        setupBarChartInteractivity();
    }

    if (heatmapContainer.value) {
        heatmapContainer.value.innerHTML = '';
        const heatmap = Plot.plot({
            title: t('activity_over_the_last_year'),
            padding: 0,
            width: heatmapContainer.value.clientWidth - 40,
            x: {
                tickFormat: (d) => (d % 4 === 0 ? d : ""),
                label: "Week of year"
            },
            y: {
                tickFormat: Plot.formatWeekday("en", "narrow"),
                tickSize: 0,
                label: null
            },
            color: {
                scheme: "Greens",
                domain: [0, Math.max(...heatmapData.value.map(d => d.totalHours))],
                label: t('hour', 2),
                legend: true
            },
            marks: [
                Plot.cell(heatmapData.value, {
                    x: (d) => getWeekOfYear(new Date(d.date)),
                    y: (d) => new Date(d.date).getDay(),
                    fill: "totalHours",
                    title: (d) => `${(new Date(d.date)).toLocaleDateString()}: ${d.totalHours.toFixed(1)} ${t('hour', d.totalHours)}`,
                    inset: 0.5
                })
            ]
        })
        heatmapContainer.value.appendChild(heatmap)
        setupHeatmapInteractivity();
    }
}

onMounted(async () => {
    try {
        const [hoursRes, heatmapRes] = await Promise.all([
            axios.get(import.meta.env.VITE_API_ENDPOINT + 'statistics/hours-per-task'),
            axios.get(import.meta.env.VITE_API_ENDPOINT + 'statistics/time-heatmap')
        ]);
        barChartData.value = (<HoursPerTask>hoursRes.data).map((item) => ({ ...item, hours: parseFloat(item.hours) }))
        heatmapData.value = (<TimeHeatmap>heatmapRes.data).map((item) => ({ ...item, totalHours: parseFloat(item.totalHours), activityCount: parseInt(item.activityCount) }))
        console.log(barChartData.value)
        renderCharts();

        // Re-render on resize
        resizeObserver = new ResizeObserver(() => {
            renderCharts();
        });
        if (barChartContainer.value) resizeObserver.observe(barChartContainer.value);
        if (heatmapContainer.value) resizeObserver.observe(heatmapContainer.value);
    } catch (error) {
        errorStore.setError(new UiError(t('errors.data_failed'), error));
    }
});

onUnmounted(() => {
    resizeObserver?.disconnect();
});
</script>

<template>
<div class="statistics-container">
    <h1>{{ t('statistics') }}</h1>
    <b-card>
        <div ref="barChartContainer" class="chart-wrapper" />
    </b-card>
    <b-card>
        <div ref="heatmapContainer" class="chart-wrapper" />
    </b-card>
    <div ref="tooltip" class="tooltip"></div>
</div>
</template>

<style scoped>
.statistics-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.chart-wrapper :deep(rect) {
    transition: stroke 0.1s, stroke-width 0.1s;
    cursor: pointer;
}

.tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 13px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 1000;
}

h1 {
    margin-bottom: 20px;
}

:deep(svg) {
    max-width: 100%;
    height: auto;
}
</style>
