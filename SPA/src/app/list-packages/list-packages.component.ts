import { Component, OnInit } from '@angular/core';
import { Package } from '../models/package';
import { DatabaseService } from '../database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KgToGramsPipe } from '../kg-to-grams.pipe';
import { UpperCasePipe } from '../upper-case.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-packages',
  standalone: true,
  imports: [FormsModule, CommonModule,KgToGramsPipe,UpperCasePipe],
  templateUrl: './list-packages.component.html',
  styleUrl: './list-packages.component.css'
})
export class ListPackagesComponent implements OnInit {
  packageId: string = '';
  message: string = '';
  isSuccess: boolean = false;
  showDetailsClicked: boolean = false;


  selectedPackageId: string | null = null;  // To track the package whose driver details are shown
  driverDetails: any = null;  // Store the driver details to be shown

  packages: any[] = []; // Adjust type to 'any' for flexibility to include driver details

  constructor(private packageService: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.getPackages();
    
  }

  getPackages(): void {
    this.packageService.getPackages().subscribe(
      (data: any[]) => {
        this.packages = data.map(pkg => {
          if (pkg.driver_id && pkg.driver_id._id) {
            // Call the service method with the MongoDB ObjectId to fetch the correct driver_id
            this.packageService.getDriverByIdFromMongoId(pkg.driver_id._id).subscribe(
              (driver: any) => {
                pkg.driver_id = driver.driver_id; // Set the fetched driver_id
                
              },
              (error) => {
                console.error('Error fetching driver ID:', error);
              }
            );
          } else {
            pkg.originalDriverId = 'No driver assigned'; // Handle cases where driver_id is null
          }
          
          return pkg;
          
        });
        console.log('Fetched Packages:', this.packages);
      },
      (error) => {
        console.error('Error fetching packages:', error);
      }
    );
  }

  onDelete(packageId: string) {
    // Fetch the package using the package ID to get the MongoDB Object ID
    this.packageService.getPackageByIdFromPackageId(packageId).subscribe(
      (pkg: any) => {
        if (pkg) {
          // If package exists, retrieve the MongoDB Object ID and delete the package
          const mongoDbId = pkg._id; // MongoDB Object ID

          this.packageService.deletePackage(mongoDbId).subscribe(() => {
            this.message = 'Package deleted successfully.';
            this.isSuccess = true;

            // Refresh the list after deletion
            this.packageService.getPackages().subscribe((data: Package[]) => {
              this.packages = data; // Update the package list
            });

            // Redirect after a short delay (optional)
            setTimeout(() => {
              // Reset message and success flag
              this.message = '';
              this.isSuccess = false;

              // Navigate to the list-packages page
              this.router.navigate(['/list-packages']);
            }, 2000);
          });
        } else {
          // Package was not found
          this.message = 'Package not found.';
          this.isSuccess = false;
        }
      },
      (error) => {
        // Handle errors when fetching the package
        this.message = 'Error occurred while fetching package.';
        this.isSuccess = false;
      }
    );

    
  }showDriverDetails(packageId: string, driverId: string): void {
    // Fetch driver details using the driver ID
    this.packageService.getDriverByIdFromDriverId(driverId).subscribe(
      (driver: any) => {
        this.driverDetails = driver; // Store driver details
        console.log(this.driverDetails);
        this.selectedPackageId = packageId; 
        this.showDetailsClicked = true;// Set the selected package ID to display driver details
      },
      (error) => {
        console.error('Error fetching driver details:', error);
        this.driverDetails = null; // Reset if there is an error
      }
    );
  }
}