import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import io from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { KgToGramsPipe } from '../kg-to-grams.pipe';
import { SocketService } from '../socketservice.service';



interface Package {
  id: string;
  description: string;
  driver_id?: string; // Optional property for driver ID
}

@Component({
  selector: 'app-translate-description',
  standalone: true,
  imports: [FormsModule, CommonModule,KgToGramsPipe,UpperCasePipe],
  templateUrl: './translate-description.component.html',
  styleUrls: ['./translate-description.component.css'], // Fixed typo from styleUrl to styleUrls
})
export class TranslateDescriptionComponent implements OnInit {
  selectedLanguage: string = ''; // Selected target language
  languages = ['en', 'es', 'fr']; // Language codes for English, Spanish, French
  message: string = ''; // Message to display translated text
  isSuccess: boolean = false;

  packages: any[] = []; // Packages list

  constructor(private socketService: SocketService, private packageService: DatabaseService) {}

  ngOnInit(): void {
    this.getPackages();
    this.listenToTranslationResult();
  }

  // Fetch the packages from the backend
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
      },
      (error) => {
        console.error('Error fetching packages:', error);
      }
    );
  }

  // Trigger translation via Socket.IO
  translateDescription(description: string): void {
    if (!this.selectedLanguage) {
      this.message = 'Please select a language';
      return;
    }

    // Send translation request to the backend
    this.socketService.sendTranslationRequest(description, this.selectedLanguage);
  }

  // Listen for the translation result
  listenToTranslationResult(): void {
    this.socketService.onTranslationResult().subscribe(
      (data: any) => {
        this.isSuccess = true;
        this.message = `Translated Description: ${data.translatedDescription}`;
      },
      (error: any) => {
        this.isSuccess = false;
        this.message = 'Error in translation';
      }
    );
  }
}