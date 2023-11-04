import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { RoomsPageComponent } from './pages/rooms-page/rooms-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { RoomsNewComponent } from './pages/rooms-page/rooms-new/rooms-new.component';
import { RoomsJoinComponent } from './pages/rooms-page/rooms-join/rooms-join.component';
import { SecretHitlerLayoutComponent } from './shared/layouts/secret-hitler-layout/secret-hitler-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
    ],
  },
  {
    path: '',
    component: SiteLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'news', component: NewsPageComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'statistics', component: StatisticsPageComponent },
      { path: 'rooms', component: RoomsPageComponent },
      { path: 'rooms/new', component: RoomsNewComponent },
      { path: 'rooms/:id', component: RoomsJoinComponent },
    ],
  },
  {
    path: 'Secret_Hitler',
    component: SecretHitlerLayoutComponent,
    canActivate: [AuthGuard],
  },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
