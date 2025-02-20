
/wp/v2/

Update Profile
    {
        "first_name": "asd",
        "last_name": "assd",
        "nickname": "asdddsa",
        "description": "Thong tin mo ta user test02",
        "simple_local_avatar": {
            "media_id": 139
        }
    }
    1. call api: "[MEDIA] Upload media - Custom" để upload hình ảnh -> object -> id
    2. call api: "[USER] Update Profile and Avatar", gán id ở bước 1 vào media_id


admin
    
    Category
        CategoryIndexPage.jsx: admin/categories
        CategoryCreatePage.jsx: admin/categories/create
        CategoryEditPage.jsx: admin/categories/[id]/edit 
    Article
        ArticleIndexPage.jsx: admin/articles
        ArticleCreatePage.jsx: admin/articles/create
        ArticleEditPage.jsx: admin/articles/[id]/edit 
    Users
        ..............
    Auth
        Profile.jsx
        ChangePassord.jsx

Bố trí trang danh sách dạng table vì về sau còn tích hợp phân trang và tìm kiếm lọc dữ liệu
    





