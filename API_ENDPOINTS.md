# API Endpoints Documentation

Base URL: `http://localhost:PORT` (Replace PORT with your server port)

## Admin APIs

### Auth APIs

#### 1. POST Sign Up
```bash
curl -X POST {{BASE_URL}}/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "designation": "Developer",
    "referralCode": "REF123",
    "agreeTerms": true
  }'
```

#### 2. POST Login
```bash
curl -X POST {{BASE_URL}}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 3. POST OTP Verify
```bash
curl -X POST {{BASE_URL}}/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

#### 4. POST Forgot Password
```bash
curl -X POST {{BASE_URL}}/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

#### 5. POST Reset Password
```bash
curl -X POST {{BASE_URL}}/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "newPassword": "newpassword123"
  }'
```

#### 6. POST Resend OTP
```bash
curl -X POST {{BASE_URL}}/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

#### 7. POST Change Password
```bash
curl -X POST {{BASE_URL}}/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "oldPassword": "password123",
    "newPassword": "newpassword123"
  }'
```

#### 8. POST Update Profile
```bash
curl -X POST {{BASE_URL}}/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_TOKEN_HERE" \
  -d '{
    "fullName": "John Doe Updated",
    "phone": "+1234567890",
    "designation": "Senior Developer",
    "profilePhoto": "https://example.com/photo.jpg"
  }'
```

---

### User APIs

#### 1. POST Add User
```bash
curl -X POST {{BASE_URL}}/user/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phoneNumber": "+1234567890",
    "password": "password123",
    "designation": "Manager",
    "role": "user",
    "agreeTerms": true
  }'
```

#### 2. POST Update User
```bash
curl -X POST {{BASE_URL}}/user/update \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "userId": "USER_ID_HERE",
    "fullName": "Jane Smith Updated",
    "phone": "+1234567890",
    "designation": "Senior Manager",
    "profilePhoto": "https://example.com/photo.jpg"
  }'
```

#### 3. DELETE Delete User
```bash
curl -X DELETE {{BASE_URL}}/user/delete/USER_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Users
```bash
curl -X GET "{{BASE_URL}}/user/get?page=1&limit=10&search=john&role=user&isBlocked=false&isEmailVerified=true&startDate=2024-01-01&endDate=2024-12-31" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 5. GET Get User By ID
```bash
curl -X GET {{BASE_URL}}/user/get/USER_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

---

### Blog APIs

#### 1. POST Add Blog
```bash
curl -X POST {{BASE_URL}}/blog/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog",
    "subTitle": "Subtitle here",
    "content": "Blog content here",
    "category": "Technology",
    "coverImage": "https://example.com/cover.jpg",
    "mainImage": "https://example.com/main.jpg",
    "author": "John Doe",
    "quote": "Inspirational quote",
    "isFeatured": true
  }'
```

#### 2. POST Update Blog
```bash
curl -X POST {{BASE_URL}}/blog/edit \
  -H "Content-Type: application/json" \
  -d '{
    "blogId": "BLOG_ID_HERE",
    "title": "Updated Blog Title",
    "subtitle": "Updated subtitle",
    "content": "Updated content",
    "category": "Technology",
    "isFeatured": false
  }'
```

#### 3. DELETE Delete Blog
```bash
curl -X DELETE {{BASE_URL}}/blog/delete/BLOG_ID_HERE
```

#### 4. GET Get All Blogs
```bash
curl -X GET "{{BASE_URL}}/blog/all?page=1&limit=10&search=technology&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get Blog By ID
```bash
curl -X GET {{BASE_URL}}/blog/BLOG_ID_HERE
```

---

### Course Category APIs

#### 1. POST Add Course Category
```bash
curl -X POST {{BASE_URL}}/course-category/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Web Development",
    "description": "Learn web development",
    "countCoursesNumber": 10,
    "addCourses": true,
    "isFeatured": true
  }'
```

#### 2. POST Update Course Category
```bash
curl -X POST {{BASE_URL}}/course-category/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "categoryId": "CATEGORY_ID_HERE",
    "name": "Advanced Web Development",
    "description": "Advanced web development courses",
    "isFeatured": true
  }'
```

#### 3. DELETE Delete Course Category
```bash
curl -X DELETE {{BASE_URL}}/course-category/CATEGORY_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Course Categories
```bash
curl -X GET "{{BASE_URL}}/course-category/all?page=1&limit=10&search=web&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get Course Category By ID
```bash
curl -X GET {{BASE_URL}}/course-category/get/CATEGORY_ID_HERE
```

