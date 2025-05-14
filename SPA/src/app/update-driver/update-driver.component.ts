import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { Driver } from '../models/Driver';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-update-driver',
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorComponent],
  templateUrl: './update-driver.component.html',
  styleUrl: './update-driver.component.css'
})
export class UpdateDriverComponent {

  driver: Driver = new Driver(); // Initialize the driver object
  errorMessage: string | null = null;

  constructor(private driverService: DatabaseService, private router: Router) {}

  // Method to validate the driver license format
  validateDriverLicence(licence: string): boolean {
    const alphanumericPattern = /^[a-zA-Z0-9]{5}$/;
    return alphanumericPattern.test(licence);
  }

  // This method will be triggered when the form is submitted
  onSubmit(): void {
    // First, validate the driver license before proceeding
    if (!this.validateDriverLicence(this.driver.driver_licence)) {
      // If validation fails, redirect to the error page
      this.router.navigate(['/error']);
      return;
    }

    // Fetch driver details by driver ID
    this.driverService.getDriverByIdFromDriverId(this.driver.driver_id).subscribe(
      (existingDriver:any) => {
        if (!existingDriver) {
          // If driver is not found, redirect to the error page
          this.router.navigate(['/error']);
          return;
        }

        // If driver is found, proceed with the update
        const updatedDriverData = {
          id: existingDriver._id,  // Send MongoDB's driver id
          driver_licence: this.driver.driver_licence, // New license value
          driver_department: this.driver.driver_department // New department value
        };

        // Call the updateDriver method with the MongoDB _id and updated data
        this.driverService.updateDriver(existingDriver._id, updatedDriverData).subscribe(
          (updatedDriver) => {
            console.log('Driver updated successfully:', updatedDriver);
            this.router.navigate(['/list-drivers']); // Redirect to the list of drivers
          },
          (error) => {
            console.error('Error updating driver:', error);
            this.router.navigate(['/error']); // Redirect to error page if update fails
          }
        );
      },
      (error) => {
        console.error('Driver not found:', error);
        this.router.navigate(['/error']); // Redirect to error page if driver is not found
      }
    );
  }
}
