export interface Division {
    id: string;
    name: string;
}

export interface LocationParams {
    page?: number; // defaults to 1
    limit?: number; // defaults to 10
}

export interface District {
    id: string;
    name: string;
    divisionId: string;
}

export interface City {
    id: string;
    name: string;
    districtId: string;
}
