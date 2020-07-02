import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DatePipe } from '@angular/common'

import { EansHeaderInterface } from 'src/app/components/models/EansHeader';
import { EntriesModel, EntriesInterface } from 'src/app/components/models/Entries';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  private storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private entriesList = new BehaviorSubject([]);

  public entriesSize: number = 0;
  public entriesSizeToShow: string = null;

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    public datePipe: DatePipe
  ) {

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'scandit_db.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          console.log('this.storage', this.storage);
          // this.deleteMngTable();
          this.createMngTable();
          // this.loadDataDb();
        });
    });

  }

  /**
  * Método utilizado para conocer el estado de la base de datos 
  *
  * @returns Retorna void
  */
  dbState() {
    return this.isDbReady.asObservable();
  }
  fetchEntries(): Observable<EntriesModel[]> {
    return this.entriesList.asObservable();
  }

  async initService() {
    console.log('Initializing persistence service');
    await console.log('Persistence service initialized');
    return true;
  }

  /**
  * Método utilizado para cargar los datos de la persistencia
  *
  * @returns Retorna void
  */
  loadDataDb() {
    this.getEntries();
  }


  /**
  * Método utilizado para crear la entidad monitora de la base de datos
  *
  * @returns void
  */
  createMngTable() {
    this.storage.executeSql('CREATE TABLE IF NOT EXISTS managerdb (id INTEGER PRIMARY KEY, versiondb integer, syncdb integer, lastPage TEXT, printerLabel TEXT, printerValue TEXT, productsDate varchar(20), productsAmount integer)', [])
      .then((res) => {
        console.log('Persistence Created', res);
        this.storage.executeSql('SELECT * FROM managerdb', [])
          .then(res1 => {
            if (res1.rows.length == 0) {
              let data = [0, 0, 'login', 'cable', 'cable', '', 0];
              this.storage.executeSql('INSERT INTO managerdb (versiondb, syncdb, lastPage, printerLabel, printerValue, productsDate, productsAmount ) VALUES (?, ?, ?, ?, ?, ?, ?)', data)
                .then(res2 => {
                  console.log('Managerdb Created', res2);
                  this.updateDatabaseVersion();
                });
            } else {
              console.log('Managerdb existing', res1);
              this.updateDatabaseVersion();
            }
          });
      })
      .catch(e => {
        console.log("Error creating managerdb " + JSON.stringify(e))
      });
  }

  /**
  * Método utilizado para actualizar la versión de la base de datos 
  *
  * @returns Retorna void
  */
  updateDatabaseVersion() {
    let newDbVersion = environment.versionDB;
    //console.log('newDbVersion', newDbVersion);
    this.storage.executeSql('SELECT * FROM managerdb', [])
      .then(res => {
        if (res.rows.length > 0) {
          for (var i = 0; i < 1; i++) {
            let actualversiondb = res.rows.item(i).versiondb;
            // actualversiondb = 0; // temporally
            console.log('actualversiondb', actualversiondb);
            console.log('newDbVersion', newDbVersion);
            if (newDbVersion > actualversiondb) {
              this.dropTables();
              this.createTables();
              this.storage.executeSql('UPDATE managerdb SET versiondb = ?', [newDbVersion])
                .then(data => {
                  // this.populateData();
                  this.loadDataDb();
                })
                .catch(error => { console.log('Error', error) })
            } else {
              // this.populateData();
              this.loadDataDb();
            }
          }
        }
      });
  }

  /**
  * Método utilizado para crear todas las entidades gestoras de la base de datos
  *
  * @returns void
  */
  createTables() {
    this.storage.executeSql('CREATE TABLE IF NOT EXISTS eansheader (id INTEGER PRIMARY KEY, type integer, idReference integer, ean text, timeScan varchar(20), createdOn varchar(20), lastUpdate varchar(20), UNIQUE(type, idReference, ean) ) ', [])
      .then(() => {
        //alert('Table entries Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });

    this.storage.executeSql('CREATE TABLE IF NOT EXISTS listeans (id INTEGER PRIMARY KEY, type integer, idReference integer, ean varchar(20), timeScan varchar(20), createdOn varchar(20), lastUpdate varchar(20) )', [])
      .then(() => {
        //alert('Table listeans Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  /**
  * Método utilizado para eliminar todas las entidades gestoras de la base de datos
  *
  * @returns void
  */
  dropTables() {
    this.storage.executeSql('DROP TABLE IF EXISTS eansheader', []).then(() => {
      //alert('Table entriesheader Dropped!');
    })
      .catch(e => {
        //alert("error " + JSON.stringify(e))
      });
    this.storage.executeSql('DROP TABLE IF EXISTS entries', []).then(() => { //Temporaly
      //alert('Table entries Dropped!');
    })
      .catch(e => {
        //alert("error " + JSON.stringify(e))
      });
  }

  /************************************ Toolkits Section ***********************************/

  /**
  * Método utilizado para eliminar multiples registros Outputs  
  * 
  * @param {number} inputAmount cantidad que se desea convertir
  * 
  * @returns string
  */
  codeNumberToShow(inputAmount: number) {
    let resultAmount: string;
    if (inputAmount > 1000) {
      inputAmount = (inputAmount / 1000);
      resultAmount = Math.floor(inputAmount).toString();
      return resultAmount + 'k';
    } else {
      resultAmount = inputAmount.toString();
      return resultAmount;
    }
  }

  /******************************* Entries Section *****************************/

  /**
  * Método utilizado para obtener todos los registros existente en la entidad Entries 
  *
  * @returns Retorna una lista de datos en formato Array con estructura Entries
  */
  getEntries() {
    let type = 0;
    return this.storage.executeSql('SELECT * FROM eansheader where type = ? order by id DESC', [type]).then(res => {
      let items: EansHeaderInterface[] = [];
      this.entriesSize = res.rows.length;
      this.entriesSizeToShow = this.codeNumberToShow(this.entriesSize);
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            type: res.rows.item(i).type,
            idReference: res.rows.item(i).idReference,
            ean: res.rows.item(i).ean.toString(),
            timeScan: res.rows.item(i).timeScan,
            listEans: this.decodeEansList(0, res.rows.item(i).id),
            isSelected: false,
            createdOn: res.rows.item(i).createdOn,
            lastUpdate: res.rows.item(i).lastUpdate
          });
        }
      }
      this.entriesList.next(items);
    });
  }


  /**
  * Método utilizado para obtener un registro Entries dado un Id 
  *
  * @param {number} id Numero identificador de la entidad Entries
  * @returns Retorna un registro con estructura Entries coincidente con el id sumunistrado
  */
  getEntriesById(id): Promise<EansHeaderInterface> {
    return this.storage.executeSql('SELECT * FROM eansheader where type = ? order by lastUpdate DESC', [id]).then(res => {
      return {
        id: res.rows.item(0).id,
        type: res.rows.item(0).type,
        idReference: res.rows.item(0).idReference,
        ean: res.rows.item(0).ean,
        timeScan: res.rows.item(0).timeScan,
        listEans: this.decodeEansList(0, res.rows.item(0).id),
        isSelected: false,
        createdOn: res.rows.item(0).createdOn,
        lastUpdate: res.rows.item(0).lastUpdate
      }
    });
  }


  /**
  * Método utilizado para adicionar multiples registros Entries  
  *
  * @param {EntriesModel[]} entriesList lista de tipo Entries que se desea agregar
  * @returns void
  */
  addMultiEntries(entriesList: EntriesModel[]) {
    let entriesListTmp = entriesList;
    for (let entriesRecord of entriesListTmp) {
      this.addEntries(entriesRecord);
    }
  }


  /**
  * Método utilizado para adicionar un registro Entries  
  *
  * @param {EntriesModel} entriesRecord registro de tipo Entries que se desea agregar
  * @returns void
  */
  addEntries(entriesRecord: EntriesModel) {
    this.codeEansHeaderList(0, 0, entriesRecord, false);
  }


  /**
* Método utilizado para reducir la lista de eans de tipo entries en las entidades eansheader y listeans
*
* @param {number} idReference Numero identificador de la entidad Eansheader
* @returns void
*/
  reduceEntries(idReference: number) {
    this.reduceEansList(0, idReference);
  }

  /**
  * Método utilizado para reducir un registros EansList  
  *
  * @param {number} type tipo de asociación 0=Entries, 1=Outputs, 2= Inventories
  * @param {number} idRefence Id de Outputs ó Inventories según sea el caso
  * 
  * @returns boolean
  */
  reduceEansList(type: number, idReference: number): boolean {
    let data = [type, idReference]
    this.storage.executeSql('SELECT id, ean, timeScan, createdOn, lastUpdate FROM listeans where type = ? and idReference = ? order by id Desc', data)
      .then(res => {
        console.log('res1 - reduceEansList', JSON.stringify(res));
        if (res.rows.length > 0) {
          let data1 = [res.rows.item(0).id]
          this.storage.executeSql('DELETE FROM listeans WHERE id = ?', data1)
            .then(data => {
              this.getEntries();
            });
        }
        if (res.rows.length == 1) {
          let data2 = [idReference]
          this.storage.executeSql('DELETE FROM eansheader WHERE id = ?', data2)
            .then(data => {
              console.log('res1 - reduceEansList', JSON.stringify(data));
              this.getEntries();
            });
        }
      });
    return true;
  }

  /**
  * Método utilizado para eliminar multiples registros Entries  
  *
  * @param {EntriesModel[]} entriesList registro de tipo Entries que se desea agregar
  * @returns void
  */
  deleteMultiEntries(entriesList: EntriesModel[]) {
    let entriesListTmp = entriesList;
    for (let entriesRecord of entriesListTmp) {
      this.deleteEntries(entriesRecord.id);
    }
  }


  /**
  * Método utilizado para dar de baja un registro Entries dado un Id 
  *
  * @param {number} id Numero identificador de la entidad Entries
  * @returns void
  */
  deleteEntries(id) {
    return this.storage.executeSql('DELETE FROM eansheader WHERE id = ?', [id])
      .then(data => {
        this.codeEansList(0, id, [], true);
        this.getEntries();
        return data;
      })
      .catch((error) => {
        console.log('Error deleteEntries ', JSON.stringify(error));
        this.codeEansList(0, id, [], true);
        return null;
      });
  }


  /**
  * Método utilizado para limpiar la entidad Entries 
  *
  * @returns void
  */
  async emptyEntries() {
    let type = 0;
    let data = [type];
    await this.storage.executeSql('DELETE FROM listeans WHERE type = ?', data)
      .then(resp => {
        this.getEntries();
      });
    await this.storage.executeSql('DELETE FROM eansheader where type =?', data)
      .then(data => {
        this.getEntries();
      }).catch(error => {
        console.log('error-emptyEansheader', error);
        this.getEntries();
      });
  }


  /***************************** Code/Decode EansHeaderList ***************************/

  /**
  * Método utilizado para eliminar multiples registros EansHeader  
  *
  * @param {number} type tipo de asociación 1=Outputs, 2= Inventories
  * @param {number} idRefence Id de Outputs ó Inventories según sea el caso
  * 
  * @returns EntriesInterface[]
  */
  decodeEansHeaderList(type: number, idReference: number): EansHeaderInterface[] {
    let items: EansHeaderInterface[] = [];
    this.storage.executeSql('SELECT id, type, idReference, ean, timeScan, createdOn, lastUpdate FROM eansheader where type = ? and idReference = ?', [type, idReference])
      .then(res => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push({
              id: res.rows.item(i).id,
              type: res.rows.item(i).type,
              idReference: res.rows.item(i).idReference,
              ean: res.rows.item(i).ean,
              timeScan: res.rows.item(i).timeScan,
              listEans: this.decodeEansList(type, res.rows.item(i).id),
              isSelected: false,
              createdOn: res.rows.item(i).createdOn,
              lastUpdate: res.rows.item(i).lastUpdate
            });
          }
        }
      });
    return items;
  }

  /**
  * Método utilizado para eliminar multiples registros Outputs  
  * 
  * @param {number} type tipo de asociación 1=Outputs, 2= Inventories
  * @param {number} idRefence Id de Outputs ó Inventories según sea el caso
  * @param {EntriesInterface[]} listEans lista de tipo Outputs que se desea actualizar
  * 
  * @returns void
  */
  codeEansHeaderList(type: number, idReference: number, entriesRecord: EntriesModel, typeOperation: boolean) {
    let createdOn = this.datePipe.transform(new Date(), "dd/MM HH:mm") + 'h';
    let data = [type, idReference, entriesRecord.ean, createdOn, createdOn, createdOn];

    console.log('entriesRecord', entriesRecord)

    this.storage.executeSql('INSERT INTO eansheader (type, idReference, ean, timeScan, createdOn, lastUpdate ) VALUES (?, ?, ?, ?, ?, ?)', data)
      .then(resultInsert => {
        this.codeEansList(type, resultInsert.insertId, [entriesRecord], typeOperation);
      })
      .catch((error) => {
        this.storage.executeSql('SELECT * FROM eansheader where ean = ? and type = ? and idReference = ? ;', [entriesRecord.ean, type, idReference])
          .then(resultData => {
            console.log('resultData', resultData)
            for (var i = 0; i < 1; i++) {
              this.codeEansList(type, resultData.rows.item(i).id, [entriesRecord], typeOperation);
            }
          });
      });

  }

  /******************************* Code/Decode EansList *****************************/

  /**
  * Método utilizado para eliminar multiples registros EansList  
  *
  * @param {number} type tipo de asociación 0=Entries, 1=Outputs, 2= Inventories
  * @param {number} idRefence Id de Entries, Outputs ó Inventories según sea el caso
  * 
  * @returns EntriesInterface[]
  */
  decodeEansList(type: number, idReference: number): EntriesInterface[] {
    let items: EntriesInterface[] = [];
    this.storage.executeSql('SELECT id, idReference, type, ean, timeScan, createdOn, lastUpdate FROM listeans where type = ? and idReference = ?', [type, idReference])
      .then(res => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push({
              id: res.rows.item(i).id,
              idReference: res.rows.item(i).idReference,
              type: res.rows.item(i).type,
              ean: res.rows.item(i).ean,
              timeScan: res.rows.item(i).timeScan,
              isSelected: false,
              createdOn: res.rows.item(i).createdOn,
              lastUpdate: res.rows.item(i).lastUpdate
            });
          }
        }

      });
    return items;
  }

  /**
  * Método utilizado para eliminar multiples registros Outputs  
  * 
  * @param {number} type tipo de asociación 1=Outputs, 2= Inventories
  * @param {number} idRefence Id de Outputs ó Inventories según sea el caso
  * @param {EntriesInterface[]} listEans lista de tipo Outputs que se desea actualizar
  * 
  * @returns void
  */
  codeEansList(type: number, idReference: number, listEans: EntriesModel[], typeOperation: boolean) {
    if (typeOperation) {
      let data = [type, idReference];
      this.storage.executeSql('DELETE FROM listeans WHERE type = ? and idReference = ?', data)
        .then(resp => {
          this.getEntries();
        })
        .catch((error) => {
          this.getEntries();
        });
    }
    for (let eanRecord of listEans) {
      let fullDate = new Date();
      let createdOn = this.datePipe.transform(fullDate, "dd/MM HH:mm") + 'h';
      let data = [type, idReference, eanRecord.ean, createdOn, createdOn, createdOn];
      this.storage.executeSql('INSERT INTO listeans ( type, idReference, ean, timeScan, createdOn, lastUpdate ) VALUES (?, ?, ?, ?, ?, ?)', data)
        .then(res => {
          this.getEntries();
        })
        .catch((error) => {
          this.getEntries();
        });
    }
  }

}
