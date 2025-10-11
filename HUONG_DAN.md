# Hướng dẫn Admin Dashboard

## 📋 Giới thiệu

Admin Dashboard là ứng dụng web quản trị được xây dựng bằng React + TypeScript + Vite. Cung cấp giao diện quản lý hiện đại, responsive và dễ sử dụng.

## 🚀 Cài đặt và khởi chạy

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0

### Các bước cài đặt
1. Clone repository và di chuyển vào thư mục admin
2. Chạy `npm install` để cài đặt dependencies
3. Tạo file `.env` với các biến môi trường cần thiết
4. Chạy `npm run dev` để khởi động development server
5. Mở trình duyệt tại `http://localhost:5173`

### Scripts NPM
- `npm run dev` - Khởi chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Xem trước build
- `npm run lint` - Kiểm tra linting
- `npm run test` - Chạy tests

## 🏗️ Cấu trúc dự án

### Cấu trúc thư mục đầy đủ

```
admin/
├── src/                    # Mã nguồn chính
│   ├── api/                # API calls và service
│   │   ├── endpoints/      # Định nghĩa các endpoints API
│   │   └── axiosClient.ts  # Cấu hình Axios client
│   ├── assets/             # Static assets (hình ảnh, fonts, ...)
│   ├── components/         # React components tái sử dụng
│   │   ├── common/         # Components dùng chung (Button, Input, etc.)
│   │   ├── landing/        # Components cho trang landing
│   │   │   ├── Header/     # Component header
│   │   │   ├── Hero/       # Component hero section
│   │   │   ├── Features/   # Component giới thiệu tính năng
│   │   │   ├── Metrics/    # Component hiển thị số liệu
│   │   │   ├── Team/       # Component giới thiệu đội ngũ
│   │   │   └── Footer/     # Component footer
│   │   └── layout/         # Components layout (Sidebar, Navbar, etc.)
│   ├── hooks/              # React hooks tùy chỉnh
│   ├── pages/              # Components trang
│   ├── routes/             # Cấu hình định tuyến
│   │   ├── auth/           # Chức năng xác thực
│   │   │   ├── Login.tsx   # Trang đăng nhập
│   │   │   └── Register.tsx# Trang đăng ký
│   │   ├── home/           # Trang chủ
│   │   │   └── index.tsx   # Component trang chủ
│   │   └── index.tsx       # Cấu hình routes
│   ├── styles/             # Kiểu dáng global và module
│   ├── App.tsx             # Component gốc, cấu hình Router
│   ├── index.css           # CSS toàn cục
│   └── main.tsx            # Entry point, render app vào DOM
├── public/                 # Static files
├── docs/                   # Tài liệu dự án
├── package.json            # Dependency và scripts
├── vite.config.ts          # Cấu hình Vite
├── tsconfig.json           # Cấu hình TypeScript
├── .env                    # Environment variables
├── .env.example            # Template cho environment variables
├── .gitignore              # Git ignore rules
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
└── README.md               # Hướng dẫn cơ bản
```

### Thư mục chính
- **`src/`** - Mã nguồn chính của ứng dụng
- **`public/`** - Files tĩnh (favicon, images)
- **`docs/`** - Tài liệu dự án

### Trong src/
- **`api/`** - Quản lý API calls và HTTP requests
  - `endpoints/` - Định nghĩa các API endpoints
  - `axiosClient.ts` - Cấu hình Axios base
  
- **`assets/`** - Tài nguyên tĩnh (images, fonts, icons)

- **`components/`** - React components
  - `common/` - Components dùng chung (Button, Input, Modal)
  - `landing/` - Components trang landing (Header, Hero, Features)
  - `layout/` - Layout components (Sidebar, Navbar, Footer)

- **`hooks/`** - Custom React hooks (useAuth, useLocalStorage, useApi)

- **`pages/`** - Page components hoàn chỉnh

- **`routes/`** - Cấu hình định tuyến
  - `auth/` - Trang đăng nhập, đăng ký
  - `home/` - Trang chủ dashboard
  - `index.tsx` - Main router config

- **`styles/`** - CSS global và styling

- **`App.tsx`** - Root component
- **`main.tsx`** - Entry point
- **`index.css`** - CSS toàn cục

## 🧩 Components Development

### Phân loại Components
1. **Common Components** - Tái sử dụng toàn ứng dụng (Button, Input, Modal)
2. **Layout Components** - Định nghĩa layout (MainLayout, Sidebar, Header)
3. **Feature Components** - Dành riêng cho tính năng cụ thể
4. **Page Components** - Đại diện cho trang hoàn chỉnh

### Quy tắc tổ chức
- Mỗi component có folder riêng
- File `index.tsx` chính
- File `.types.ts` cho TypeScript interfaces
- File `.css` cho component styles
- Folder `components/` cho sub-components nếu cần

