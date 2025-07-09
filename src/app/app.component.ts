import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterOutlet } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeinsightsService } from './services/homeinsights.service';
import { HomeInterface } from './model/interfaces/home.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgbTooltipModule, NgbOffcanvasModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  allHomes: HomeInterface[] = [];
  homes: HomeInterface[] = [];

  noImageUrl = 'https://puentecesosd.com/wp-content/uploads/2021/11/images-19.png';

  viewType: 'GRID' | 'LIST' = 'GRID';

  sortGridTypes = [
    { id: 'price', name: 'Preu' },
    { id: 'title', name: 'Títol' },
    { id: 'visited', name: 'Visitat' },
    { id: 'oks', name: 'A favor', sortDir: 'DESC' },
    { id: 'kos', name: 'En contra', sortDir: 'DESC' },
    { id: 'score', name: 'Puntuació', sortDir: 'DESC' }
  ];

  sortConfig: {sortBy: string, sortDir: 'ASC' | 'DESC'} = {
    sortBy: 'title',
    sortDir: 'ASC'
  };

  tooltipItems: string[] = [];
  tooltipType: 'OK' | 'KO' = 'OK';

  currentHome?: HomeInterface;

  form!: FormGroup;
  formConfig = [
    { label: 'Títol', name: 'title', type: 'text', required: true },
    { label: 'Addreça', name: 'address', type: 'text', required: true },
    { label: 'Població', name: 'location', type: 'text' },
    { label: 'Agència', name: 'agency', type: 'text' },
    { label: 'Preu', name: 'price', type: 'number' }
  ];
  readonly = true;

  constructor(
    private readonly homeInsightsService: HomeinsightsService,
    private readonly offCanvasService: NgbOffcanvas,
    private fb: FormBuilder
  ){}

  onSortByChange(ev: any) {
    this.sortBy(ev['id'], ev['sortDir'] || 'ASC');
  }

  searchHomes() {
    this.homes = this.allHomes.filter((_home) => {
      return _home.title!==undefined;
    });
    console.log(this.homes);
  }

  isSortedBy(sortField: string, sortDir?: 'ASC' | 'DESC') {
    if (sortDir) {
      return this.sortConfig.sortBy===sortField && this.sortConfig.sortDir===sortDir;
    }
    return this.sortConfig.sortBy===sortField;
  }

  sortBy(sortField: string, sortDir?: 'ASC' | 'DESC') {

    if (!sortDir) {
      if (this.sortConfig.sortBy===sortField) {
        this.sortConfig.sortDir = (this.sortConfig.sortDir==='ASC')?'DESC':'ASC'
      } else {
        this.sortConfig.sortDir = 'ASC';
      }
    } else {
      this.sortConfig.sortDir = sortDir;
    }
    
    this.sortConfig.sortBy = sortField;

    this.homes.sort((a, b) => {
      let res = 1;
      let aVal: any = 0;
      let bVal: any = 0;

      switch(sortField) {
        case 'title':
          aVal = a.title;
          bVal = b.title;
          break;
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'agency':
          aVal = a.agency;
          bVal = b.agency;
          break;
        case 'oks':
          aVal = a.oks.length;
          bVal = b.oks.length;
          break;
        case 'kos':
          aVal = a.kos.length;
          bVal = b.kos.length;
          break;
        case 'visited':
          aVal = a.kos.length;
          bVal = b.kos.length;
          break;
        case 'score':
          aVal = a.score || 0;
          bVal = b.score || 0;
          break;
      }

      if (this.sortConfig.sortDir==='ASC') {
        res = (aVal>bVal)? 1:-1;
      } else {
        res = (aVal<bVal)? 1:-1;
      }
      return res;
    });
  }

  removeHome(homeId: string) {
    this.allHomes = this.allHomes.filter((_home) => _home.id!==homeId);
    this.updateHomes();
  }

  createForm() {
    const group: any = {};
    this.formConfig.forEach(field => {
      group[field.name] = field.required
        ? [null, Validators.required]
        : [null];
    });
    this.form = this.fb.group(group);

    if (this.currentHome) {
      this.form.patchValue({
        title: this.currentHome.title,
        address: this.currentHome.locationInfo?.address,
        location: this.currentHome.locationInfo?.location,
        agency: this.currentHome.agency,
        price: this.currentHome.price
      });
    }
  }

  openNewHome(modal: unknown) {
    const newHome: HomeInterface = this.homeInsightsService.getNewHome();
    this.createForm();
    this.openHomeDetail(modal, newHome);
  }

  openHomeDetail(modal: unknown, home: HomeInterface) {
    this.currentHome = home;
    this.createForm();
    this.offCanvasService.open(modal,{position: 'end', panelClass: 'custom-offcanvas-width'/*, backdrop: 'static'*/});
  }

  updateHomes(homes?: HomeInterface[]) {
    let homesToSave: HomeInterface[] = homes || [...this.allHomes];
    this.homeInsightsService.saveHomes(homesToSave).subscribe(() => {
      this.allHomes = homesToSave;
      this.searchHomes();
    });
  }

  saveHome() {
    console.log('saveHome()', this.currentHome);
    if (this.currentHome) {
      let homesToSave: HomeInterface[] = [...this.allHomes];
      if (homesToSave.some((_home) => _home.id===this.currentHome?.id)) {
        homesToSave = this.allHomes.filter((_home) => _home.id!==this.currentHome?.id);
      }
      homesToSave.push(this.currentHome);
      this.updateHomes(homesToSave);
    }
  }

  closeContactDetail() {
    this.currentHome = undefined;
    this.offCanvasService.dismiss();
  }

  getColorFromValue(val?: number): string {
    if (val===undefined) {
      return 'transparent';
    } else {
      return HomeinsightsService.getColorFromValue(val);
    }
  }

  ngOnInit(): void {
    this.homeInsightsService.loadHomes().subscribe((_homes) => {
      this.allHomes = _homes;
      this.searchHomes();
      this.sortBy('score', 'DESC');

      //this.homeInsightsService.saveHomes(this.allHomes).subscribe();
    });
  }
}
