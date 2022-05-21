import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderFooterLayoutComponent } from './shared/layout/header-footer-layout/header-footer-layout.component';

const routes: Routes = [
  
  {
    path: 'posts',
    component: HeaderFooterLayoutComponent,
    loadChildren: () => import('./views/posts/posts.module').then(c => c.PostsModule)
  },
  {
    path: 'category',
    component: HeaderFooterLayoutComponent,
    loadChildren: () => import('./views/category/category.module').then(c => c.CategoryModule)
  },
  {
    path: 'users',
    component: HeaderFooterLayoutComponent,
    loadChildren: () => import('./views/users/users.module').then(c => c.UsersModule)
  },
  {
    path: 'activities',
    component: HeaderFooterLayoutComponent,
    loadChildren: () => import('./views/activities/activities.module').then(c => c.ActivitiesModule)
  }
];

@NgModule({
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
