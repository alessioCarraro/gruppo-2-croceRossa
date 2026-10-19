import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface StoreLocation {
    id: number;
    name: string;
    availability: number;
    distance: string;
}

@Component({
    selector: 'app-admin-store-locator',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-stor-locator-component.html',
    styleUrls: ['./admin-stor-locator-component.css']
})
export class AdminStoreLocatorComponent {
    private readonly router = inject(Router);

    public readonly searchQuery = signal<string>('Pannolini taglia 4');
    public readonly productName = signal<string>('Pannolini taglia 4');
    public readonly productStatus = signal<string>('esaurito nel tuo negozio');

    public readonly locations = signal<StoreLocation[]>([
        { id: 1, name: 'Parabiago', availability: 120, distance: '4,2 km' },
        { id: 2, name: 'S. Vittore Olona', availability: 80, distance: '5,1 km' },
        { id: 3, name: 'Canegrate', availability: 25, distance: '6,0 km' },
        { id: 4, name: 'Busto Garolfo', availability: 0, distance: '7,8 km' }
    ]);

    public goBack(): void {
        this.router.navigate(['/admin-home'])
    }

    public getAvailabilityColor(availability: number): string {
        if (availability >= 80) return 'text-green';
        if (availability > 0) return 'text-orange';
        return 'text-grey';
    }
}
