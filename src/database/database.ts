import { ipcMain, app, remote } from 'electron';
const   Datastore = require('nedb'),
        path = require('path');

export default class Database {
    static timeEntry: any;
    private static defaultSettings = {
        token: '',
        pingMode: false,
        maxIdleTime: 10,
        showHoursWorkedChart: true,
        showTagsChart: true,
        showProductivityChart: true,
        showHoursWorkedStat: true,
        showIdleTimeStat: true,
        showTagsStat: true,
        timeEntrySetup: {
            wid: null,
            pid: null,
            billable: false,
            description: '',
            tags: []
        }
    }
    
    static startListening(){
        Database.init();
        
        ipcMain.on('get-settings', async (event: any) => {
            try {
                event.returnValue = await Database.getSettings();
            } catch (err) {
                throw err;
            }
        });

        ipcMain.on('save-settings', async (event: any, settings: any) => {
            try {
                await Database.saveSettings(settings);
                event.returnValue = await Database.getSettings();
            } catch (err) {
                throw err;
            }
        });

    }

    static init(){
        if(!Database.timeEntry){
            Database.timeEntry = new Datastore({ filename: Database.getPathToCollection('time-entry'), autoload: true });
        }
    }

    static getPathToCollection(name: string){
        const userDataPath = (app || remote.app).getPath('userData');
        return path.join(userDataPath, `/nedb/${name}.db`);
    }

    static getSettings(){
        return new Promise((resolve, reject)=>{
            Database.timeEntry.findOne({_id: 1}, {}, (err, doc) => {
                if(err) return reject
                if(!doc) return resolve(Database.defaultSettings);
                return resolve({...doc});
            });
        });
    }

    static saveSettings(settings: any){
        return new Promise((resolve, reject)=>{
            Database.timeEntry.findOne({_id: 1}, {}, (err, doc) => {
                if(err) return reject(err);
                if(!doc) {
                    Database.timeEntry.insert({
                        _id: 1,
                        ...settings
                    }, resolve);
                } else {
                    Database.timeEntry.update({ _id: 1 }, settings, resolve);
                }
            });
        });
    }
}

new Database();
Database.init();