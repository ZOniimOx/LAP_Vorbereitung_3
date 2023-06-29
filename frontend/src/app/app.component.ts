import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerItem, DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { navEntries } from './nav-menu-entries';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @Input()
  navEntries!: Array<any>;
  @Input()
  parentRouter!: Router;

  selected = 'Home';

  // @Input()
  // public selected = 'Inbox';
  mappedNavEntries: any[] = [];

  title = 'LAP Vorbereitung';

  public items: DrawerItem[] = [
    // { text: 'Home', icon: 'k-i-home', selected: true },
    // { text: 'order-overview', icon: 'k-i-table', selected: false },
    // { separator: true },
    // { text: 'Notifications', icon: 'k-i-bell' },
    // { text: 'Calendar', icon: 'k-i-calendar' },
    // { separator: true },
    // { text: 'Attachments', icon: 'k-i-envelop-link' },
    // { text: 'Favourites', icon: 'k-i-star-outline' },
  ];

  // public navEntries

  constructor(private router: Router) {}

  ngOnInit() {
    navEntries.forEach((e) => {
      this.items.push({
        text: e.text,
        icon: e.icon,
      });
    });
  }

  login() {
    console.log('Logging in');
    this.router.navigate(['/login']);
  }

  public onSelect(ev: DrawerSelectEvent): void {
    const selectedNavEntry = navEntries.find(
      (e) => e.text === ev.item.text
    ) as { text: string; icon: string; link: string };
    // this.selected = ev.item.text;
    this.selected = selectedNavEntry.text;

    this.router.navigate([selectedNavEntry.link]);
  }
}
