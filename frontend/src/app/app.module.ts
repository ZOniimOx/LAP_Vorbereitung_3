import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { OrderOverviewComponent } from './components/order-overview/order-overview.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DbService } from './services/db.service';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  ComboBoxModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import {
  DateInputModule,
  DatePickerModule,
} from '@progress/kendo-angular-dateinputs';
import { NotificationModule } from '@progress/kendo-angular-notification';

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
    DialogModule,
    ReactiveFormsModule,
    InputsModule,
    LabelModule,
    ComboBoxModule,
    DateInputModule,
    DatePickerModule,
    NotificationModule,
    MultiSelectModule,
  ],
  providers: [DbService],
  bootstrap: [AppComponent],
})
export class AppModule {}
