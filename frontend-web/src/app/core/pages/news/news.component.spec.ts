import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsComponent } from './news.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { of, throwError } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockPostService = jasmine.createSpyObj('PostService', [
      'getPublishedPosts',
      'getPublishedPostsWithFilter',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NewsComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
  });

  it('should navigate to login if user is not authenticated', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fetch published posts and sort them by publication date', () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        author: 'editor1',
        authorId: 1,
        state: 'PUBLISHED',
        creationDate: new Date(),
        publicationDate: new Date('2023-01-01'),
        category: 'ALGEMEEN',
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        author: 'editor2',
        authorId: 2,
        state: 'PUBLISHED',
        creationDate: new Date(),
        publicationDate: new Date('2024-01-01'),
        category: 'ALGEMEEN',
      },
    ];

    mockAuthService.getCurrentUser.and.returnValue({
      id: 1,
      username: 'editor1',
    } as User);
    mockPostService.getPublishedPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(mockPostService.getPublishedPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(2);
    expect(component.posts[0].id).toBe(2); // Most recent post first
  });

  it('should handle error when fetching published posts fails', () => {
    mockAuthService.getCurrentUser.and.returnValue({
      id: 1,
      username: 'editor1',
    } as User);
    mockPostService.getPublishedPosts.and.returnValue(
      throwError(() => new Error('Failed to fetch posts'))
    );

    console.error = jasmine.createSpy('error');

    component.ngOnInit();

    expect(
      (console.error as jasmine.Spy).calls.mostRecent().args[0].message
    ).toBe('Failed to fetch posts');
  });

  it('should search posts based on search term', () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        author: 'editor1',
        authorId: 1,
        state: 'PUBLISHED',
        creationDate: new Date(),
        publicationDate: new Date('2023-01-01'),
        category: 'ALGEMEEN',
      },
    ];

    mockPostService.getPublishedPostsWithFilter.and.returnValue(of(mockPosts));

    component.searchTerm = 'Post 1';
    component.searchPosts();

    expect(mockPostService.getPublishedPostsWithFilter).toHaveBeenCalledWith(
      'Post 1'
    );
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Post 1');
  });

  it('should handle error when searching posts fails', () => {
    mockPostService.getPublishedPostsWithFilter.and.returnValue(
      throwError(() => new Error('Search failed'))
    );

    console.error = jasmine.createSpy('error');

    component.searchPosts();

    expect(
      (console.error as jasmine.Spy).calls.mostRecent().args[0].message
    ).toBe('Search failed');
  });
});
