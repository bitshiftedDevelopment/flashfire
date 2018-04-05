import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { FlashFireModule } from '@app/flashfire/flashfire.module';
@NgModule({
  imports: [
    CommonModule,
    FlashFireModule
  ],
  declarations: [HomeComponent]
})
export class DemoModule { }
