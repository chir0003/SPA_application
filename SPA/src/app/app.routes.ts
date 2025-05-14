import { Routes } from '@angular/router';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { AddPackagesComponent } from './add-packages/add-packages.component';
import { CountersComponent } from './counters/counters.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeleteDriverComponent } from './delete-driver/delete-driver.component';
import { DeletePackageComponent } from './delete-package/delete-package.component';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ListDriversComponent } from './list-drivers/list-drivers.component';
import { ListPackagesComponent } from './list-packages/list-packages.component';
import { UpdateDriverComponent } from './update-driver/update-driver.component';
import { UpdatePackagesComponent } from './update-packages/update-packages.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TranslateDescriptionComponent } from './translate-description/translate-description.component';

export const routes: Routes = [
    {path: 'add-driver' , component : AddDriverComponent},
    { path: 'add-packages', component: AddPackagesComponent },
    { path: 'counters', component: CountersComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'delete-driver', component: DeleteDriverComponent },
    { path: 'delete-package', component: DeletePackageComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'list-drivers', component: ListDriversComponent },
    { path: 'list-packages', component: ListPackagesComponent },
    { path: 'update-driver', component: UpdateDriverComponent },
    { path: 'translate', component: TranslateDescriptionComponent },
    { path: 'update-packages', component: UpdatePackagesComponent },
    { path: '**', component: PageNotFoundComponent } 

];
