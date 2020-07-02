import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanneruiPage } from './scannerui.page';

describe('ScanneruiPage', () => {
  let component: ScanneruiPage;
  let fixture: ComponentFixture<ScanneruiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanneruiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanneruiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