---

### Course APIs

#### 1. POST Add Course
```bash
curl -X POST {{BASE_URL}}/course/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "courseName": "React Masterclass",
    "courseCategoryId": "CATEGORY_ID_HERE",
    "description": "Learn React from scratch",
    "price": 99.99,
    "image": "https://example.com/course.jpg",
    "purchasedCoursesShow": true,
    "enrolledLearners": 0,
    "classCompleted": 0,
    "satisfactionRate": 0
  }'
```

#### 2. POST Update Course
```bash
curl -X POST {{BASE_URL}}/course/update \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "courseId": "COURSE_ID_HERE",
    "courseName": "Advanced React Masterclass",
    "price": 149.99,
    "enrolledLearners": 50
  }'
```

#### 3. DELETE Delete Course
```bash
curl -X DELETE {{BASE_URL}}/course/delete/COURSE_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. POST Purchase Course
```bash
curl -X POST {{BASE_URL}}/course/purchase \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_USER_TOKEN_HERE" \
  -d '{
    "courseId": "COURSE_ID_HERE",
    "razorpayOrderId": "ORDER_ID_HERE",
    "razorpayPaymentId": "PAYMENT_ID_HERE"
  }'
```

#### 5. GET Get My Courses
```bash
curl -X GET "{{BASE_URL}}/course/my-courses?page=1&limit=10" \
  -H "authorization: YOUR_USER_TOKEN_HERE"
```

#### 6. GET Get All Courses
```bash
curl -X GET "{{BASE_URL}}/course/get?page=1&limit=10&search=react&courseCategoryId=CATEGORY_ID_HERE&startDate=2024-01-01&endDate=2024-12-31"
```

#### 7. GET Get Course By ID
```bash
curl -X GET {{BASE_URL}}/course/COURSE_ID_HERE
```

---

### Settings APIs

#### 1. POST Add/Edit Settings
```bash
curl -X POST {{BASE_URL}}/settings/add-edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "logo": "https://example.com/logo.png",
    "razorpayKey": "YOUR_RAZORPAY_KEY",
    "razorpaySecret": "YOUR_RAZORPAY_SECRET",
    "enrolledLearners": 1000,
    "classCompleted": 500,
    "satisfactionRate": 95
  }'
```

#### 2. GET Get Settings
```bash
curl -X GET {{BASE_URL}}/settings/get
```

---

### Hero Banner APIs

#### 1. POST Add Hero Banner
```bash
curl -X POST {{BASE_URL}}/hero-banner/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "type": "Web",
    "title": "Welcome to Our Platform",
    "description": "Learn new skills",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
  }'
```

#### 2. POST Update Hero Banner
```bash
curl -X POST {{BASE_URL}}/hero-banner/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "heroBannerId": "BANNER_ID_HERE",
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

#### 3. DELETE Delete Hero Banner
```bash
curl -X DELETE {{BASE_URL}}/hero-banner/delete/BANNER_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Hero Banners
```bash
curl -X GET "{{BASE_URL}}/hero-banner/all?page=1&limit=10&search=welcome&type=Web&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get Hero Banner By ID
```bash
curl -X GET {{BASE_URL}}/hero-banner/BANNER_ID_HERE
```

---

### Testimonial APIs

#### 1. POST Add Testimonial
```bash
curl -X POST {{BASE_URL}}/testimonial/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "image": "https://example.com/photo.jpg",
    "name": "John Doe",
    "designation": "Software Engineer",
    "rate": 5,
    "description": "Great course!",
    "isFeatured": true,
    "type": "Course"
  }'
```

#### 2. POST Update Testimonial
```bash
curl -X POST {{BASE_URL}}/testimonial/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "testimonialId": "TESTIMONIAL_ID_HERE",
    "name": "John Doe Updated",
    "rate": 5
  }'
```

#### 3. DELETE Delete Testimonial
```bash
curl -X DELETE {{BASE_URL}}/testimonial/delete/TESTIMONIAL_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Testimonials
```bash
curl -X GET "{{BASE_URL}}/testimonial/all?page=1&limit=10&search=john&type=Course&isFeatured=true&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get Testimonial By ID
```bash
curl -X GET {{BASE_URL}}/testimonial/TESTIMONIAL_ID_HERE
```

---

### Trusted Partner APIs

#### 1. POST Add Trusted Partner
```bash
curl -X POST {{BASE_URL}}/trusted-partner/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "image": "https://example.com/partner.jpg",
    "name": "Partner Company",
    "description": "Our trusted partner"
  }'
```

