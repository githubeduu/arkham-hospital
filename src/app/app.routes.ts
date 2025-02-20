import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { CitasComponent } from './components/citas/citas.component';

export const routes: Routes = [
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'pacientes', component: PacientesComponent },
    { path: 'citas', component: CitasComponent }

];
