import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFooterLayoutComponent } from './header-footer-layout.component';

describe('HeaderFooterLayoutComponent', () => {
  let component: HeaderFooterLayoutComponent;
  let fixture: ComponentFixture<HeaderFooterLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderFooterLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderFooterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
