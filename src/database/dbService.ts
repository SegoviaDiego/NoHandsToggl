import { ipcRenderer } from 'electron';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'

export default class DatabaseService {
    static getSettings(){
        return of(ipcRenderer.sendSync('get-settings'))
            .pipe(
                catchError((error: any) => Observable.throw(error.json))
            );
    }

    static saveSettings(settings: any){
        return of(ipcRenderer.sendSync('save-settings', settings))
            .pipe(
                catchError((error: any) => Observable.throw(error.json))
            );
    }
}