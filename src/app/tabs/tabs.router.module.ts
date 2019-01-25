import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TabsPage} from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'assets',
        children: [
          {
            path: '',
            loadChildren: '../pages/assets/assets.module#AssetsPageModule'
          }
        ]
      },
      {
        path: 'dapp',
        children: [
          {
            path: '',
            loadChildren: '../pages/dapp/dapp.module#DappPageModule'
          }
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: '../pages/account/account.module#AccountPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/assets',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/assets',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
