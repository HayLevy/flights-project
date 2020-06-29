import { Destination } from './destination.model';

export interface Flight {
    id: String,
    takeoff: String, 
    landing: String,
    price: Number, 
    destination: Destination
}
