import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-package.component.html',
  styleUrl: './delete-package.component.css'
})
export class DeletePackageComponent {
  packageId: string = '';
  message: string = '';
  isSuccess: boolean = false;

  constructor(private packageService: DatabaseService, private router: Router) {}

  onDelete() {
    this.packageService.getPackageByIdFromPackageId(this.packageId).subscribe(
      (pkg: any) => {
        if (pkg) {
          const mongoDbId = pkg._id; // MongoDB Object ID

          this.packageService.deletePackage(mongoDbId).subscribe(() => {
            this.message = 'Package deleted successfully.';
            this.isSuccess = true;

            // Optionally, refresh the list or redirect after deletion
            setTimeout(() => this.router.navigate(['/list-packages']), 2000);
          });
        } else {
          this.message = 'Package not found.';
          this.isSuccess = false;
        }
      },
      (error) => {
        this.message = 'Error occurred while fetching package.';
        this.isSuccess = false;
      }
    );
  }

}
