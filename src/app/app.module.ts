import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { RoomsPageComponent } from './pages/rooms-page/rooms-page.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { RoomsNewComponent } from './pages/rooms-page/rooms-new/rooms-new.component';
import { RoomsJoinComponent } from './pages/rooms-page/rooms-join/rooms-join.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    ProfilePageComponent,
    LoaderComponent,
    RoomsPageComponent,
    NewsPageComponent,
    StatisticsPageComponent,
    RoomsNewComponent,
    RoomsJoinComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
