import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HashEntry {
  key: string;
  value: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  key: string = '';
  value: string = '';
  hashTable: HashEntry[][] = [];
  logs: string[] = [];
  private tableSize: number = 10;

  constructor() {
    this.initializeHashTable();
  }

  private initializeHashTable(): void {
    this.hashTable = Array(this.tableSize).fill(null).map(() => []);
  }

  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % this.tableSize;
  }

  insert(): void {
    if (!this.key.trim() || !this.value.trim()) {
      this.logs.push('Error: Both key and value are required');
      return;
    }

    const index = this.hash(this.key);
    const bucket = this.hashTable[index];
    
    // Check if key already exists
    const existingEntry = bucket.find(entry => entry.key === this.key);
    if (existingEntry) {
      existingEntry.value = this.value;
      this.logs.push(`Updated: ${this.key} = ${this.value} at index ${index}`);
    } else {
      bucket.push({ key: this.key, value: this.value });
      this.logs.push(`Inserted: ${this.key} = ${this.value} at index ${index}`);
    }

    this.clearInputs();
  }

  search(): void {
    if (!this.key.trim()) {
      this.logs.push('Error: Key is required for search');
      return;
    }

    const index = this.hash(this.key);
    const bucket = this.hashTable[index];
    const entry = bucket.find(entry => entry.key === this.key);

    if (entry) {
      this.logs.push(`Found: ${this.key} = ${entry.value} at index ${index}`);
    } else {
      this.logs.push(`Not found: ${this.key}`);
    }
  }

  delete(): void {
    if (!this.key.trim()) {
      this.logs.push('Error: Key is required for deletion');
      return;
    }

    const index = this.hash(this.key);
    const bucket = this.hashTable[index];
    const entryIndex = bucket.findIndex(entry => entry.key === this.key);

    if (entryIndex !== -1) {
      const deletedEntry = bucket.splice(entryIndex, 1)[0];
      this.logs.push(`Deleted: ${deletedEntry.key} = ${deletedEntry.value} from index ${index}`);
    } else {
      this.logs.push(`Not found for deletion: ${this.key}`);
    }

    this.clearInputs();
  }

  private clearInputs(): void {
    this.key = '';
    this.value = '';
  }
}