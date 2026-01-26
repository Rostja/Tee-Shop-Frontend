export class Address {
    street: string;
    city: string;
    region: string;
    country: string;
    zipCode: string;

    constructor(street: string, city: string, region: string, country: string, zipCode: string) {
        this.street = street;
        this.city = city;
        this.region = region;
        this.country = country;
        this.zipCode = zipCode;
    }
}
