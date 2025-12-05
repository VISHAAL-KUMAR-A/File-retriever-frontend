# Chatbot Frontend - React Application

A modern, responsive React-based frontend for an intelligent chatbot that helps users find and manage files. Built with React 19 and Vite for optimal performance and developer experience.

## 🚀 Features

- **Interactive Chat Interface**: Clean and intuitive chat UI
- **Real-time Messaging**: Seamless communication with the backend
- **File Management**: Upload and view files
- **Chat History**: View past conversations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI/UX**: Beautiful and user-friendly interface
- **Fast Performance**: Built with Vite for lightning-fast development and builds

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Backend API running (see backend README)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd chatbot-frontend/chatbot
```

### 2. Install dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Configure API endpoint

Update the API endpoint in your application to point to your backend server. The default is typically `http://localhost:8000`.

Look for the API configuration in `src/App.jsx` and update the base URL if needed.

### 4. Run the development server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:5173` (default Vite port)

## 📦 Dependencies

### Core Dependencies
- **react ^19.2.0** - JavaScript library for building user interfaces
- **react-dom ^19.2.0** - React package for working with the DOM

### Development Dependencies
- **vite ^7.2.4** - Next-generation frontend build tool
- **@vitejs/plugin-react ^5.1.1** - Official Vite plugin for React
- **eslint ^9.39.1** - JavaScript linter
- **eslint-plugin-react-hooks ^7.0.1** - ESLint plugin for React Hooks
- **eslint-plugin-react-refresh ^0.4.24** - ESLint plugin for React Refresh

## 🎯 Available Scripts

### `npm run dev` / `yarn dev`
Starts the development server with hot module replacement (HMR).

```bash
npm run dev
# or
yarn dev
```

### `npm run build` / `yarn build`
Creates an optimized production build.

```bash
npm run build
# or
yarn build
```

### `npm run preview` / `yarn preview`
Preview the production build locally.

```bash
npm run preview
# or
yarn preview
```

### `npm run lint` / `yarn lint`
Run ESLint to check code quality.

```bash
npm run lint
# or
yarn lint
```

## 🔌 API Integration

The frontend communicates with the Django backend through REST API endpoints:

### Base URL Configuration
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/chat/new` | POST | Create new chat session |
| `/api/v1/chat/send-messages` | POST | Send message to chatbot |
| `/api/v1/chat/{id}/history` | GET | Get chat history |
| `/api/v1/chat/list` | GET | List all chats |
| `/api/v1/chat/{id}/delete` | DELETE | Delete a chat |
| `/api/v1/upload-file` | POST | Upload file to S3 |
| `/api/v1/files/list` | GET | List all files |

## 📁 Project Structure

```
chatbot-frontend/chatbot/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── yarn.lock
```

### Key Files

- **`src/App.jsx`** - Main application component with chat interface
- **`src/App.css`** - Styles for the application
- **`src/main.jsx`** - Application entry point
- **`vite.config.js`** - Vite configuration
- **`eslint.config.js`** - ESLint configuration

## 🎨 Customization

### Styling
The application uses CSS for styling. Main style files:
- `src/App.css` - Component-specific styles
- `src/index.css` - Global styles

### Theme Customization
You can customize colors, fonts, and other design elements by modifying the CSS variables in `src/index.css` or `src/App.css`.

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

This creates a `dist` folder with optimized production files.



## 🔧 Configuration

### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

### ESLint Configuration

The project uses ESLint with React-specific rules. Configuration is in `eslint.config.js`.

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend server is running
   - Check API endpoint URL in the code
   - Verify CORS is enabled on backend

2. **Module Not Found**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   # or
   yarn install
   ```

3. **Port Already in Use**
   - Change the port in `vite.config.js`
   - Or kill the process using the port

4. **Build Errors**
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite
   npm run build
   ```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ⚡ Performance Tips

1. **Code Splitting**: Vite automatically splits code for optimal loading
2. **Lazy Loading**: Use React.lazy() for route-based code splitting
3. **Image Optimization**: Optimize images before uploading
4. **Caching**: Configure proper caching headers on your server

## 🔒 Security Best Practices

1. **API Keys**: Never commit API keys to the repository
2. **Environment Variables**: Use `.env` files for sensitive data
3. **HTTPS**: Always use HTTPS in production
4. **Input Validation**: Validate and sanitize user input
5. **Dependencies**: Regularly update dependencies for security patches

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Use functional components with hooks
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Keep components small and focused

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Version History

- **v0.0.0** - Initial setup
  - React 19 with Vite
  - Chat interface
  - File management
  - API integration

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Hooks Guide](https://react.dev/reference/react)
- [ESLint Documentation](https://eslint.org/)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- All contributors and users of this project
