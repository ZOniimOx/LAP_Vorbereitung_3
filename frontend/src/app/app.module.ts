import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { OrderOverviewComponent } from './components/order-overview/order-overview.component';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DbService } from './services/db.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    OrderOverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NavigationModule,
    GridModule,
    IconsModule,
    ButtonsModule,
    LayoutModule,
    HttpClientModule,
  ],
  providers: [DbService],
  bootstrap: [AppComponent],
})
export class AppModule {}
