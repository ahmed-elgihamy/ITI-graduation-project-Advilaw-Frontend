import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LawyerResponse, LawyerService } from '../../core/services/lawyer.service';
import { Router, RouterModule } from '@angular/router';

interface Lawyer {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  cases: number;
  location: string;
  country: string;
  city: string;
  field: string;
  jobFieldNames?: string[]; // optional field to support array search
}

@Component({
  selector: 'app-all-lawyer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-lawyer.component.html',
  styleUrl: './all-lawyer.component.css'
})
export class AllLawyerComponent implements OnInit {
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 5;
  sortBy = 'rating';
  totalPages = 1;
  totalItems = 0;
  allLawyers: Lawyer[] = [];
  filteredLawyers: Lawyer[] = [];

  selectedCountry = '';
  selectedCity = '';
  selectedField = '';

  countries = ['USA', 'Egypt', 'Canada', 'UK', 'Australia', 'Germany'];
  cities: { [key: string]: string[] } = {
    'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    'UK': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
    'Egypt': ['Alex', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt']
  };
  legalFields = [
    'Personal Injury Law', 'Business Law', 'Family Law', 'Criminal Defense', 'Real Estate Law',
    'Immigration Law', 'Employment Law', 'Intellectual Property', 'Estate Planning', 'Tax Law',
    'Environmental Law', 'Medical Malpractice'
  ];

  lawyerService = inject(LawyerService);

  ngOnInit(): void {
    this.loadLawyers();
  }

  loadLawyers() {
    this.lawyerService.getAllLawyers(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe((response: LawyerResponse) => {
        this.allLawyers = response.items;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItemsCount;
        this.filteredLawyers = [...this.allLawyers];
        this.applyFilters();
        this.applySorting();
        console.log('Lawyers loaded:', this.allLawyers);
      });
  }

  get availableCities(): string[] {
    return this.selectedCountry ? this.cities[this.selectedCountry] || [] : [];
  }

  get paginatedLawyers(): Lawyer[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLawyers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onCountryChange(): void {
    this.selectedCity = '';
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredLawyers = this.allLawyers.filter(lawyer => {
      const matchesCountry = !this.selectedCountry || lawyer.country === this.selectedCountry;
      const matchesCity = !this.selectedCity || lawyer.city === this.selectedCity;
      const matchesField = !this.selectedField || lawyer.jobFieldNames?.includes(this.selectedField);
      const searchQueryLower = this.searchQuery.toLowerCase();
      const matchesSearch = !this.searchQuery ||
        lawyer.name.toLowerCase().includes(searchQueryLower) ||
        lawyer.field.toLowerCase().includes(searchQueryLower) ||
        lawyer.specialty.toLowerCase().includes(searchQueryLower) ||
        (lawyer.jobFieldNames?.some(field => field.toLowerCase().includes(searchQueryLower)) ?? false);

      return matchesCountry && matchesCity && matchesField && matchesSearch;
    });

    this.applySorting();
    this.currentPage = 1;
  }

  applySorting(): void {
    this.filteredLawyers.sort((a, b) => {
      switch (this.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          const aExp = parseInt(a.experience.split(' ')[0]);
          const bExp = parseInt(b.experience.split(' ')[0]);
          return bExp - aExp;
        case 'cases':
          return b.cases - a.cases;
        default:
          return 0;
      }
    });
  }

  clearFilters(): void {
    this.selectedCountry = '';
    this.selectedCity = '';
    this.selectedField = '';
    this.searchQuery = '';
    this.applyFilters();
    this.loadLawyers();
  }

  clearCountryFilter(): void {
    this.selectedCountry = '';
    this.selectedCity = '';
    this.applyFilters();
  }

  clearCityFilter(): void {
    this.selectedCity = '';
    this.applyFilters();
  }

  clearFieldFilter(): void {
    this.selectedField = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedCountry || this.selectedCity || this.selectedField || this.searchQuery);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLawyers();
    }
  }

  searchLawyers(): void {
    this.currentPage = 1;
    this.loadLawyers();
  }

  scrollLeft(direction: 'left' | 'right') {
    const container = document.querySelector('.row.flex-nowrap');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
