# Digital Library Management System

یک سیستم مدیریت کتابخانه دیجیتال مدرن با Django REST Framework و Next.js

## ویژگی‌ها

- 📚 مدیریت کامل کتاب‌ها (CRUD)
- 👥 سیستم کاربری و احراز هویت
- 📖 سیستم امانت و بازگرداندن کتاب
- 🛒 سیستم خرید کتاب
- 📊 آمار و گزارشات
- 🎨 رابط کاربری مدرن با تم تیره
- 📱 طراحی واکنش‌گرا
- 🖼️ پشتیبانی از تصاویر با کیفیت

## نصب و راه‌اندازی

### Backend (Django)

1. نصب وابستگی‌ها:
```bash
pip install -r requirements.txt
```

2. اجرای migrations:
```bash
python manage.py migrate
```

3. ایجاد داده‌های نمونه (اختیاری):
```bash
python manage.py seed_data
```

این دستور:
- 10 دسته‌بندی ایجاد می‌کند
- 20+ کتاب با تصاویر با کیفیت اضافه می‌کند
- 4 کاربر نمونه ایجاد می‌کند

4. اجرای سرور:
```bash
python manage.py runserver
```

### Frontend (Next.js)

1. رفتن به پوشه frontend:
```bash
cd frontend
```

2. نصب وابستگی‌ها:
```bash
npm install
```

3. اجرای سرور توسعه:
```bash
npm run dev
```

## کاربران پیش‌فرض

پس از اجرای `seed_data`:

- **Admin**: username: `admin`, password: `password123`
- **User 1**: username: `john_doe`, password: `password123`
- **User 2**: username: `jane_smith`, password: `password123`
- **User 3**: username: `booklover`, password: `password123`

## ساختار پروژه

```
shopweb/
├── account/          # اپلیکیشن مدیریت کاربران
├── book/             # اپلیکیشن مدیریت کتاب‌ها
├── shopweb/          # تنظیمات اصلی Django
├── frontend/          # فرانت‌اند Next.js
├── media/             # فایل‌های آپلود شده (تصاویر)
└── db.sqlite3         # دیتابیس SQLite
```

## API Endpoints

### Books
- `GET /books/` - لیست کتاب‌ها
- `GET /books/<id>/` - جزئیات کتاب
- `POST /books/create/` - ایجاد کتاب (ادمین)
- `PUT /books/<id>/update/` - به‌روزرسانی کتاب (ادمین)
- `DELETE /books/<id>/delete/` - حذف کتاب (ادمین)

### Authentication
- `POST /accounts/register/` - ثبت‌نام
- `POST /accounts/login/` - ورود
- `POST /accounts/logout/` - خروج

### Borrow
- `POST /borrows/create/` - امانت گرفتن کتاب
- `POST /borrows/<id>/return/` - بازگرداندن کتاب
- `GET /borrows/` - لیست امانت‌ها

## تکنولوژی‌ها

### Backend
- Django 5.1.5
- Django REST Framework
- SQLite
- Pillow (برای تصاویر)

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Axios

## لایسنس

MIT

