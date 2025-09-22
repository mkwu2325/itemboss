
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  templateUrl: 'explore-container.html',
  styleUrls: ['explore-container.scss'],
  standalone: true,
})
export class ExploreContainerComponent {

  @Input() name?: string;

}
