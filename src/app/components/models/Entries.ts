export class EntriesModel {
    /**
    * @ignore
    */
    public id: number;
    /**
    * @ignore
    */
    public ean: string;
    /**
    * @ignore
    */
    public timeScan: string;
    /**
    * @ignore
    */
    public isSelected: boolean;
    /**
    * @ignore
    */
    public listEans: EntriesInterface[];

    constructor() { }

    initRecord() {
        this.id = null;
        this.ean = null;
        this.timeScan = null;
        this.isSelected = false;
        this.listEans = [];
    }

    public getId(): number {
        return this.id;
    }
    public setId(id: number) {
        this.id = id;
    }
    public getEan(): string {
        return this.ean;
    }
    public setEan(ean: string) {
        this.ean = ean;
    }
    public getTimeScan(): string {
        return this.timeScan;
    }
    public setTimeScan(timeScan: string) {
        this.timeScan = timeScan;
    }
    public getIsSelected(): boolean {
        return this.isSelected;
    }
    public setIsSelected(isSelected: boolean) {
        this.isSelected = isSelected;
    }

    /**
    * Método que permite convertir el objeto userData a una instancia de este modelo de datos
    * con la finalidad de construir la entrada (request) de endpoints
    * 
    * @param registro 
    */
    cloneData(registro: any) {
        if (registro != null) {
            if ((registro.id != null) && (registro.id != undefined)) {
                this.id = registro.id;
            }
            if ((registro.ean != null) && (registro.ean != undefined)) {
                this.ean = registro.ean;
            }
            if ((registro.timeScan != null) && (registro.timeScan != undefined)) {
                this.timeScan = registro.timeScan;
            }
            if ((registro.isSelected != null) && (registro.isSelected != undefined)) {
                this.isSelected = registro.isSelected;
            }
            if ((registro.listEans != null) && (registro.listEans != undefined)) {
                this.listEans = registro.listEans;
            }
        }
    }

}

export class EntriesInterface {
    id: number;
    idReference: number;
    type: number;
    ean: string;
    timeScan: string;
    isSelected: boolean;
    createdOn: string;
    lastUpdate: string;
}