### Nguyên tắc thiết kế
- Single Responsibility - mỗi component chỉ làm một việc
- Composition over Inheritance
- Props interface với TypeScript
- Default values cho props

## 📡 API Management

### Cấu trúc API
- **`axiosClient.ts`** - Cấu hình base Axios, interceptors, error handling
- **`endpoints/`** - Chia theo module (auth.ts, users.ts, dashboard.ts)

### Flow xử lý API
1. Component gọi custom hook
2. Hook sử dụng API function từ endpoints
3. API function dùng axiosClient để gọi HTTP request
4. Response được xử lý và trả về component

### Error handling
- Global error handling trong axios interceptors
- Component-level error handling với try-catch
- User-friendly error messages

## 🛣️ Routing

### Cấu trúc Routes
- **Main Router** - Cấu hình React Router chính
- **Protected Routes** - Route bảo vệ cần authentication
- **Public Routes** - Route công khai
- **Route Guards** - Kiểm tra quyền truy cập

### Authentication Flow
1. User đăng nhập
2. Server trả về JWT token
3. Token được lưu localStorage
4. Axios interceptor tự động thêm token vào header
5. Protected routes kiểm tra token validity

## 🎣 Custom Hooks

### Hooks phổ biến
- **useAuth** - Quản lý authentication state
- **useApi** - Wrapper cho API calls với loading/error states
- **useLocalStorage** - Quản lý browser storage
- **useDebounce** - Debounce input values
- **useTheme** - Theme management

### Lợi ích
- Tái sử dụng logic giữa components
- Encapsulate complex state logic
- Easier testing
- Cleaner component code

## 🎨 Styling Guidelines

### CSS Organization
- Global styles trong `styles/`
- Component-specific styles cùng với component
- CSS custom properties cho theming
- Mobile-first responsive design

### Naming Convention
- BEM methodology cho CSS classes
- kebab-case cho file names
- PascalCase cho component names
- camelCase cho variables

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (0px), tablet (768px), desktop (1024px)
- Flexible layouts với CSS Grid và Flexbox

## 🧪 Testing Strategy

### Testing Types
- **Unit Tests** - Test individual components và functions
- **Integration Tests** - Test component interactions
- **E2E Tests** - Test user workflows

### Testing Tools
- Vitest cho unit testing
- React Testing Library cho component testing
- MSW cho API mocking

### Testing Best Practices
- Test behavior, not implementation
- Use accessible queries
- Mock external dependencies
- Keep tests simple và focused

## 📦 Build và Deployment

### Development Build
- Hot module replacement
- Source maps cho debugging
- Fast refresh
- Development-only tools

### Production Build
- Code minification
- Tree shaking
- Asset optimization
- Bundle analysis

### Deployment Options
- **Netlify** - Simple static hosting
- **Vercel** - Zero-config deployment
- **AWS S3** - Scalable cloud hosting
- **Docker** - Containerized deployment

## 🔧 Development Workflow

### Git Workflow
1. Tạo feature branch từ main
2. Develop feature với frequent commits
3. Tạo Pull Request
4. Code review và feedback
5. Merge sau khi approve

### Code Quality
- ESLint cho code consistency
- Prettier cho code formatting
- Husky cho pre-commit hooks
- TypeScript cho type safety

### Environment Management
- Development environment cho local dev
- Staging environment cho testing
- Production environment cho users

## 📚 Best Practices

### Performance
- Code splitting với React.lazy
- Memoization với React.memo, useMemo, useCallback
- Image optimization
- Bundle size monitoring

### Security
- Input validation
- XSS protection
- CSRF protection
- Secure token storage

### Accessibility
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support

### Maintainability
- Clear naming conventions
- Consistent code structure
- Comprehensive documentation
- Regular refactoring

## 🚀 Tips và Tricks

### Development Tips
- Sử dụng React DevTools cho debugging
- Browser DevTools cho performance analysis
- VS Code extensions cho better DX
- Hot reload để tăng productivity

### Common Patterns
- Higher-Order Components cho logic reuse
- Compound Components cho complex UI
- Render Props pattern
- Custom Hooks cho stateful logic

### Troubleshooting
- Clear npm cache nếu có lỗi dependency
- Restart TypeScript server cho type errors
- Check console errors cho runtime issues
- Use React Error Boundaries cho error handling

## 📞 Hỗ trợ

### Tài liệu tham khảo
- React Official Documentation
- TypeScript Handbook
- Vite Guide
- React Router Documentation

### Community Resources
- Stack Overflow cho Q&A
- GitHub Issues cho bug reports
- Discord/Slack cho real-time help

---

**Chúc bạn phát triển thành công! 🎉**
