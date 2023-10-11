import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { RoomsPageComponent } from './rooms-page/rooms-page.component';
import { DeskPageShComponent } from './desk-page-sh/desk-page-sh.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NewsPageComponent } from './news-page/news-page.component';
import { StatisticsPageComponent } from './statistics-page/statistics-page.component';
import { RoomsNewComponent } from './rooms-page/rooms-new/rooms-new.component';
import { RoomsJoinComponent } from './rooms-page/rooms-join/rooms-join.component';

const config: SocketIoConfig = {
  url: 'http://localhost:3000', // socket server url;
  options: {
    transports: ['websocket'],
  },
};

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
    DeskPageShComponent,
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
    SocketIoModule.forRoot(config),
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
