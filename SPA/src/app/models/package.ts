export class Package {
    package_id: string;
    package_title: string;
    package_weight: number; // in KG (will convert to grams in the List component)
    package_destination: string;
    description: string;
    isAllocated: boolean;
    driver_id: string | null; // This can be either an ObjectId (from MongoDB) or a string
    createdAt: Date;
  
    constructor(
      package_title: string,
      package_weight: number,
      package_destination: string,
      description: string = '',
      isAllocated: boolean = false,
      driver_id: string | null = null
    ) {
      this.package_id = ''; // Will be auto-generated
      this.package_title = package_title;
      this.package_weight = package_weight;
      this.package_destination = package_destination;
      this.description = description;
      this.isAllocated = isAllocated;
      this.driver_id = driver_id;
      this.createdAt = new Date();
    }
  }
  