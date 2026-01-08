![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Utility--First-38BDF8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![AWS S3](https://img.shields.io/badge/AWS-S3-232F3E?style=for-the-badge&logo=amazonaws)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod)

<!-- PROJECT LOGO -->

<br />
<div align="center">
  <a href="https://github.com/Mauriciocr207/Bookify">
    <img src="public/bookify-dark.svg" alt="Logo" width="150" height="150">
  </a>

  <h3 align="center">Bookify</h3>

  <p align="center">
    Web application to manage, organize, and share academic books
    <br />
    <a href="https://github.com/Mauriciocr207/Bookify"><strong>Explore the repository »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Mauriciocr207/Bookify/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Mauriciocr207/Bookify/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#project-structure">Project Structure</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
        <li><a href="#available-scripts">Available Scripts</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

**Bookify** is an early-stage **MVP (Minimum Viable Product)** created to showcase my skills as a **fullstack web developer**. Rather than being presented as a production-ready platform, this project serves as a technical demonstration of how a virtual library system *could* be designed, structured, and implemented using modern web technologies.

The focus of this MVP is on:

* Designing a clean and scalable **frontend architecture**
* Implementing **server-side logic** and data handling
* Integrating third-party services (storage, database, APIs)
* Applying best practices in **TypeScript**, state management, and validation

This repository represents a solid foundation for a potential virtual library platform, while primarily acting as a portfolio project that highlights my ability to build, structure, and reason about fullstack applications.

<p align="right">(<a href="#readme-top">back to top</a>)</p></p>

### Project Structure

```text
Bookify/
├── .github/                # GitHub configuration (CI, templates, ownership)
│   └── workflows/          # GitHub Actions (ESLint, checks)
├── public/                 # Static assets (images, icons, logos)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (main)/         # Main application routes
│   │   │   ├── components/ # Page-specific UI components
│   │   │   └── saved-books/# Folder & book management views
│   │   └── share-books/    # Book sharing flow
│   ├── components/         # Global reusable components
│   │   ├── common/         # Shared UI elements (BookItem, Header, Modals)
│   │   └── icons/          # Custom SVG icon components
│   ├── context/            # Global state management (Folder context)
│   ├── hooks/              # Custom React hooks
│   ├── models/             # Data layer (IndexedDB, Prisma, business logic)
│   ├── interfaces/         # TypeScript interfaces and domain models
│   ├── providers/          # Global providers (UI, theme, etc.)
│   ├── styles/             # Global styles and third-party CSS
│   └── utils/              # Utility and helper functions
├── prisma/                 # Prisma schema and migrations
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration

```

This structure follows modern Next.js App Router conventions, separating concerns between routing, UI components, business logic, and data access.
The project is designed to scale while remaining easy to maintain and extend.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built using a modern fullstack JavaScript ecosystem:

* **Next.js** – Fullstack React framework using the App Router
* **React** – Component-based UI library
* **TypeScript** – Strong typing and improved developer experience
* **Prisma** – Database ORM and schema management
* **Tailwind CSS** – Utility-first styling
* **TanStack Query** – Server-state management
* **Supabase** – Authentication and backend services
* **Cloudflare R2 (S3-compatible)** – Object storage for files
* **Zod** – Schema validation and type-safe forms


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

Make sure you have the following installed:

* **Node.js** (v18 or later recommended)
* **npm** or **pnpm**
* **Git**

If you plan to use the database features:

* A supported database (configured via Prisma)

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/Mauriciocr207/Bookify.git
   ```

2. Navigate to the project directory

   ```sh
   cd Bookify
   ```

3. Install dependencies

   ```sh
   npm install
   ```

4. Set up environment variables (see next section)

5. Run the development server

   ```sh
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Environment Variables

Create a `.env` file in the root of the project and define the following variables:

```env
# Cloudflare R2 (S3-compatible storage)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_DEV_URL=""

# MODE
# MODE="dev"

# Supabase
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

# Database (Prisma)
DATABASE_URL=""
DIRECT_URL=""
DATABASE_PASS=""
```

The required variables depend on the features you enable (storage, database, authentication).
Make sure to restart the development server after modifying environment variables.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Available Scripts

The following scripts are available via `npm run`:

* `dev` – Runs the app in development mode with Turbopack
* `build` – Builds the application for production
* `start` – Starts the production server
* `lint` – Runs ESLint
* `prisma:pull` – Pulls the database schema
* `prisma:generate` – Generates Prisma client
* `prisma:migrate` – Runs database migrations
* `prisma:seed` – Seeds the database

<p align="right">(<a href="#readme-top">back to top</a>)</p>

> ⚠️ This project is an MVP intended for demonstration and portfolio purposes.  
> It is not designed to be production-ready without further security, scalability, and performance considerations.

## Contact

Mauricio Carrillo
[linkedin.com/in/enrique-carrillo-romero](https://www.linkedin.com/in/enrique-carrillo-romero/)
📧 [enrique.mauricio.carrillo.romero@gmail.com](mailto:enrique.mauricio.carrillo.romero@gmail.com)

Project Link: [https://github.com/Mauriciocr207/Bookify](https://github.com/Mauriciocr207/Bookify)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/Mauriciocr207/Bookify.svg?style=for-the-badge
[contributors-url]: https://github.com/Mauriciocr207/Bookify/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Mauriciocr207/Bookify.svg?style=for-the-badge
[forks-url]: https://github.com/Mauriciocr207/Bookify/network/members
[stars-shield]: https://img.shields.io/github/stars/Mauriciocr207/Bookify.svg?style=for-the-badge
[stars-url]: https://github.com/Mauriciocr207/Bookify/stargazers
[issues-shield]: https://img.shields.io/github/issues/Mauriciocr207/Bookify.svg?style=for-the-badge
[issues-url]: https://github.com/Mauriciocr207/Bookify/issues
[license-shield]: https://img.shields.io/github/license/Mauriciocr207/Bookify.svg?style=for-the-badge
[license-url]: https://github.com/Mauriciocr207/Bookify/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/enrique-carrillo-romero/
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Mauriciocr207/Bookify.svg?style=for-the-badge
[contributors-url]: https://github.com/Mauriciocr207/Bookify/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Mauriciocr207/Bookify.svg?style=for-the-badge
[forks-url]: https://github.com/Mauriciocr207/Bookify/network/members
[stars-shield]: https://img.shields.io/github/stars/Mauriciocr207/Bookify.svg?style=for-the-badge
[stars-url]: https://github.com/Mauriciocr207/Bookify/stargazers
[issues-shield]: https://img.shields.io/github/issues/Mauriciocr207/Bookify.svg?style=for-the-badge
[issues-url]: https://github.com/Mauriciocr207/Bookify/issues
[license-shield]: https://img.shields.io/github/license/Mauriciocr207/Bookify.svg?style=for-the-badge
[license-url]: https://github.com/Mauriciocr207/Bookify/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/enrique-carrillo-romero/
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/