#### 2. POST Update Trusted Partner
```bash
curl -X POST {{BASE_URL}}/trusted-partner/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "trustedPartnerId": "PARTNER_ID_HERE",
    "name": "Updated Partner Name"
  }'
```

#### 3. DELETE Delete Trusted Partner
```bash
curl -X DELETE {{BASE_URL}}/trusted-partner/delete/PARTNER_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Trusted Partners
```bash
curl -X GET "{{BASE_URL}}/trusted-partner/all?page=1&limit=10&search=partner&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get Trusted Partner By ID
```bash
curl -X GET {{BASE_URL}}/trusted-partner/PARTNER_ID_HERE
```

---

### FAQ APIs

#### 1. POST Add FAQ
```bash
curl -X POST {{BASE_URL}}/faq/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "question": "What is this course about?",
    "answer": "This course teaches web development",
    "isFeatured": true,
    "type": "Course"
  }'
```

#### 2. POST Update FAQ
```bash
curl -X POST {{BASE_URL}}/faq/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "faqId": "FAQ_ID_HERE",
    "question": "Updated question",
    "answer": "Updated answer"
  }'
```

#### 3. DELETE Delete FAQ
```bash
curl -X DELETE {{BASE_URL}}/faq/delete/FAQ_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All FAQs
```bash
curl -X GET "{{BASE_URL}}/faq/all?page=1&limit=10&search=course&type=Course&isFeatured=true&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get FAQ By ID
```bash
curl -X GET {{BASE_URL}}/faq/FAQ_ID_HERE
```

---

### Newsletter APIs

#### 1. POST Subscribe Newsletter
```bash
curl -X POST {{BASE_URL}}/newsletter/add \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

#### 2. DELETE Unsubscribe Newsletter
```bash
curl -X DELETE {{BASE_URL}}/newsletter/delete/NEWSLETTER_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 3. GET Get All Newsletter Subscriptions
```bash
curl -X GET "{{BASE_URL}}/newsletter/all?page=1&limit=10&search=user@example.com&startDate=2024-01-01&endDate=2024-12-31" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get Newsletter By ID
```bash
curl -X GET {{BASE_URL}}/newsletter/NEWSLETTER_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

---

### Gallery APIs

#### 1. POST Add Gallery
```bash
curl -X POST {{BASE_URL}}/gallery/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
    "title": "Event Gallery",
    "description": "Photos from our event"
  }'
```

#### 2. POST Update Gallery
```bash
curl -X POST {{BASE_URL}}/gallery/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "galleryId": "GALLERY_ID_HERE",
    "title": "Updated Gallery Title"
  }'
```

#### 3. DELETE Delete Gallery
```bash
curl -X DELETE {{BASE_URL}}/gallery/delete/GALLERY_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Galleries
```bash
curl -X GET "{{BASE_URL}}/gallery/all?page=1&limit=10&search=event&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get Gallery By ID
```bash
curl -X GET {{BASE_URL}}/gallery/GALLERY_ID_HERE
```

---

### Legality APIs

#### 1. POST Add Legality
```bash
curl -X POST {{BASE_URL}}/legality/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "type": "TermsCondition",
    "content": "Terms and conditions content here..."
  }'
```

#### 2. POST Update Legality
```bash
curl -X POST {{BASE_URL}}/legality/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "legalityId": "LEGALITY_ID_HERE",
    "content": "Updated content..."
  }'
```

#### 3. GET Get All Legalities
```bash
curl -X GET "{{BASE_URL}}/legality/all?page=1&limit=10&type=TermsCondition&startDate=2024-01-01&endDate=2024-12-31"
```

#### 4. GET Get Legality By ID
```bash
curl -X GET {{BASE_URL}}/legality/LEGALITY_ID_HERE
```

#### 5. GET Get Legality By Type
```bash
curl -X GET {{BASE_URL}}/legality/type/TermsCondition
```

---

### Get In Touch APIs

#### 1. POST Add Contact Message
```bash
curl -X POST {{BASE_URL}}/get-in-touch/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "subject": "Inquiry",
    "message": "I have a question about your services"
  }'
```

#### 2. POST Update Contact Message
```bash
curl -X POST {{BASE_URL}}/get-in-touch/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "getInTouchId": "CONTACT_ID_HERE",
    "isRead": true
  }'
```

