import { Component } from '@angular/core';
import { DatabaseService } from '../database.service'; // For backend interaction
import { Router } from '@angular/router'; // For navigation
import { FormsModule } from '@angular/forms'; 
import { Driver } from '../models/Driver'; // Model for the driver data
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../error/error.component'; // Error component for invalid data

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorComponent], // Ensure necessary modules are imported
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css']
})
export class AddDriverComponent {

  driver: Driver = new Driver(); // Driver object to hold form data

  constructor(private driverService: DatabaseService, private router: Router) {}

  onSubmit(form: any) {
    console.log('Submitting driver:', this.driver); // Log the driver object for debugging

    // Validate form data before submission
    if (!this.isValidDriver(this.driver)) {
      // Redirect to an invalid data component if validation fails
      this.router.navigate(['/error']);
    } else {
      // If validation passes, proceed to submit the data to the backend
      this.driverService.addDriver(this.driver).subscribe(
        (response) => {
          console.log('Driver added:', response);
          this.router.navigate(['/list-drivers']); // Navigate to the list after successful addition
        },
        (error) => {
          console.error('Error adding driver:', error); // Log any errors
          alert('Failed to add driver: ' + error.message); // Optionally show an alert to the user
        }
      );
    }
  }

  // Custom validation method to validate driver data
  isValidDriver(driver: Driver): boolean {
    // Validate driver name: should be alphabetic and between 3 and 20 characters
    const validName = /^[A-Za-z]{3,20}$/.test(driver.driver_name);

    // Validate driver department: should be one of the predefined values
    const validDepartments = ['food', 'furniture', 'electronic'];
    const validDepartment = validDepartments.includes(driver.driver_department);

    // Validate driver licence: should be alphanumeric and exactly 5 characters
    const validLicence = /^[A-Za-z0-9]{5}$/.test(driver.driver_licence);

    return validName && validDepartment && validLicence; // Return true only if all validations pass
  }
}
