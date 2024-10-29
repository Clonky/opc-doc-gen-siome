import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcDocGenIndexComponent } from './opc-doc-gen-index.component';

describe('OpcDocGenIndexComponent', () => {
  let component: OpcDocGenIndexComponent;
  let fixture: ComponentFixture<OpcDocGenIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcDocGenIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpcDocGenIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
