from django.contrib import admin
from .models import Category, Book, Borrow, Banner

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'date', 'isbn', 'available_copy', 'sell', 'cover_image_preview')
    list_filter = ('date', 'category', 'sell')
    search_fields = ('name', 'isbn', 'description')
    filter_horizontal = ('category',)
    readonly_fields = ('cover_image_preview',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'isbn', 'description', 'date')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'sell', 'available_copy')
        }),
        ('Categories', {
            'fields': ('category',)
        }),
        ('Cover Image', {
            'fields': ('cover_image', 'cover_image_preview')
        }),
    )
    
    def cover_image_preview(self, obj):
        if obj.cover_image:
            return f'<img src="{obj.cover_image.url}" style="max-height: 200px; max-width: 200px;" />'
        return "No image"
    cover_image_preview.allow_tags = True
    cover_image_preview.short_description = 'Cover Image Preview'

class BorrowAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'book', 'borrow_date', 'return_date', 'is_return')
    list_filter = ('is_return', 'borrow_date')
    search_fields = ('user__username', 'book__name')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(Borrow, BorrowAdmin)
admin.site.register(Banner)
