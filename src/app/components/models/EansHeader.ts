import { EntriesModel, EntriesInterface } from './Entries';

export class EansHeaderModel {
    /**
    * @ignore
    */
    public id: number;
    /**
    * @ignore
    */
    public type: number;
    /**
    * @ignore
    */
    public idReference: number;
    /**
    * @ignore
    */
    public ean: string;
    /**
    * @ignore
    */
    public listEans: EntriesInterface[];
    /**
    * @ignore
    */
    public isSelected: boolean;
    /**
    * @ignore
    */
    public createdOn: string;
    /**
    * @ignore
    */
    public lastUpdate: string;

    constructor() { }

    initRecord() {
        this.id = null;
        this.type = null;
        this.idReference = null;
        this.ean = null;
        this.isSelected = false;
        this.createdOn = null;
        this.lastUpdate = null;
    }

    public getId(): number {
        return this.id;
    }
    public setId(id: number) {
        this.id = id;
    }
    public getType(): number {
        return this.type;
    }
    public setType(type: number) {
        this.type = type;
    }
    public getIdReference(): number {
        return this.idReference;
    }
    public setIdReference(idReference: number) {
        this.idReference = idReference;
    }    
    public getEan(): string {
        return this.ean;
    }
    public setEan(ean: string) {
        this.ean = ean;
    }
    public getIsSelected(): boolean {
        return this.isSelected;
    }
    public setIsSelected(isSelected: boolean) {
        this.isSelected = isSelected;
    }
    public getcreatedOn(): string {
        return this.createdOn;
    }
    public setCreatedOn(createdOn: string) {
        this.createdOn = createdOn;
    }
    public getLastUpdate(): string {
        return this.lastUpdate;
    }
    public setLastUpdate(lastUpdate: string) {
        this.lastUpdate = lastUpdate;
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
            if ((registro.type != null) && (registro.type != undefined)) {
                this.type = registro.type;
            }
            if ((registro.idReference != null) && (registro.idReference != undefined)) {
                this.idReference = registro.idReference;
            }            
            if ((registro.ean != null) && (registro.ean != undefined)) {
                this.ean = registro.ean;
            }
            if ((registro.isSelected != null) && (registro.isSelected != undefined)) {
                this.isSelected = registro.isSelected;
            }
            if ((registro.createdOn != null) && (registro.createdOn != undefined)) {
                this.createdOn = registro.createdOn;
            }
            if ((registro.lastUpdate != null) && (registro.lastUpdate != undefined)) {
                this.lastUpdate = registro.lastUpdate;
            }
        }
    }

}

export class EansHeaderInterface {
    id: number;
    type: number;
    idReference:number;
    ean: string;
    timeScan: string;
    listEans: EntriesInterface[];
    isSelected: boolean;
    createdOn: string;
    lastUpdate: string;
}