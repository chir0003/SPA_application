import { Component, OnInit } from '@angular/core';
import { Driver } from '../models/Driver';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpperCasePipe } from '../upper-case.pipe';

@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [FormsModule, CommonModule,UpperCasePipe],
  templateUrl: './list-drivers.component.html',
  styleUrls: ['./list-drivers.component.css'] 
})
export class ListDriversComponent implements OnInit { 
  driverId: string = '';
  message: string = '';
  isSuccess: boolean = false;

  fleet: Driver[] = []; 

  constructor(private driverService: DatabaseService, private router: Router) {}

  ngOnInit(): void { 
    this.message = ''; 
    this.isSuccess = false; 
  
    this.driverService.getDrivers().subscribe((data: Driver[]) => { 
      this.fleet = data; 
    }, (error) => {
      console.error("Error loading drivers:", error); 
    });
  }
  

  onDelete(driverId: string) {
    // Fetch the driver using the driver ID to get the MongoDB Object ID
    this.driverService.getDriverByIdFromDriverId(driverId).subscribe(
      (driver: any) => {
        if (driver) {
          // If driver exists, retrieve the MongoDB Object ID and delete the driver
          const mongoDbId = driver._id; // MongoDB Object ID
  
          this.driverService.deleteDriver(mongoDbId).subscribe(() => {
            this.message = 'Driver deleted successfully.';
            this.isSuccess = true;
  
            // Refresh the list after deletion
            this.driverService.getDrivers().subscribe((data: Driver[]) => {
              this.fleet = data; // Update the fleet list
            });
  
            // Redirect after a short delay 
            setTimeout(() => {
              // Reset message and success flag
              this.message = '';
              this.isSuccess = false;
  
              // Navigate to the list-drivers page
              this.router.navigate(['/list-drivers']);
            }, 2000);
          });
        } else {
          
          this.message = 'Driver not found.';
          this.isSuccess = false;
        }
      },
      (error) => {
        
        this.message = 'Error occurred while fetching driver.';
        this.isSuccess = false;
      }
    );
  }

  
}
  
