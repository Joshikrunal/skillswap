import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { JobsListComponent } from './features/jobs/jobs-list.component';
import { JobDetailComponent } from './features/jobs/job-detail.component';
import { CreateJobComponent } from './features/jobs/create-job.component';
import { MyPostingsComponent } from './features/jobs/my-postings.component';
import { MyBidsComponent } from './features/proposals/my-bids.component';
import { MeComponent } from './features/profile/me.component';
import { UserProfileComponent } from './features/profile/user-profile.component';
import { StatsComponent } from './features/stats/stats.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobsListComponent },
  { path: 'jobs/create', component: CreateJobComponent, canActivate: [authGuard] },
  { path: 'jobs/my-postings', component: MyPostingsComponent, canActivate: [authGuard] },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'proposals/my-bids', component: MyBidsComponent, canActivate: [authGuard] },
  { path: 'me', component: MeComponent, canActivate: [authGuard] },
  { path: 'users/:username', component: UserProfileComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: '' }
];
