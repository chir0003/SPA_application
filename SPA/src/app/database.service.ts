import { HttpClient, HttpHeaders ,HttpClientModule} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver } from './models/Driver';
import { Observable } from 'rxjs';
import { Package } from './models/package';



const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
 
  private apiUrl = 'http://localhost:8080/34073604/chirag/api/v1/drivers';
  private apiUrl2 = 'http://localhost:8080/34073604/chirag/api/v1/packages';
  
  constructor(private http:HttpClient) { }

  addDriver(driver: any) {
    return this.http.post(`${this.apiUrl}/add`, driver,);
  }

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.apiUrl}/`);
  }

  getDriverByIdFromDriverId(driverId: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/driverid/${driverId}`, httpOptions);
  }

  getDriverByIdFromMongoId(driverId: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/driverMongoid/${driverId}`, httpOptions);
  }

  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateDriver(id: string, driver: any): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/update`, driver);
  }


  addPackage(newPackage: Package): Observable<Package> {
    return this.http.post<Package>(`${this.apiUrl2}/add`, newPackage);
  }

  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.apiUrl2}/`);
  }

  getPackageByIdFromPackageId(packageId: string): Observable<any> {
    return this.http.get(`${this.apiUrl2}/getByPackageId/${packageId}`);
  }
  deletePackage(packageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl2}/${packageId}`);
  }

  updatePackage(id: string, newPackage:any):Observable<Package>{
    return this.http.put<Package>(`${this.apiUrl2}/update`, newPackage);
  }


  getStatistics(): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/34073604/chirag/counters`);
  }

  
}
