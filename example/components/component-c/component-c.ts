import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-component-c',
    templateUrl: './component-c.html',
    styleUrls: ['./component-c.css']
})
export class BComponent {
    
    @Input('account-id') id: string;
    
    title = 'Tour of Heroes';
}
