from django.urls import path
from . import views
from . import borrow_views
from . import category_views
from . import purchase_views
from . import stats_views

app_name = 'book'

urlpatterns = [
    # Home
    path('', views.Home.as_view(), name='home'),
    
    # Book CRUD
    path('books/', views.BookListView.as_view(), name='book-list'),
    path('books/<int:book_id>/', views.BookDetailView.as_view(), name='book-detail'),
    path('books/create/', views.BookCreateView.as_view(), name='book-create'),
    path('books/<int:book_id>/update/', views.BookUpdateView.as_view(), name='book-update'),
    path('books/<int:book_id>/delete/', views.BookDeleteView.as_view(), name='book-delete'),
    path('books/<int:book_id>/purchase/', purchase_views.BookPurchaseView.as_view(), name='book-purchase'),
    
    # Borrow
    path('borrows/', borrow_views.BorrowListView.as_view(), name='borrow-list'),
    path('borrows/<int:borrow_id>/', borrow_views.BorrowDetailView.as_view(), name='borrow-detail'),
    path('borrows/create/', borrow_views.BorrowCreateView.as_view(), name='borrow-create'),
    path('borrows/<int:borrow_id>/return/', borrow_views.BorrowReturnView.as_view(), name='borrow-return'),
    path('borrows/my-active/', borrow_views.MyActiveBorrowsView.as_view(), name='my-active-borrows'),
    
    # Category
    path('categories/', category_views.CategoryListView.as_view(), name='category-list'),
    path('categories/<int:category_id>/', category_views.CategoryDetailView.as_view(), name='category-detail'),
    path('categories/create/', category_views.CategoryCreateView.as_view(), name='category-create'),
    path('categories/<int:category_id>/update/', category_views.CategoryUpdateView.as_view(), name='category-update'),
    path('categories/<int:category_id>/delete/', category_views.CategoryDeleteView.as_view(), name='category-delete'),
    path('categories/<int:category_id>/books/', category_views.CategoryBooksView.as_view(), name='category-books'),
    
    # Stats
    path('stats/', stats_views.UserStatsView.as_view(), name='user-stats'),
    path('stats/admin/', stats_views.LibraryStatsView.as_view(), name='library-stats'),
]