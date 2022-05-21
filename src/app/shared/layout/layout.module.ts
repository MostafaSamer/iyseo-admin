import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderFooterLayoutComponent } from './header-footer-layout/header-footer-layout.component'
import { HeaderComponent } from './header-footer-layout/header/header.component'
import { SidebarComponent } from './header-footer-layout/sidebar/sidebar.component'

const components = [
  HeaderFooterLayoutComponent,
  HeaderComponent,
  SidebarComponent
]

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
  ],
  declarations: components,
  exports: components
})
export class LayoutModule { }
