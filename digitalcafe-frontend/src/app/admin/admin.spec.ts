import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Admin } from './admin';

describe('Admin Component', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Admin,
        HttpClientTestingModule  // required because Admin uses HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the admin component', () => {
    expect(component).toBeTruthy();
  });

  it('should have pendingUsers array initialized', () => {
    expect(component.pendingUsers).toBeDefined();
  });
});
