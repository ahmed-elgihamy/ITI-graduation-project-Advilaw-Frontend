import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class ProgressBarComponent {
  chartSeries: ApexAxisChartSeries = [];
  xAxis: ApexXAxis = { categories: [] };

  chartDetails: ApexChart = {
    type: 'bar',
    height: 350,
  };

  yAxis: ApexYAxis = {
    min: 0,
    forceNiceScale: true,
    title: { text: 'Value' },
  };

  private _data: Record<string, number> = {};

  @Input()
  set data(value: Record<string, number>) {
    this._data = value || {};
    this.updateChart();
  }

  updateChart() {
    this.chartSeries = [
      {
        name: 'Values',
        data: Object.values(this._data),
      },
    ];
    this.xAxis.categories = Object.keys(this._data);
  }
}
