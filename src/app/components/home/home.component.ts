import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
interface Service {
  icon: string;
  title: string;
  description: string;
}

interface Lawyer {
  name: string;
  specialty: string;
  rating: number;
  location: string;
  initial: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  text: string;
  author: string;
  position: string;
  initial: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showModal() {
    var signOutBtn = document.getElementById("signOutBtn");
    signOutBtn?.click();
  }

  searchQuery = '';
  emailSubscription = '';

  services: Service[] = [
    {
      icon: 'fas fa-briefcase',
      title: 'Family Law',
      description: 'Divorce, custody, adoption, and other family-related legal matters handled with care and expertise.'
    },
    {
      icon: 'fas fa-building',
      title: 'Business Law',
      description: 'Corporate formation, contracts, mergers, and comprehensive business legal support for companies.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Criminal Defense',
      description: 'Experienced criminal defense representation for all types of criminal charges and accusations.'
    },
    {
      icon: 'fas fa-user-injured',
      title: 'Personal Injury',
      description: 'Get compensation for injuries caused by accidents, medical malpractice, or negligence.'
    },
    {
      icon: 'fas fa-home',
      title: 'Real Estate',
      description: 'Property transactions, landlord-tenant issues, and real estate investment legal guidance.'
    },
    {
      icon: 'fas fa-gavel',
      title: 'Immigration',
      description: 'Visa applications, citizenship, deportation defense, and comprehensive immigration services.'
    }
  ];

  lawyers: Lawyer[] = [
    {
      name: 'Rebecca Anderson',
      specialty: 'Family Law Attorney',
      rating: 5,
      location: 'New York, NY',
      initial: 'R'
    },
    {
      name: 'Michael Thompson',
      specialty: 'Corporate Law',
      rating: 5,
      location: 'Chicago, IL',
      initial: 'M'
    },
    {
      name: 'Jessica Williams',
      specialty: 'Criminal Defense',
      rating: 5,
      location: 'Los Angeles, CA',
      initial: 'J'
    },
    {
      name: 'Daniel Rodriguez',
      specialty: 'Personal Injury',
      rating: 5,
      location: 'Miami, FL',
      initial: 'D'
    }
  ];

  processSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'Search for a Lawyer',
      description: 'Tell us about your legal needs and browse through our qualified attorneys to find the right match.'
    },
    {
      number: 2,
      title: 'Compare Profiles',
      description: 'Review lawyer profiles, read client reviews, and check their experience in your legal matter.'
    },
    {
      number: 3,
      title: 'Connect & Consult',
      description: 'Schedule a consultation with your chosen lawyer and get the legal advice you need.'
    }
  ];

  features: Feature[] = [
    {
      icon: 'fas fa-clock',
      title: 'Fast Response',
      description: 'Get matched with qualified lawyers within 24 hours of your request.'
    },
    {
      icon: 'fas fa-certificate',
      title: 'Verified Lawyers',
      description: 'All lawyers are verified and licensed professionals with proven track records.'
    },
    {
      icon: 'fas fa-dollar-sign',
      title: 'No Hidden Fees',
      description: 'Transparent pricing with no surprises. Know exactly what you\'ll pay upfront.'
    },
    {
      icon: 'fas fa-users',
      title: '10,000+ Clients Served',
      description: 'Trusted by thousands of clients who found their perfect legal match.'
    },
    {
      icon: 'fas fa-percentage',
      title: '98% Success Rate',
      description: 'Our lawyers have a 98% success rate in resolving legal matters effectively.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Payments',
      description: 'Your payments are secure and protected with bank-level encryption.'
    },
    {
      icon: 'fas fa-headset',
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you every step of the way.'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Trusted by Businesses',
      description: 'Preferred legal platform for businesses of all sizes across multiple industries.'
    }
  ];

  testimonials: Testimonial[] = [
    {
      text: 'I was facing a complex divorce case and found the perfect lawyer through AdviLaw. The platform made it easy to compare attorneys and find one who specialized in my exact situation. Highly recommend!',
      author: 'Sarah Mitchell',
      position: 'Business Owner',
      initial: 'S'
    },
    {
      text: 'The criminal defense attorney I found through AdviLaw was exceptional. They handled my case with professionalism and got me the best possible outcome. The platform is a game-changer!',
      author: 'Robert Chen',
      position: 'Software Engineer',
      initial: 'R'
    },
    {
      text: 'AdviLaw helped me find an outstanding business lawyer who helped me navigate a complex merger. The vetting process ensures you get quality professionals every time.',
      author: 'Maria Garcia',
      position: 'CEO, TechStart Inc.',
      initial: 'M'
    }
  ];
  practiceAreas = [
    {
      title: 'Family Law',
      description: 'Divorce, custody, adoption, and domestic relations matters handled with compassion.',
      cases: '2,450+',
      image: 'https://readdy.ai/api/search-image?query=family%20law...',
      icon: 'ri-user-heart-line ri-lg',
      cta: 'Find Family Lawyers',
      link: '#'
    },
    {
      title: 'Business Law',
      description: 'Corporate law, contracts, and business formation services.',
      cases: '3,180+',
      image: 'https://readdy.ai/api/search-image?query=business%20law...',
      icon: 'ri-building-line ri-lg',
      cta: 'Find Business Lawyers',
      link: '#'
    },
    // ... (and so on)
  ];

}