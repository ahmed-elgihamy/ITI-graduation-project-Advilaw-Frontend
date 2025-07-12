import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LawyerResponse, LawyerService } from '../../core/services/lawyer.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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
  topLawyers: Lawyer[] = [
    {
      id: 1,
      name: 'Linda Parker',
      specialty: 'Business Law • Civil Litigation',
      experience: '25 years',
      rating: 5,
      image: '/assets/images/Family.jpg',
      cases: 350,
      location: 'New York, USA',
      country: 'USA',
      city: 'New York',
      field: 'Business Law'
    },
    {
      id: 2,
      name: 'Tom Johnson',
      specialty: 'Personal Injury • Auto Accidents',
      experience: '15 years',
      rating: 5,
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 200,
      location: 'New York, USA',
      country: 'USA',
      city: 'New York',
      field: 'Personal Injury Law'
    },
    {
      id: 3,
      name: 'Hannah Smith',
      specialty: 'Real Estate • Contract Law',
      experience: '12 years',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 180,
      location: 'Los Angeles, USA',
      country: 'USA',
      city: 'Los Angeles',
      field: 'Real Estate Law'
    },
    {
      id: 4,
      name: 'David White',
      specialty: 'Corporate Law • M&A',
      experience: '20 years',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 300,
      location: 'Toronto, Canada',
      country: 'Canada',
      city: 'Toronto',
      field: 'Business Law'
    },
    {
      id: 5,
      name: 'Sara Davis',
      specialty: 'Family Law • Divorce',
      experience: '8 years',
      rating: 4,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 150,
      location: 'London, UK',
      country: 'UK',
      city: 'London',
      field: 'Family Law'
    },
    {
      id: 6,
      name: 'Mike Brown',
      specialty: 'Criminal Defense • DUI',
      experience: '18 years',
      rating: 5,
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 250,
      location: 'Sydney, Australia',
      country: 'Australia',
      city: 'Sydney',
      field: 'Criminal Defense'
    },
    {
      id: 7,
      name: 'Jennifer Miller',
      specialty: 'Immigration • Visa Services',
      experience: '10 years',
      rating: 4,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 160,
      location: 'Berlin, Germany',
      country: 'Germany',
      city: 'Berlin',
      field: 'Immigration Law'
    },
    {
      id: 8,
      name: 'Chris Wilson',
      specialty: 'Employment Law • Workplace Rights',
      experience: '14 years',
      rating: 4,
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 190,
      location: 'Vancouver, Canada',
      country: 'Canada',
      city: 'Vancouver',
      field: 'Employment Law'
    },
    {
      id: 9,
      name: 'Rachel Lee',
      specialty: 'Intellectual Property • Patents',
      experience: '16 years',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 220,
      location: 'Manchester, UK',
      country: 'UK',
      city: 'Manchester',
      field: 'Intellectual Property'
    },
    {
      id: 10,
      name: 'Benjamin Taylor',
      specialty: 'Estate Planning • Wills',
      experience: '22 years',
      rating: 5,
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
      cases: 280,
      location: 'Melbourne, Australia',
      country: 'Australia',
      city: 'Melbourne',
      field: 'Estate Planning'
    }
  ];
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
  route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.loadLawyers();
    this.route.queryParams.subscribe(params => {
      this.selectedField = params['specialization'];
      console.log('Received specialization:', this.selectedField);


    });
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

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  scroll(direction: 'left' | 'right') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 300;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
}