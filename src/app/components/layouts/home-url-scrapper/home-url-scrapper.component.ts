import { Component, EventEmitter, Output, signal } from '@angular/core';
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
export class HomeUrlScrapperComponent {

  @Output()
  onCheckingUrl = new EventEmitter<boolean>(false);

  @Output()
  onAddHome = new EventEmitter<HomeInterface>();

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

  addHome() {
    this.onAddHome.emit(this.home);
  }

  checkUrl() {
    this.isCheckedUrl.set(false);
    if (this.url.trim().length>0) {
      this.errorMsg = undefined;
      this.onCheckingUrl.emit(true);
      this.isCheckingUrl.set(true);
      let matchesKnownDomain = this.knownUrlDomains.some((_domain) => this.url.includes(_domain));
      if (matchesKnownDomain) {
        /*
        this.urlScrapper.scrapUrl(this.url).subscribe((_res) => {
          console.log('res', _res);
          this.onCheckingUrl.emit(false);
          this.isCheckingUrl.set(false);
          this.isValidUrl.set(true);
          this.isCheckedUrl.set(true);
        });
        */
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

              let titles: Node[] = this.urlScrapperService.findNodesWithTag(bodyNode, 'h1');
              if (titles.length>0) {
                this.home.title = titles[0].children && titles[0].children.length>0 ? titles[0].children[0] as string : '';
              }

              let images: Node[] = this.urlScrapperService.findNodesWithClassAttr(bodyNode, 'print-xl');
              if (images.length>0) {
                console.log(images);
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
                  console.log();
                  this.home.price = Number(prices[0].children[0].toString().replaceAll('.', '').replace(' €', ''));
                }
              }
              console.log(this.home);
            }
          },
          error : (_err) => {
            console.error('err', _err);
            this.onCheckingUrl.emit(false);
            this.isCheckingUrl.set(false);
            this.isValidUrl.set(false);
            this.isCheckedUrl.set(true);
          }
        });
      } else {
        this.errorMsg = 'Link incorrecte.';
        this.isValidUrl.set(false);
        this.isCheckedUrl.set(true);
        this.onCheckingUrl.emit(false);
        this.isCheckingUrl.set(false);
      }
    }
  }

}
