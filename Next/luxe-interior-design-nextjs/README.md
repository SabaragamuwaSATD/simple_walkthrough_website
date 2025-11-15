# luxe-interior-design-nextjs

This is a Next.js project for a luxury interior design website. The project has been structured to provide a clean and efficient layout, utilizing Next.js features for optimal performance and SEO.

## Project Structure

- **public/**: Contains static assets such as images, logos, models, music, and videos.
- **src/app/**: Contains the main application files, including layout and individual pages.
  - **layout.jsx**: Defines the layout component for the application.
  - **page.jsx**: The main entry point for the application, rendering the home page.
  - **about/page.jsx**: Defines the about page.
  - **contact/page.jsx**: Defines the contact page.
  - **portfolio/page.jsx**: Defines the portfolio page.
  - **services/page.jsx**: Defines the services page.
  - **products/page.jsx**: Defines the products page.
- **src/components/**: Contains reusable components used throughout the application.
  - **Footer.jsx**: Displays the footer section.
  - **Hero.jsx**: Displays a prominent section on the home page.
  - **Model.jsx**: Displays a specific model or item.
  - **ModernParallax.jsx**: Implements a parallax scrolling effect.
  - **Navbar.jsx**: Used for navigation throughout the application.
- **src/hooks/**: Contains custom hooks for the application.
  - **useScrollTrigger.js**: Tracks scroll position and triggers events based on scrolling.

## Getting Started

1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd luxe-interior-design-nextjs
   ```

2. **Install Dependencies**: 
   ```bash
   npm install
   ```

3. **Run the Development Server**: 
   ```bash
   npm run dev
   ```

4. **Open in Browser**: Navigate to `http://localhost:3000` to view the application.

## Features

- Responsive design with Tailwind CSS.
- File-based routing for easy navigation.
- Custom hooks for enhanced functionality.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.