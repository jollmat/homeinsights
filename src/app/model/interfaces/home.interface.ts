import { HomeGenericInfoInterface } from "./home-generic-info.interface";
import { HomeLocationInfoInterface } from "./home-location-info.interface";

export type VisitStatus = 'pending' | 'visited' | 'discarted';

export interface HomeInterface {
    id: string,
    title: string,
    agency: any,
    url?: string,
    urlImages?: string[],
    genericInfo?: HomeGenericInfoInterface,
    locationInfo?: HomeLocationInfoInterface,
    techInfo?: HomeGenericInfoInterface,
    oks: string[],
    kos: string[],
    price: number,
    visitStatus: VisitStatus,
    score?: number
}