#### 3. DELETE Delete Contact Message
```bash
curl -X DELETE {{BASE_URL}}/get-in-touch/delete/CONTACT_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Contact Messages
```bash
curl -X GET "{{BASE_URL}}/get-in-touch/all?page=1&limit=10&search=john&isRead=false&startDate=2024-01-01&endDate=2024-12-31" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 5. GET Get Contact Message By ID
```bash
curl -X GET {{BASE_URL}}/get-in-touch/CONTACT_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

---

### Workshop APIs

#### 1. POST Add Workshop
```bash
curl -X POST {{BASE_URL}}/workshop/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "image": "https://example.com/workshop.jpg",
    "title": "Advanced React Workshop",
    "subTitle": "Learn React in depth",
    "about": "Comprehensive React workshop",
    "price": 199.99,
    "mrpPrice": 299.99,
    "language": "English",
    "duration": "40 hours"
  }'
```

#### 2. POST Update Workshop
```bash
curl -X POST {{BASE_URL}}/workshop/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "workshopId": "WORKSHOP_ID_HERE",
    "title": "Updated Workshop Title",
    "price": 249.99
  }'
```

#### 3. DELETE Delete Workshop
```bash
curl -X DELETE {{BASE_URL}}/workshop/delete/WORKSHOP_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Workshops
```bash
curl -X GET "{{BASE_URL}}/workshop/all?page=1&limit=10&search=react&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get Workshop By ID
```bash
curl -X GET {{BASE_URL}}/workshop/WORKSHOP_ID_HERE
```

#### 6. POST Purchase Workshop
```bash
curl -X POST {{BASE_URL}}/workshop/purchase \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_USER_TOKEN_HERE" \
  -d '{
    "workshop_id": "WORKSHOP_ID_HERE",
    "amount": 199.99,
    "payment_id": "PAYMENT_ID_HERE",
    "payment_method": "razorpay",
    "final_amount": 199.99
  }'
```

#### 7. GET Get My Workshops
```bash
curl -X GET "{{BASE_URL}}/workshop/my-workshops?page=1&limit=10" \
  -H "authorization: YOUR_USER_TOKEN_HERE"
```

---

### Workshop Curriculum APIs

#### 1. POST Add Workshop Curriculum
```bash
curl -X POST {{BASE_URL}}/workshop-curriculum/add \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "workshopId": "WORKSHOP_ID_HERE",
    "date": "2024-12-01",
    "thumbnail": "https://example.com/thumb.jpg",
    "videoLink": "https://example.com/video.mp4",
    "title": "Introduction to React",
    "description": "Learn the basics",
    "duration": "2 hours",
    "attachment": "https://example.com/notes.pdf"
  }'
```

#### 2. POST Update Workshop Curriculum
```bash
curl -X POST {{BASE_URL}}/workshop-curriculum/edit \
  -H "Content-Type: application/json" \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "workshopCurriculumId": "CURRICULUM_ID_HERE",
    "title": "Updated Title",
    "duration": "3 hours"
  }'
```

#### 3. DELETE Delete Workshop Curriculum
```bash
curl -X DELETE {{BASE_URL}}/workshop-curriculum/delete/CURRICULUM_ID_HERE \
  -H "authorization: YOUR_ADMIN_TOKEN_HERE"
```

#### 4. GET Get All Workshop Curriculums
```bash
curl -X GET "{{BASE_URL}}/workshop-curriculum/all?page=1&limit=10&workshopId=WORKSHOP_ID_HERE&search=react&startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. GET Get Workshop Curriculum By ID
```bash
curl -X GET {{BASE_URL}}/workshop-curriculum/CURRICULUM_ID_HERE
```

---

## Notes

1. **Authentication Tokens:**
   - Replace `YOUR_TOKEN_HERE` with the actual JWT token received from login/signup
   - Replace `YOUR_ADMIN_TOKEN_HERE` with admin JWT token
   - Replace `YOUR_USER_TOKEN_HERE` with user JWT token

2. **Base URL:**
   - Replace `localhost:PORT` with your actual server URL and port
   - Example: `http://localhost:3000` or `https://api.example.com`

3. **IDs:**
   - Replace placeholder IDs (like `USER_ID_HERE`, `BLOG_ID_HERE`, etc.) with actual MongoDB ObjectIds

4. **Query Parameters:**
   - All query parameters are optional
   - `page` and `limit` are used for pagination
   - `search` is used for searching across relevant fields
   - `startDate` and `endDate` should be in format: `YYYY-MM-DD`

5. **Required Headers:**
   - `Content-Type: application/json` for POST/PUT requests
   - `authorization: TOKEN` for protected routes (adminJWT or userJWT)

