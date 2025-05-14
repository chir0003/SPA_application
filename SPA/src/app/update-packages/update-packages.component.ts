import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { Package } from '../models/package';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-update-packages',
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorComponent],
  templateUrl: './update-packages.component.html',
  styleUrl: './update-packages.component.css'
})
export class UpdatePackagesComponent {

  package_title: string = '';
  package_weight: number = 0;
  package_destination: string = '';
  description: string = '';
  isAllocated: boolean = false;
  driver_id: string | null = null;

  package: Package = new Package(
    this.package_title,
    this.package_weight,
    this.package_destination,
    this.description,
    this.isAllocated,
    this.driver_id
  );// Initialize the package object
  errorMessage: string | null = null;

  constructor(private packageService: DatabaseService, private router: Router) {}

  // Method to validate the package destination format
  validatePackageDestination(destination: string): boolean {
    const alphanumericPattern = /^[a-zA-Z0-9]{5,15}$/;
    return alphanumericPattern.test(destination);
  }

  // This method will be triggered when the form is submitted
  onSubmit(): void {
    // First, validate the package destination before proceeding
    if (!this.validatePackageDestination(this.package.package_destination)) {
      // If validation fails, redirect to the error page
      this.router.navigate(['/error']);
      return;
    }

    // Fetch package details by package ID
    this.packageService.getPackageByIdFromPackageId(this.package.package_id).subscribe(
      (existingPackage: any) => {
        if (!existingPackage) {
          // If package is not found, redirect to the error page
          this.router.navigate(['/error']);
          return;
        }

        // If package is found, proceed with the update
        const updatedPackageData = {
          package_id: existingPackage._id,  // Send MongoDB's package id
          package_destination: this.package.package_destination // New destination value
        };

        // Call the updatePackage method with the MongoDB _id and updated data
        this.packageService.updatePackage(existingPackage._id, updatedPackageData).subscribe(
          (updatedPackage) => {
            console.log('Package updated successfully:', updatedPackage);
            this.router.navigate(['/list-packages']); // Redirect to the list of packages
          },
          (error) => {
            console.error('Error updating package:', error);
            this.router.navigate(['/error']); // Redirect to error page if update fails
          }
        );
      },
      (error) => {
        console.error('Package not found:', error);
        this.router.navigate(['/error']); // Redirect to error page if package is not found
      }
    );
  }
}
