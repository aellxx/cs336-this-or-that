import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoContainerComponent } from 'src/app/components/photo-container/photo-container.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick = (): void => {
    this.router.navigateByUrl('/game');
  }
}
