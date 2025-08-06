# 🛍️ FetchCart – AI-Powered Smart Shopping Assistant

FetchCart is an AI-driven web application that simplifies online shopping. Just enter a product-related prompt and get real-time curated product listings scraped from the internet, complete with descriptions, links, and comparisons — all powered by AI.

## 🚀 Features

- 🔍 **Smart Product Search**: Search products using natural language prompts and get live results.
- 🔗 **Direct Product Links**: Navigate directly to the product’s source for quick purchase.
- ⚖️ **Smart Product Comparison**: Enter product URLs to receive detailed comparisons including pros, cons, and key suggestions.
- 💬 **User Chat**: Connect and chat with other users during skill swaps or comparisons.
- 👥 **Community Section**: Discover shared searches, comparisons, and learn from others.
- 📈 **Trending Products**: Explore what's popular in the market via the trends section.

## 🧠 Powered By

- **Gemini API** – For natural language understanding and AI-generated comparisons.
- **ScraperAPI / ScrapAPI** – To fetch live product data from external sources.

## 🛠️ Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Real-time**: WebSockets
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT / Sessions (if applicable)
- **UI**: Aceternity UI components

## 🧪 Installation & Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/fetchcart.git
cd fetchcart

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev

```

## 📁 Folder Structure (Basic)
```bash
/client       - Frontend code (Next.js)
/server       - Backend APIs (Express)
/prisma       - Prisma schema and DB setup
/public       - Static files
.env          - Environment variables
```


## 🙌 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss.

## 🌐 Live Demo
https://fetchcart-ai-find.vercel.app/