import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListeansComponent } from './listeans.component';

describe('ListeansComponent', () => {
  let component: ListeansComponent;
  let fixture: ComponentFixture<ListeansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeansComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListeansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
