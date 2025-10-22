import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterModule ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  isDarkMode: boolean = false;

toggleTheme() {
  this.isDarkMode = !this.isDarkMode;

  const body = document.body;
  if (this.isDarkMode) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}


}
