import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private auth: AuthService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  logout()
  {
    this.auth.logout();
    this.router.navigateByUrl('/auth');
  }

}
