import { Flight } from './flight.model';

export interface Order {
    flight: Flight,
    quantity: number
}
