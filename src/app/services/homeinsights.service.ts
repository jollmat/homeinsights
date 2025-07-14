import { Injectable } from '@angular/core';
import { HomeInterface, VisitStatus } from '../model/interfaces/home.interface';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class HomeinsightsService {

  localStorageKey = 'APP_HOMEINSIGHTS_HOMES';

  constructor() { }

  getNewHome(): HomeInterface {
    return {
      id: '',
      title: '',
      agency: '',
      url: '',
      locationInfo: {
        location: ''
      },
      oks: [],
      kos: [],
      price: 0,
      visitStatus: 'pending'
    } as HomeInterface
  }

  getHomes(): HomeInterface[] {
    return [
      { 
        id: uuidv4(),
        title: 'Port Alegre Baixos',
        agency: 'Living Group Sitges',
        url: 'https://www.idealista.com/inmueble/105916167/',
        urlImages: [
          'https://img4.idealista.com/blur/WEB_DETAIL_TOP-L-L/0/id.pro.es.image.master/87/16/3c/1293392074.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/6a/9a/f6/1293392075.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: 'C/ Port Alegre, 5'
        },
        oks: ['Decoració','Ubicació'],
        kos: ['Humitats', 'Sostre baix', 'Dimensions reduïdes', 'Claustrofòbia'],
        price: 285000,
        visitStatus: 'visited',
        score: 4
      },
      { 
        id: uuidv4(),
        title: 'Cases Noves',
        agency: 'Hill Carbonell SLU',
        url: 'https://www.hillcarbonell.net/ficha/piso/sitges/cases-noves/5106/21185926/es/',
        urlImages: [
          'https://fotos15.apinmo.com/5106/21185926/22-1.jpg',
          'https://fotos15.apinmo.com/5106/21185926/22-3.jpg',
          'https://fotos15.apinmo.com/5106/21185926/22-4.jpg',
          'https://fotos15.apinmo.com/5106/21185926/22-5.jpg',
          'https://fotos15.apinmo.com/5106/21185926/22-6.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: 'Sant Honorat, 46'
        },
        oks: ['Dimensions menjador, cuina i habitacions'],
        kos: ['Instal.lació elèctrica', 'Acabats reforma', 'Qualitat sostre terrat'],
        price: 310000,
        visitStatus: 'visited',
        score: 5
      },
      { 
        id: uuidv4(),
        title: 'Av. Flors',
        agency: 'Happy Expat',
        url: 'https://www.idealista.com/inmueble/108261779/',
        urlImages: [
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/1e/75/d1/1338834203.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-P/0/id.pro.es.image.master/18/99/d5/1338834241.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-P/0/id.pro.es.image.master/cd/81/75/1338834284.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-P/0/id.pro.es.image.master/68/85/ac/1338834266.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-P/0/id.pro.es.image.master/1b/ba/ba/1338834304.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: 'Av. de les Flors, 16'
        },
        oks: [
          'Distribució i qualitat acabats',
          'Lluminositat',
          'Ubicació',
          'Preu'
        ],
        kos: [
          'Desaigüe pati'
        ],
        price: 295000,
        visitStatus: 'visited',
        score: 9
      },
      { 
        id: uuidv4(),
        title: 'Pau Casals',
        agency: '4You Properties',
        url: 'https://www.idealista.com/inmueble/108010309/',
        urlImages: [
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/db/e5/e2/1331096003.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/3f/04/7a/1331095986.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/8e/00/18/1331096007.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/28/e9/d2/1331095990.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/5c/61/4f/1331096001.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: 'C/ Pau Casals, 10'
        },
        oks: [],
        kos: [],
        price: 295000,
        visitStatus: 'pending'
      },
      { 
        id: uuidv4(),
        title: 'Àtic Poble Sec',
        agency: 'Particular (Montse)',
        url: 'https://www.idealista.com/inmueble/108669410/',
        urlImages: [
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-P/0/id.pro.es.image.master/b5/1d/78/1351668237.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/f3/7a/e8/1351670860.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: '?'
        },
        oks: [],
        kos: [],
        price: 295000,
        visitStatus: 'pending'
      },
      { 
        id: uuidv4(),
        title: '2on Poble Sec',
        agency: 'Happy Expat',
        url: 'https://www.idealista.com/inmueble/107989782/',
        urlImages: [
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-P/0/id.pro.es.image.master/2b/7a/2f/1330826491.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/6f/73/d4/1330415408.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/28/09/5d/1330415504.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/b5/2b/2a/1330414994.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-P/0/id.pro.es.image.master/26/f9/aa/1330415492.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-P/0/id.pro.es.image.master/47/c2/b2/1330415493.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: '?'
        },
        oks: [],
        kos: [],
        price: 310000,
        visitStatus: 'pending'
      },
      { 
        id: uuidv4(),
        title: 'Cases Noves 2',
        agency: 'Living Group Sitges',
        url: 'https://livingsitges.com/propiedad/luminoso-piso-exterior-con-vistas-al-mar-a-un-paso-de-la-playa-y-el-centro-ref12-vsit2363-24791197/',
        urlImages: [
          'https://fotos15.apinmo.com/1087/24791197/5-1.jpg',
          'https://fotos15.apinmo.com/1087/24791197/5-2.jpg',
          'https://fotos15.apinmo.com/1087/24791197/5-3.jpg',
          'https://fotos15.apinmo.com/1087/24791197/5-8.jpg',
          'https://fotos15.apinmo.com/1087/24791197/5-10.jpg',
          'https://fotos15.apinmo.com/1087/24791197/5-15.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: '?'
        },
        oks: [],
        kos: [],
        price: 235000,
        visitStatus: 'discarted'
      },
      { 
        id: uuidv4(),
        title: 'C/ Floreal',
        agency: 'Roig Pañella / Maricel',
        url: 'https://www.idealista.com/inmueble/106530481/',
        urlImages: [
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/75/a4/c5/1285663990.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/f8/4c/97/1310179582.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/84/13/61/1285664074.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/c7/6c/12/1285663907.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/02/b0/df/1285664079.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/b8/19/c4/1285664096.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/11/50/45/1285664100.jpg',
          'https://img4.idealista.com/blur/WEB_DETAIL-XL-L/0/id.pro.es.image.master/6a/79/f4/1285664102.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: 'C/ Floreal'
        },
        oks: ['Orientació', 'Ubicació'],
        kos: ['Cuina diminuta'],
        price: 265000,
        visitStatus: 'visited',
        score: 7
      },
      { 
        id: uuidv4(),
        title: 'Apartamento cercano al centro en Centre Sitges',
        agency: 'Finques Vallpineda',
        url: 'https://www.habitaclia.com/i19202004337189',
        urlImages: [
          'https://images.habimg.com/imgh/19202-4337189/apartamento-cercano-al-centro-sitges_c615916e-1be9-4b23-bf95-8140708c9f9eXL.jpg',
          'https://images.habimg.com/imgh/19202-4337189/apartamento-cercano-al-centro-sitges_538293ea-9631-456d-8793-61e75926cc90XL.jpg',
          'https://images.habimg.com/imgh/19202-4337189/apartamento-cercano-al-centro-sitges_caf7eec5-c90f-4d9f-8336-8f93ee8abb8aXL.jpg',
          'https://images.habimg.com/imgh/19202-4337189/apartamento-cercano-al-centro-sitges_ba27a455-908c-4455-9511-d0c0fbe24136G.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: ''
        },
        oks: [],
        kos: [],
        price: 239000,
        visitStatus: 'pending',
        score: undefined
      },
      { 
        id: uuidv4(),
        title: 'Piso típico a un paso del mar! en Centre Sitges',
        agency: 'Inedith',
        url: 'https://www.habitaclia.com/comprar-piso-tipico_de_a_un_paso_del_mar_centre-sitges-i24138004037984.htm?pag=2&hab=99&m2=0&pmax=99999999&st=piso-duplex-casa-apartamento-torre-atico-masia-loft-casa_pareada-estudio-casa_adosada-planta_baja-triplex-chalet&f=&geo=p&from=list&lo=55',
        urlImages: [
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_8e6c9214-b070-4449-90cf-f816ff8957bbXL.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_3c6f8478-ad91-4844-830a-662ffecb02beXL.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_e8c22330-a95f-4129-b6f0-5912fe969a5cXL.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_96ea1ab6-1371-4d4b-b692-00c904dcc82bG.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_5f6e7954-9ed5-4bb1-aa21-083c8207dabfG.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_8ff7e206-fa74-40d1-906c-9b5c38fc39c7G.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_0ff57f99-8f90-449a-bc75-cfe3c784cfa1G.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_012ae5db-d401-431e-88a9-1b52371cdf19G.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_5be7a930-a202-478c-918c-ec7ff61d3afaXL.jpg',
          'https://images.habimg.com/imgh/24138-4037984/piso-tipico-de-sitges-a-un-paso-del-mar-sitges_1d40a4a4-7ec2-4b97-ad84-1cb88f149fa5XL.jpg'
        ],
        locationInfo: {
          location: 'Sitges',
          address: 'C/ Carreta'
        },
        oks: [],
        kos: [],
        price: 285000,
        visitStatus: 'pending',
        score: undefined
      }
    ] as HomeInterface[];
  }

  loadHomes(): Observable<HomeInterface[]> {
    localStorage.removeItem(this.localStorageKey);
    const storedHomesStr = localStorage.getItem(this.localStorageKey);
    if (storedHomesStr!=null) {
      return of(JSON.parse(storedHomesStr) as HomeInterface[]);
    }
    return of(this.getHomes());
  }

  saveHomes(homes: HomeInterface[]): Observable<boolean> {
    localStorage.setItem(this.localStorageKey, JSON.stringify(homes));
    return of (true);
  }

  static getColorFromValue(value: number): string {
    // Clamp value between 0 and 10
    const clampedValue = Math.max(0, Math.min(10, value));
    
    // Convert 0–10 to a 0–1 scale
    const t = clampedValue / 10;
  
    // Interpolate between red (255,0,0) and green (0,128,0)
    const r = Math.round(255 * (1 - t));
    const g = Math.round(128 * t);
    const b = 0;
  
    // Convert to hex
    return '#' + this.toHex(r) + this.toHex(g) + this.toHex(b);
  }
  
  static toHex(value: number): string {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  static getRatingColor(rating: number): string {
    // Asegura que el rating esté entre 0 y 10
    const value = Math.max(0, Math.min(10, rating));
  
    // Interpolación lineal de color: rojo (255,0,0) → verde (0,255,0)
    const red = Math.round(255 - (value * 25.5));
    const green = Math.round(value * 25.5);
  
    // Devuelve en formato RGB (puedes cambiar a HEX si prefieres)
    return `rgb(${red}, ${green}, 0)`;
  }

  static newId(): string {
    return '';
  }
}
