from django.urls import path
from .views import (
    Home,
    BookListView,
    BookDetailView,
    BookCreateView,
    BookUpdateView,
    BookDeleteView,
    BookPurchaseView,
    BorrowListView,
    BorrowDetailView,
    BorrowCreateView,
    BorrowReturnView,
    MyActiveBorrowsView,
    CategoryListView,
    CategoryDetailView,
    CategoryCreateView,
    CategoryUpdateView,
    CategoryDeleteView,
    CategoryBooksView,
    UserStatsView,
    LibraryStatsView,
)

app_name = 'book'

urlpatterns = [
    # Home
    path('', Home.as_view(), name='home'),
    
    # Book CRUD
    path('books/', BookListView.as_view(), name='book-list'),
    path('books/<int:book_id>/', BookDetailView.as_view(), name='book-detail'),
    path('books/create/', BookCreateView.as_view(), name='book-create'),
    path('books/<int:book_id>/update/', BookUpdateView.as_view(), name='book-update'),
    path('books/<int:book_id>/delete/', BookDeleteView.as_view(), name='book-delete'),
    path('books/<int:book_id>/purchase/', BookPurchaseView.as_view(), name='book-purchase'),
    
    # Borrow
    path('borrows/', BorrowListView.as_view(), name='borrow-list'),
    path('borrows/<int:borrow_id>/', BorrowDetailView.as_view(), name='borrow-detail'),
    path('borrows/create/', BorrowCreateView.as_view(), name='borrow-create'),
    path('borrows/<int:borrow_id>/return/', BorrowReturnView.as_view(), name='borrow-return'),
    path('borrows/my-active/', MyActiveBorrowsView.as_view(), name='my-active-borrows'),
    
    # Category
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<int:category_id>/', CategoryDetailView.as_view(), name='category-detail'),
    path('categories/create/', CategoryCreateView.as_view(), name='category-create'),
    path('categories/<int:category_id>/update/', CategoryUpdateView.as_view(), name='category-update'),
    path('categories/<int:category_id>/delete/', CategoryDeleteView.as_view(), name='category-delete'),
    path('categories/<int:category_id>/books/', CategoryBooksView.as_view(), name='category-books'),
    
    # Stats
    path('stats/', UserStatsView.as_view(), name='user-stats'),
    path('stats/admin/', LibraryStatsView.as_view(), name='library-stats'),
]