export class Driver {
    driver_id: string; // Ensure this is included
    driver_name: string;
    driver_department: string;
    driver_licence: string;
    driver_isActive: boolean;
  
    constructor(
      driver_name: string = '', // Provide default values
      driver_department: string = '',
      driver_licence: string = '',
      driver_isActive: boolean = false
    ) {
      this.driver_id = ''; // Will be auto-generated
      this.driver_name = driver_name;
      this.driver_department = driver_department;
      this.driver_licence = driver_licence;
      this.driver_isActive = driver_isActive;
    }
  }
  