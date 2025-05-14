import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.css'
})
export class DeleteDriverComponent {
  driverId: string = '';
  message: string = '';
  isSuccess: boolean = false;

  constructor(private driverService: DatabaseService, private router: Router) {}

  onDelete() {
    // Fetch the driver using the driver ID to get the MongoDB Object ID
    this.driverService.getDriverByIdFromDriverId(this.driverId).subscribe(
      (driver: any) => {
        if (driver) {
          // If driver exists, retrieve the MongoDB Object ID and delete the driver
          const mongoDbId = driver._id; // MongoDB Object ID
  
          this.driverService.deleteDriver(mongoDbId).subscribe(() => {
            this.message = 'Driver deleted successfully.';
            this.isSuccess = true;
  
            // Redirect after a short delay (optional)
            setTimeout(() => this.router.navigate(['/list-drivers']), 2000);
          });
        } else {
          // Driver was not found
          this.message = 'Driver not found.';
          this.isSuccess = false;
        }
      },
      (error) => {
        // Handle errors when fetching the driver
        this.message = 'Error occurred while fetching driver.';
        this.isSuccess = false;
      }
    );
  }
  


}
