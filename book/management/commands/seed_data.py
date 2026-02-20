import os
import requests
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from book.models import Book, Category, Borrow
from account.models import User, Profile

class Command(BaseCommand):
    help = 'Seed database with sample data and download images'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to seed database...'))
        
        # Create categories
        categories_data = [
            {'name': 'Science'},
            {'name': 'Arts'},
            {'name': 'Commerce'},
            {'name': 'Design'},
            {'name': 'Cooking'},
            {'name': 'Fiction'},
            {'name': 'Non-Fiction'},
            {'name': 'Biography'},
            {'name': 'Technology'},
            {'name': 'Philosophy'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(name=cat_data['name'])
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
        
        # Sample books data with real book information
        books_data = [
            {
                'name': 'The Subtle Art of Not Giving a F*ck',
                'isbn': '978-0062457714',
                'price': 150000,
                'sell': True,
                'available_copy': 5,
                'date': '2016-09-13',
                'description': 'A counterintuitive approach to living a good life.',
                'categories': ['Non-Fiction', 'Philosophy'],
                'image_url': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
            },
            {
                'name': 'Atomic Habits',
                'isbn': '978-0735211292',
                'price': 180000,
                'sell': True,
                'available_copy': 8,
                'date': '2018-10-16',
                'description': 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
                'categories': ['Non-Fiction', 'Self-Help'],
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Alchemist',
                'isbn': '978-0062315007',
                'price': 120000,
                'sell': True,
                'available_copy': 10,
                'date': '2014-04-15',
                'description': 'A magical story about following your dreams.',
                'categories': ['Fiction', 'Philosophy'],
                'image_url': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'
            },
            {
                'name': 'Sapiens: A Brief History of Humankind',
                'isbn': '978-0062316097',
                'price': 200000,
                'sell': True,
                'available_copy': 6,
                'date': '2015-02-10',
                'description': 'From a renowned historian comes a groundbreaking narrative of humanity.',
                'categories': ['Non-Fiction', 'Science'],
                'image_url': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'
            },
            {
                'name': '1984',
                'isbn': '978-0452284234',
                'price': 140000,
                'sell': True,
                'available_copy': 7,
                'date': '1949-06-08',
                'description': 'A dystopian social science fiction novel.',
                'categories': ['Fiction', 'Science'],
                'image_url': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'
            },
            {
                'name': 'To Kill a Mockingbird',
                'isbn': '978-0061120084',
                'price': 130000,
                'sell': True,
                'available_copy': 9,
                'date': '1960-07-11',
                'description': 'A gripping tale of racial injustice and childhood innocence.',
                'categories': ['Fiction', 'Arts'],
                'image_url': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Great Gatsby',
                'isbn': '978-0743273565',
                'price': 110000,
                'sell': True,
                'available_copy': 12,
                'date': '1925-04-10',
                'description': 'A classic American novel of the Jazz Age.',
                'categories': ['Fiction', 'Arts'],
                'image_url': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
            },
            {
                'name': 'Pride and Prejudice',
                'isbn': '978-0141439518',
                'price': 100000,
                'sell': True,
                'available_copy': 15,
                'date': '1813-01-28',
                'description': 'A romantic novel of manners written by Jane Austen.',
                'categories': ['Fiction', 'Arts'],
                'image_url': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Catcher in the Rye',
                'isbn': '978-0316769174',
                'price': 125000,
                'sell': True,
                'available_copy': 8,
                'date': '1951-07-16',
                'description': 'A controversial novel about teenage rebellion.',
                'categories': ['Fiction'],
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Lord of the Rings',
                'isbn': '978-0544003415',
                'price': 250000,
                'sell': True,
                'available_copy': 5,
                'date': '1954-07-29',
                'description': 'An epic high fantasy novel.',
                'categories': ['Fiction', 'Arts'],
                'image_url': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'
            },
            {
                'name': 'Harry Potter and the Philosopher\'s Stone',
                'isbn': '978-0747532699',
                'price': 160000,
                'sell': True,
                'available_copy': 20,
                'date': '1997-06-26',
                'description': 'The first novel in the Harry Potter series.',
                'categories': ['Fiction'],
                'image_url': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Hunger Games',
                'isbn': '978-0439023481',
                'price': 145000,
                'sell': True,
                'available_copy': 11,
                'date': '2008-09-14',
                'description': 'A dystopian novel about survival.',
                'categories': ['Fiction', 'Science'],
                'image_url': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Da Vinci Code',
                'isbn': '978-0307277671',
                'price': 170000,
                'sell': True,
                'available_copy': 7,
                'date': '2003-03-18',
                'description': 'A mystery thriller novel.',
                'categories': ['Fiction', 'Non-Fiction'],
                'image_url': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Kite Runner',
                'isbn': '978-1594631931',
                'price': 135000,
                'sell': True,
                'available_copy': 9,
                'date': '2003-05-29',
                'description': 'A story of friendship, betrayal, and redemption.',
                'categories': ['Fiction', 'Biography'],
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Book Thief',
                'isbn': '978-0375831003',
                'price': 155000,
                'sell': True,
                'available_copy': 6,
                'date': '2005-09-01',
                'description': 'A story set in Nazi Germany.',
                'categories': ['Fiction', 'Biography'],
                'image_url': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Girl with the Dragon Tattoo',
                'isbn': '978-0307269751',
                'price': 165000,
                'sell': True,
                'available_copy': 8,
                'date': '2005-08-01',
                'description': 'A psychological thriller novel.',
                'categories': ['Fiction'],
                'image_url': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Help',
                'isbn': '978-0399155345',
                'price': 150000,
                'sell': True,
                'available_copy': 10,
                'date': '2009-02-10',
                'description': 'A novel about African American maids in 1960s Mississippi.',
                'categories': ['Fiction', 'Biography'],
                'image_url': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'
            },
            {
                'name': 'Life of Pi',
                'isbn': '978-0151008117',
                'price': 140000,
                'sell': True,
                'available_copy': 7,
                'date': '2001-09-11',
                'description': 'A fantasy adventure novel.',
                'categories': ['Fiction', 'Philosophy'],
                'image_url': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
            },
            {
                'name': 'The Fault in Our Stars',
                'isbn': '978-0525478812',
                'price': 120000,
                'sell': True,
                'available_copy': 14,
                'date': '2012-01-10',
                'description': 'A young adult novel about two teenagers with cancer.',
                'categories': ['Fiction'],
                'image_url': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'
            },
            {
                'name': 'Gone Girl',
                'isbn': '978-0307588364',
                'price': 175000,
                'sell': True,
                'available_copy': 6,
                'date': '2012-06-05',
                'description': 'A psychological thriller about a marriage gone wrong.',
                'categories': ['Fiction'],
                'image_url': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'
            },
        ]
        
        # Download and create books
        from django.conf import settings
        media_path = os.path.join(settings.BASE_DIR, 'media', 'book_covers')
        os.makedirs(media_path, exist_ok=True)
        
        for book_data in books_data:
            book, created = Book.objects.get_or_create(
                isbn=book_data['isbn'],
                defaults={
                    'name': book_data['name'],
                    'price': book_data['price'],
                    'sell': book_data['sell'],
                    'available_copy': book_data['available_copy'],
                    'date': book_data['date'],
                    'description': book_data.get('description', ''),
                }
            )
            
            if created:
                # Add categories
                for cat_name in book_data['categories']:
                    if cat_name in categories:
                        book.category.add(categories[cat_name])
                
                # Download image
                try:
                    image_url = book_data.get('image_url', '')
                    if image_url:
                        response = requests.get(image_url, timeout=10)
                        if response.status_code == 200:
                            # Generate safe filename
                            safe_name = "".join(c for c in book.name if c.isalnum() or c in (' ', '-', '_')).rstrip()
                            safe_name = safe_name.replace(' ', '_')[:50]
                            image_filename = f"{safe_name}_{book.id}.jpg"
                            image_path = os.path.join(media_path, image_filename)
                            
                            with open(image_path, 'wb') as f:
                                f.write(response.content)
                            
                            # Update book with image
                            from django.core.files import File
                            with open(image_path, 'rb') as f:
                                book.cover_image.save(image_filename, File(f), save=True)
                            
                            self.stdout.write(self.style.SUCCESS(f'Downloaded image for: {book.name}'))
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Could not download image for {book.name}: {str(e)}'))
                
                self.stdout.write(self.style.SUCCESS(f'Created book: {book.name}'))
        
        # Create sample users
        users_data = [
            {'username': 'admin', 'email': 'admin@library.com', 'is_admin': True},
            {'username': 'john_doe', 'email': 'john@example.com', 'is_admin': False},
            {'username': 'jane_smith', 'email': 'jane@example.com', 'is_admin': False},
            {'username': 'booklover', 'email': 'booklover@example.com', 'is_admin': False},
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'is_admin': user_data.get('is_admin', False),
                }
            )
            
            if created:
                user.set_password('password123')
                user.save()
                
                # Create profile
                Profile.objects.create(
                    user=user,
                    borrow_limit=5 if user.is_admin else 3,
                    warning=0,
                    address='123 Library Street',
                    phone=1234567890,
                )
                self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))
        
        self.stdout.write(self.style.SUCCESS('\nDatabase seeded successfully!'))
        self.stdout.write(self.style.SUCCESS(f'Created {Category.objects.count()} categories'))
        self.stdout.write(self.style.SUCCESS(f'Created {Book.objects.count()} books'))
        self.stdout.write(self.style.SUCCESS(f'Created {User.objects.count()} users'))

