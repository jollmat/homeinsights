import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { RouterOutlet } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeinsightsService } from './services/homeinsights.service';
import { HomeInterface } from './model/interfaces/home.interface';
import { HomeUrlScrapperComponent } from "./components/layouts/home-url-scrapper/home-url-scrapper.component";
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgbTooltipModule, NgbOffcanvasModule, FormsModule, ReactiveFormsModule, NgSelectModule, HomeUrlScrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  readonly isMobile = signal(false);
  readonly isTablet = signal(false);
  readonly isDesktop = signal(false);
  readonly userAgent = navigator.userAgent;

  readonly isNewHome = signal(false);
  readonly isCheckingUrl = signal(false);
  
  allHomes: HomeInterface[] = [];
  homes: HomeInterface[] = [];

  noImageUrl = 'https://puentecesosd.com/wp-content/uploads/2021/11/images-19.png';

  viewType: 'GRID' | 'LIST' = 'GRID';

  sortGridTypes = [
    { id: 'price', name: 'Preu', sortDir: 'ASC' },
    { id: 'title', name: 'Títol', sortDir: 'ASC' },
    { id: 'visitStatus', name: 'Estat visita', sortDir: 'DESC' },
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

  searchText = '';
  searchControl = new FormControl(this.searchText);

  readonly = true;

  constructor(
    private readonly homeInsightsService: HomeinsightsService,
    private readonly offCanvasService: NgbOffcanvas,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ){
    this.detectDevice();

    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after the last keystroke
      distinctUntilChanged(), // Only emit if the value is different from the last one
      switchMap(query => this.searchHomes(query)) // Replace with actual API call
    ).subscribe(_homes => {
      this.homes = _homes;
    });
  }

  private detectDevice(): void {
    const width = window.innerWidth;

    this.isMobile.set(width <= 768);
    this.isTablet.set(width > 768 && width <= 1024);
    this.isDesktop.set(width > 1024);
  }

  onSortByChange(ev: any) {
    this.sortBy(ev['id'], ev['sortDir'] || 'ASC');
  }

  searchHomes(query: string | null): Observable<HomeInterface[]> {
    console.log('searchHomes()', query);
    this.searchText = query!=null? query : '';
    if (query?.trim().length===0) {
      return of ([...this.allHomes]);
    }
    return of(this.allHomes.filter((_home) => {
      return _home.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        _home.locationInfo?.address?.toLowerCase().includes(this.searchText.toLowerCase()) || 
        _home.agency.toLowerCase().includes(this.searchText.toLowerCase());
    }));
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
        case 'visitStatus':
          aVal = a.visitStatus;
          bVal = b.visitStatus;
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

  newHomeFrom = 'form';
  openNewHome(modal: unknown) {
    const newHome: HomeInterface = this.homeInsightsService.getNewHome();
    this.createForm();
    this.openHomeDetail(modal, newHome);
  }

  openHomeDetail(modal: unknown, home: HomeInterface) {
    this.isNewHome.set(home.id.length===0);
    this.newHomeFrom = this.isNewHome()? 'link':'form';
    this.readonly = !this.isNewHome();

    this.currentHome = home;
    this.createForm();
    this.offCanvasService.open(modal,{position: 'end', panelClass: 'custom-offcanvas-width'/*, backdrop: 'static'*/});
    if (document.activeElement) {
      setTimeout(() => (document.activeElement as HTMLElement).blur(), 10);
    }
  }

  updateHomes(homes?: HomeInterface[]) {
    let homesToSave: HomeInterface[] = homes || [...this.allHomes];
    this.homeInsightsService.saveHomes(homesToSave).subscribe(() => {
      this.allHomes = homesToSave;
      this.searchHomes(this.searchText).subscribe((_homes) => this.homes=_homes);
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

  doAddHome(home: HomeInterface) {
    let homesToSave: HomeInterface[] = [...this.allHomes];
    console.log('doAddHome()', home, homesToSave);
    home.id = uuidv4();
    homesToSave.push(home);
    this.updateHomes(homesToSave);
    this.closeContactDetail();
    this.toastrService.success('Nova finca/vivenda creada correctament!');
  }

  closeContactDetail() {
    this.currentHome = undefined;
    this.offCanvasService.dismiss();
  }

  getColorFromValue(val?: number): string {
    if (val===undefined) {
      return 'transparent';
    } else {
      // return HomeinsightsService.getColorFromValue(val);
      return HomeinsightsService.getRatingColor(val);
    }
  }

  setCheckingUrl(isChecking: boolean) {
    this.isCheckingUrl.set(isChecking);
  }

  ngOnInit(): void {
    this.homeInsightsService.loadHomes().subscribe((_homes) => {
      this.allHomes = _homes;
      this.searchHomes(this.searchText).subscribe((_homes) => this.homes=_homes);
      this.sortBy('score', 'DESC');

      //this.homeInsightsService.saveHomes(this.allHomes).subscribe();
    });
  }
}
