import { Component } from '@angular/core';
import { Package } from '../models/package';
import { DatabaseService } from '../database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-packages',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-packages.component.html',
  styleUrls: ['./add-packages.component.css'] // Corrected to styleUrls
})
export class AddPackagesComponent {
 // Package properties
 package_title: string = '';
 package_weight: number = 0;
 package_destination: string = '';
 description: string = '';
 isAllocated: boolean = false;
 driver_id: string | null = null;

 constructor(
   private packageService: DatabaseService,
   private router: Router
 ) {}
 onSubmit() {
  // Create a new package instance
  const newPackage = new Package(
    this.package_title,
    this.package_weight,
    this.package_destination,
    this.description,
    this.isAllocated,
    this.driver_id
  );

  // Validate the package before submission
  if (!this.isValidPackage(newPackage)) {
    this.router.navigate(['/error']); // Navigate to invalid data component if validation fails
  } else {
    // Validate driver ID if it's provided
    if (this.driver_id) {
      this.packageService.getDriverByIdFromDriverId(this.driver_id).subscribe(
        (existingDriver: any) => {
          
          if (!existingDriver) {
            this.router.navigate(['/error']); // If driver is invalid, redirect to error page
            return;
          }
          // If driver is valid, proceed to add the package
          this.addNewPackage(newPackage, existingDriver._id); // Pass the MongoDB driver ID
        },
        (error) => {
          console.error('Driver not found:', error); // Log error
          this.router.navigate(['/error']); // Redirect to error if driver is not found
        }
      );
      
    } else {
      // If no driver_id is provided, add the package directly
      this.addNewPackage(newPackage, null); // Pass null if no driver ID
    }
  }
}

// Method to add a new package using the package service
addNewPackage(newPackage: Package, driverId: string | null) {
  // Assign the MongoDB driver ID to the package before sending to the backend
  if (driverId) {
    newPackage.driver_id = driverId; // Set the driver_id to MongoDB ID
  }

  this.packageService.addPackage(newPackage).subscribe({
    next: () => {
      this.router.navigate(['/list-packages']); // Redirect to the list of packages on success
    },
    error: (err) => {
      console.error('Error adding package:', err);
      this.router.navigate(['/error']); // Redirect to error page if package addition fails
    }
  });
}

// Custom validation method for the package
isValidPackage(packageData: Package): boolean {
  // Validate package title: alphanumeric, between 3 and 15 characters
  const validTitle = /^[A-Za-z0-9]{3,15}$/.test(packageData.package_title);

  // Validate package weight: positive non-zero number
  const validWeight = packageData.package_weight > 0;

  // Validate package destination: alphanumeric, between 5 and 15 characters
  const validDestination = /^[A-Za-z0-9]{5,15}$/.test(packageData.package_destination);

  return validTitle && validWeight && validDestination ;
}
}