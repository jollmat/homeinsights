import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { RouterOutlet } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeinsightsService } from './services/homeinsights.service';
import { HomeInterface, VisitStatus } from './model/interfaces/home.interface';
import { HomeUrlScrapperComponent } from "./components/layouts/home-url-scrapper/home-url-scrapper.component";
import { debounceTime, distinctUntilChanged, Observable, of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgbTooltipModule, NgbOffcanvasModule, FormsModule, ReactiveFormsModule, NgSelectModule, HomeUrlScrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  readonly isMobile = signal(false);
  readonly isTablet = signal(false);
  readonly isDesktop = signal(false);
  readonly userAgent = navigator.userAgent;

  readonly isNewHome = signal(false);
  readonly isCheckingUrl = signal(false);

  readonly isReadonly = signal(false);
  
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
  newHome?: HomeInterface;

  form!: FormGroup;
  formConfig = [
    { label: 'Estat visita', name: 'visitStatus', type: 'select', required: true, default: 'pending' },
    { label: 'Títol', name: 'title', type: 'text', required: true, default: '' },
    { label: 'Adreça', name: 'address', type: 'text', required: true, default: '' },
    { label: 'Població', name: 'location', type: 'text', required: true, default: 'Sitges' },
    { label: 'URL anunci', name: 'url', type: 'text', required: true, default: '' },
    { label: 'Agència', name: 'agency', type: 'text', required: true, default: '' },
    { label: 'Preu', name: 'price', type: 'number', required: true },
    { label: 'Score', name: 'score', type: 'number', required: false }
  ];

  searchText = '';
  searchControl = new FormControl(this.searchText);

  formChangeSubscription?: Subscription;

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
        ? [field.default || null, Validators.required]
        : [field.default || null];
    });
    this.form = this.fb.group(group);

    this.formChangeSubscription = this.form.valueChanges.subscribe(value => {
      if (this.isNewHome() && this.form.valid) {
        this.newHome = {} as HomeInterface;
        this.newHome.oks = [];
        this.newHome.kos = [];
      } else {
        this.newHome = undefined;
      }
    });

    if (!this.isNewHome() && this.currentHome) {
      this.form.patchValue({
        title: this.currentHome.title,
        address: this.currentHome.locationInfo?.address,
        location: this.currentHome.locationInfo?.location,
        agency: this.currentHome.agency,
        price: this.currentHome.price,
        url: this.currentHome.url,
        score: this.currentHome.score,
        visitStatus: this.currentHome.visitStatus
      });
    }
  }

  newHomeFrom = 'form';
  openNewHome(modal: unknown) {
    const newHome: HomeInterface = this.homeInsightsService.getNewHome();
    this.newHome = undefined;
    this.createForm();
    this.openHomeDetail(modal, newHome);
  }

  openHomeDetail(modal: unknown, home: HomeInterface) {
    this.isNewHome.set(home.id.length===0);
    this.newHomeFrom = this.isNewHome()? 'link':'form';
    this.isReadonly.set(!this.isNewHome());

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
      this.sortBy(this.sortConfig.sortBy, this.sortConfig.sortDir);
    });
  }

  saveHome() {
    if (this.currentHome) {
      const homeForm: {
        address: string,
        agency: string,
        location: string,
        price: number,
        title: string,
        url: string,
        score: number,
        visitStatus: VisitStatus
      } = this.form.getRawValue() as {
        address: string,
        agency: string,
        location: string,
        price: number,
        title: string,
        url: string,
        score: number,
        visitStatus: VisitStatus
      };

      let homesToSave: HomeInterface[] = [...this.allHomes];
      if (homesToSave.some((_home) => _home.id===this.currentHome?.id)) {
        homesToSave = this.allHomes.filter((_home) => _home.id!==this.currentHome?.id);
      }

      const currenHomeNew: HomeInterface = Object.assign({}, this.currentHome);
      if (currenHomeNew.locationInfo) {
        currenHomeNew.locationInfo.address = homeForm.address;
        currenHomeNew.locationInfo.location = homeForm.location;
      }
      currenHomeNew.agency = homeForm.agency;
      currenHomeNew.price = homeForm.price;
      currenHomeNew.title = homeForm.title;
      currenHomeNew.url = homeForm.url;
      currenHomeNew.score = homeForm.score;
      currenHomeNew.visitStatus = homeForm.visitStatus;

      homesToSave.push(currenHomeNew);
      this.updateHomes(homesToSave);
      this.toastrService.success('Finca/vivenda actualitzada correctament!');
    }
  }

  saveNewHome() {
    if (this.newHomeFrom==='form' && this.form && this.form.valid) {
      const formHome: {
        address: string,
        agency: string,
        location: string,
        price: number,
        title: string,
        url: string
      } = this.form.getRawValue() as {
        address: string,
        agency: string,
        location: string,
        price: number,
        title: string,
        url: string
      };
      this.doAddHome({
        title: formHome.title,
        locationInfo: {
          location: formHome.location,
          address: formHome.address
        },
        agency: formHome.agency,
        url: formHome.url,
        price: formHome.price
      } as HomeInterface);
    } else if (this. newHomeFrom==='link' && this.newHome) {
      this.doAddHome(this.newHome);
    }
    this.newHome = undefined;
  }

  doAddHome(home: HomeInterface) {
    let homesToSave: HomeInterface[] = [...this.allHomes];
    home.oks = [];
    home.kos = [];
    home.visitStatus = 'pending';
    home.id = uuidv4();

    const existsUrl = homesToSave.some((_home) => _home.url===home.url);
    if (existsUrl) {
      this.toastrService.error('Ja existeix un a finca/vivenda per a la URL de l\'anunci indicat');
    } else {
      homesToSave.push(home);
      this.updateHomes(homesToSave);
      this.closeContactDetail();
      this.toastrService.success('Nova finca/vivenda creada correctament!');
    }
  }

  doAddHomeFound(home?: HomeInterface) {
    this.newHome = home;
  }

  closeContactDetail() {
    this.currentHome = undefined;
    this.offCanvasService.dismiss();
  }

  getColorFromValue(val?: number): string {
    if (val===undefined) {
      return 'transparent';
    } else {
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

  ngOnDestroy(): void {
    if (this.formChangeSubscription) {
      this.formChangeSubscription.unsubscribe();
    }
  }
}
