from django.contrib import admin
from .models import Category, Book, Borrow

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price','date', 'isbn', 'available_copy', 'sell')
    list_filter = ('date', 'category')
    search_fields = ('name', 'isbn','category')

class BorrowAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'book', 'borrow_date', 'return_date', 'is_return')
    list_filter = ('is_return', 'borrow_date')
    search_fields = ('user__username', 'book__name')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(Borrow, BorrowAdmin)
