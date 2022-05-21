import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderFooterLayoutComponent } from './shared/layout/header-footer-layout/header-footer-layout.component';
import { HeaderComponent } from './shared/layout/header-footer-layout/header/header.component';
import { SidebarComponent } from './shared/layout/header-footer-layout/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderFooterLayoutComponent,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
