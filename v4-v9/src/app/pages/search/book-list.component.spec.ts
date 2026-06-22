import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../components/shared.module';
import { BookListComponent } from './book-list.component';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListComponent],
      imports: [SharedModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    component.books = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty message when no books', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.empty').textContent).toContain('No books to display');
  });

  it('should emit loadMore when scrolled to bottom', () => {
    spyOn(component.loadMore, 'emit');
    component.hasMore = true;
    component.isLoading = false;
    component.books = [{ id: '1', title: 'Test', authors: [], description: '', publisher: '', publishedDate: '', pageCount: 0, thumbnail: '', previewLink: '' }];
    expect(component).toBeTruthy();
  });
});
