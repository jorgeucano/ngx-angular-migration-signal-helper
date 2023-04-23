import { Component } from '@angular/core';

@Component({
    selector: 'app-component-b',
    templateUrl: './component-b.html',
    styleUrls: ['./component-b.css']
})
export class BComponent {
    
    @Input() something: string;
    
    title = 'Tour of Heroes';
}
