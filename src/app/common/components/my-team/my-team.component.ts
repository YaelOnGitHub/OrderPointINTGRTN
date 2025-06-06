import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from "chart.js"
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from 'src/app/shared/services/main.service';
import { TeamService } from 'src/app/shared/services/team.service';


Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {

  @ViewChild('usageChart', { static: false }) usageChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('allocationChart', { static: false }) allocationChartRef!: ElementRef<HTMLCanvasElement>;

  periodStart = "";
  periodEnd = ""

  totalHandCarry = 0
  totalDTP = 0
  totalUsage = 0
  remainingAllocation = 0
  totalonHand = 0;

  allocated: number = 0;
  maxValue: any;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  isProductSelected: boolean = false;
  usageChart: any
  allocationChart: any
  currentLanguage = 'en';

  productInfo = {
    id: "-",
    brand: "",
    description: "",
    name: "",
    unitsPerPackage: "",
    previewURL: '',
  }

  selectedType: any;
  productTypes: any;
  dtpRuleEnabled: boolean = false;
  constructor(private _teamService: TeamService, private spinner: NgxSpinnerService, private mainService: MainService) {
    this.getDates();
  }

  isProductInfoAvailable(): boolean {
    const p = this.productInfo;
    return !!(p &&
      (p.id !== '-' || p.brand || p.name || p.description || p.unitsPerPackage || p.previewURL)
    );
  }

  responsiveLegendPlugin = {
    id: 'responsiveLegend',
    beforeInit(chart: any) {
      const isIpad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
      const screenWidth = window.innerWidth;
      chart.options.plugins.legend.position =
        isIpad || screenWidth < 1050 ? 'bottom' : 'left';
    }
  };

  centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart: any) {
      const total = chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
      const isEmpty = chart.data.labels.length === 1 && chart.data.labels[0] === 'No Data';

      if (isEmpty) return;

      const { ctx, chartArea } = chart;
      const { left, right, top, bottom } = chartArea;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;
      const text = total.toString();

      ctx.save();
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, centerX, centerY);
      ctx.restore();
    }
  };

  ngOnInit() {
    this.dtpRuleEnabled = Boolean(sessionStorage.getItem('ruleDeductDTPEnabled')) || false;
    this.mainService.languageChange.subscribe(lang => {
      this.currentLanguage = lang;
    });
    this.loadProducts();
  }

  getDates() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.periodStart = oneMonthAgo.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.periodEnd = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getProgressWidth(value: number): string {
    const maxWidth = 200;
    const percentage = (value / this.maxValue);
    return `${percentage * 100}%`;
  }

  handleDataFromChild(data: any) {
    this.totalHandCarry = data.totalHandCarry;
    this.totalonHand = data.totalOnHand;
    this.totalDTP = data.totalDTP;
    this.totalUsage = data.totalUsage;
    this.remainingAllocation = data.remainingAllocation
    this.allocated = data.totalAllocated;
    this.maxValue = Math.max(this.allocated, this.remainingAllocation, this.totalonHand);
    this.loadCharts();
  }

  loadCharts() {
    this.createUsageChart();
    this.createAllocationChart();
  }

  loadProducts() {
    this.spinner.show();
    this._teamService.getTeamItems(this.dtpRuleEnabled).subscribe(res => {
      this.productTypes = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  ngAfterViewInit() {
    this.loadCharts();
  }

  selectOrderType(oType: any) {
    this.selectedType = oType.name;
    this.productInfo = oType;
    this.changeDates(oType.periodStartDate, oType.periodEndDate);
    this._teamService.setSelectedProduct(oType);
  }

  changeDates(startDate: string | number | Date, endDate: string | number | Date) {
    this.periodStart = new Date(startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.periodEnd = new Date(endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getChartOptions(centerText: string) {
    return {
      cutout: "70%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 15,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.label}: ${context.raw}`,
          },
        },
      },
      elements: {
        center: {
          text: centerText,
          fontStyle: "Arial",
          fontColor: "#000",
          sidePadding: 20,
        },
      },
    }
  }

  getLabels(key: string): any {

    const isFrench = this.currentLanguage === 'fr';

    const translations: { [key: string]: { en: string[], fr: string[] } } = {
      usage: {
        en: ['Shipped for Hand Carry', 'Disbursed via DTP'],
        fr: ['Expédié au représentant', 'Distribué via DTP']
      },
      allocation: {
        en: ['Samples Deployed', 'Samples Remaining'],
        fr: ['Échantillons Déployés', 'Échantillons Restants']
      },
      noData: {
        en: ['No Data'],
        fr: ['Aucune donnée']
      }
    };

    return isFrench ? translations[key].fr : translations[key].en;
  }

  createUsageChart() {
    setTimeout(() => {
      const canvas = document.getElementById("usageChart") as HTMLCanvasElement;
  
      if (!canvas) {
        console.warn('Canvas element #usageChart not found');
        return;
      }
  
      const existingChart = Chart.getChart(canvas);
      if (existingChart) {
        existingChart.destroy();
      }
  
      const total = this.totalHandCarry + this.totalDTP;
      const isEmpty = total === 0;
  
      const data = isEmpty
        ? [1]
        : [this.totalHandCarry, this.totalDTP];
  
      const labels = isEmpty
        ? this.getLabels('noData')
        : this.getLabels('usage');
  
      const backgroundColors = isEmpty
        ? ['#e0e0e0']
        : ['rgba(130, 128, 224, 1)', 'rgba(45, 141, 185, 1)'];
  
      this.usageChart = new Chart(canvas, {
        type: "doughnut",
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: backgroundColors,
            borderWidth: 9,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '50%',
          plugins: {
            legend: {
              position: "left",
              align: "start",
              labels: {
                usePointStyle: true,
                padding: 18,
              },
            },
            tooltip: {
              enabled: true,
              padding: 6, // reduces extra space inside the tooltip box
              boxPadding: 4, // reduces space around the color box
              callbacks: {
                label: function (context) {
                  const value = context.formattedValue || '';
                  return `${value}`;
                }
              }
            },
            datalabels: {
              display: !isEmpty,
              color: '#000',
              font: {
                weight: 'normal',
                size: 11,
              },
              anchor: 'end',
              align: 'start',
              offset: 0,
              padding:10,
              formatter: (value: number) => value
            }
          }
        },
        plugins: [this.centerTextPlugin, this.responsiveLegendPlugin],
      });
    }, 0);
  }

createAllocationChart() {
  // Delay execution to ensure canvas is available after DOM update
  setTimeout(() => {
    const canvas = document.getElementById("allocationChart") as HTMLCanvasElement;

    if (!canvas) {
      console.warn('Canvas element #allocationChart not found');
      return;
    }

    // 🔥 Destroy chart if it already exists on the canvas
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    const total = this.totalUsage + this.remainingAllocation;
    const isEmpty = total === 0;

    const data = isEmpty
      ? [1]
      : [this.totalUsage, this.remainingAllocation];

    const labels = isEmpty
      ? this.getLabels('noData')
      : this.getLabels('allocation');

    const backgroundColors = isEmpty
      ? ['#e0e0e0']
      : ["#CF6363", "#4A4A4A"];

    this.allocationChart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
          legend: {
            position: "left",
            align: "start",
            labels: {
              usePointStyle: true,
              padding: 18,
            },
          },
          tooltip: {
            enabled: true,
            padding: 6, // reduces extra space inside the tooltip box
            boxPadding: 4, // reduces space around the color box
            callbacks: {
              label: function (context) {
                const value = context.formattedValue || '';
                return `${value}`;
              }
            }
          },
          datalabels: {
            display: !isEmpty,
            color: '#000',
            padding:10,
            font: {
              weight: 'normal',
              size: 11,
            },
            anchor: 'end',
            align: 'start',
            offset: 0,
            formatter: (value: number) => value
          }
        }
      },
      plugins: [this.centerTextPlugin, this.responsiveLegendPlugin],
    });
  }, 0); 
}

  ngOnDestroy(): void {
   this._teamService.setSelectedProduct("");
  }
}
