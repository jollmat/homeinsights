import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { UrlScrapperService } from '../../../services/url-scrapper.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Node } from '../../../model/interfaces/node.interface';
import { HomeInterface } from '../../../model/interfaces/home.interface';
import { HomeinsightsService } from '../../../services/homeinsights.service';
import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'app-home-url-scrapper',
  standalone: true,
  imports: [CommonModule, FormsModule, ɵEmptyOutletComponent],
  templateUrl: './home-url-scrapper.component.html',
  styleUrl: './home-url-scrapper.component.scss'
})
export class HomeUrlScrapperComponent implements OnInit {

  @Output()
  onCheckingUrl = new EventEmitter<boolean>(false);

  @Output()
  onHomeFound = new EventEmitter<HomeInterface>();

  /*
  @Output()
  onAddHome = new EventEmitter<HomeInterface>();
  */

  @Input()
  homes!: HomeInterface[];

  url = 'https://www.habitaclia.com/i500006018231';
  readonly isValidUrl = signal(false);
  readonly isCheckedUrl = signal(false);
  readonly isCheckingUrl = signal(false);

  errorMsg?: string;

  home?: HomeInterface;

  private knownUrlDomains = [
    'habitaclia'
  ];

  constructor(
    private readonly urlScrapperService: UrlScrapperService,
    private readonly homeInsightsService: HomeinsightsService
  ) {}
  
  /*
  addHome() {
    this.onAddHome.emit(this.home);
  }
  */

  checkUrl() {
    this.isCheckedUrl.set(false);
    
    // Clean format
    this.url = this.url.replace('https://m.','https://');
    if (this.url.indexOf('?')>0) {
      this.url = this.url.substring(0, this.url.indexOf('?'));
    }

    if (this.url.trim().length>0) {
      this.errorMsg = undefined;
      this.onCheckingUrl.emit(true);
      this.isCheckingUrl.set(true);

      const existingUrl = this.homes.some((_home) => _home.url===this.url);
      const matchesKnownDomain = this.knownUrlDomains.some((_domain) => this.url.includes(_domain));

      if (existingUrl) { // Avoid duplicated url
        this.errorMsg = 'Ja existeix un a finca o vivenda amb el mateix enllaç.';
        this.isValidUrl.set(false);
        this.isCheckedUrl.set(true);
        this.onCheckingUrl.emit(false);
        this.isCheckingUrl.set(false);
      } else if (matchesKnownDomain) {
        this.urlScrapperService.scrapUrl(this.url).subscribe({
          next : (_res) => {
            this.onCheckingUrl.emit(false);
            this.isCheckingUrl.set(false);
            this.isValidUrl.set(true);
            this.isCheckedUrl.set(true);

            const responseBodyNodes: Node[] = this.urlScrapperService.findNodesWithTag(_res.html, 'body');
            if (responseBodyNodes.length===1) {
              const bodyNode: Node = responseBodyNodes[0];
              this.home = this.homeInsightsService.getNewHome();

              this.home.url = this.url;

              let titles: Node[] = this.urlScrapperService.findNodesWithTag(bodyNode, 'h1');
              if (titles.length>0) {
                this.home.title = titles[0].children && titles[0].children.length>0 ? titles[0].children[0] as string : '';
              }

              let images: Node[] = this.urlScrapperService.findNodesWithClassAttr(bodyNode, 'print-xl');
              if (images.length>0) {
                this.home.urlImages = images.map((_imgNode) => {
                  if (_imgNode.attrs && this.urlScrapperService.nodeHasAttribute(_imgNode, 'src')) {
                    return 'https:' + this.urlScrapperService.getNodeAttr(_imgNode, 'src');
                  }
                  return '';
                });
              }

              let prices: Node[] = this.urlScrapperService.findNodesWithClassAttr(bodyNode, 'price');
              if (prices.length>0) {
                prices = this.urlScrapperService.findNodesWithClassAttr(prices[0], 'font-2');
                if (prices.length>0 && prices[0].children) {
                  this.home.price = Number(prices[0].children[0].toString().replaceAll('.', '').replace(' €', ''));
                }
              }

              let agencies: Node[] =  this.urlScrapperService.findNodesWithAttributeValue(bodyNode, 'id', 'js-contact-top');
              if (agencies.length>0) {
                agencies = this.urlScrapperService.findNodesWithAttributeValue(bodyNode, 'class', 'title');
                if (agencies.length>0 && agencies[0].children && agencies[0].children.length>0) {
                  this.home.agency = agencies[0].children[0];
                }
              }
              this.onHomeFound.emit(this.home);
            }
          },
          error : (_err) => {
            console.error('err', _err);
            this.onCheckingUrl.emit(false);
            this.isCheckingUrl.set(false);
            this.isValidUrl.set(false);
            this.isCheckedUrl.set(true);
            this.onHomeFound.emit(undefined);
          }
        });
      } else {
        this.errorMsg = 'Link incorrecte.';
        this.isValidUrl.set(false);
        this.isCheckedUrl.set(true);
        this.onCheckingUrl.emit(false);
        this.isCheckingUrl.set(false);
        this.onHomeFound.emit(undefined);
      }
    }
  }

  ngOnInit(): void {
    this.onHomeFound.emit(undefined);
    if (!this.homes) {
      console.warn('No param \'homes\' passed to app-home-url-scrappern component');
    }
  }

}
