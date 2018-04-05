import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { FiredbModule } from './firedb/firedb.module';
@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    FiredbModule
  ],
  declarations: []
})
export class FlashFireModule { }
