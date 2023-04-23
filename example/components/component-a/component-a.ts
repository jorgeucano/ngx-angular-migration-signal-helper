import { Component } from '@angular/core';

@Component({
    selector: 'app-component-a',
    templateUrl: './component-a.html',
    styleUrls: ['./component-a.css']
})
export class AComponent {
    
    @Input('something') something;
    
    title = 'Tour of Heroes';
}
