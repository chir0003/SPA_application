import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counters',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './counters.component.html',
  styleUrl: './counters.component.css'
})
export class CountersComponent implements OnInit {

  counts: any; // To store the counters data
  errorMessage: string = ''; // To handle any error message

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.getStatistics(); // Fetch the stats when the component is initialized
  }

  getStatistics(): void {
    this.databaseService.getStatistics().subscribe(
      (data: any) => {
        this.counts = data.counts; // Assign the fetched counters to the counts variable
      },
      (error) => {
        console.error('Error fetching counters:', error);
        this.errorMessage = 'Failed to load statistics.';
      }
    );
  }
}