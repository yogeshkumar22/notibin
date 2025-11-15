# NotiBin - Your Personal Notification Manager

NotiBin is a powerful web application for capturing, organizing, and managing notifications with AI-powered insights.

## Features

### 🎨 Beautiful UI with Dark/Light Mode
- Clean, modern interface built with Next.js and Tailwind CSS
- Toggle between dark and light themes
- Fully responsive design for mobile and desktop

### 📱 Rich Notification Display
- App icons (emoji-based) for easy identification
- Support for notification images
- Priority badges (Low, Normal, High, Urgent)
- Read/Unread status tracking
- Deep links for actionable notifications
- Category tags for organization

### 🔍 Advanced Search & Filtering
- Full-text search across title, content, and app name
- Filter by app, category, and read status
- Sort by newest or oldest
- Real-time results counter

### 📊 Analytics Dashboard
- Interactive charts showing notification trends
- App-wise distribution (bar chart)
- Category breakdown (pie chart)
- Daily trend analysis (line chart)
- Hourly distribution (bar chart)
- Key metrics: total, today, this week, unread

### 🤖 AI-Powered Features
- **Summarization**: Generate concise summaries of notifications
- **Insights Extraction**: Automatically extract:
  - Coupon codes and discounts
  - Deadlines and time-sensitive information
  - Prices and monetary amounts
  - URLs and links
- **Smart Categorization**: AI detects categories (Deals, Social, Work, Finance, etc.)
- **Action Suggestions**: Get suggestions like "Set reminder", "Save deal", "Open link"
- **Sentiment Analysis**: Understand the tone of notifications (Positive, Neutral, Negative)

### 👤 Profile & Data Management
- View storage statistics
- Export notifications to JSON
- Import notifications from backup
- Clear all data with confirmation

### ⚙️ Settings
- Theme preference (Dark/Light)
- AI features toggle
- Auto-categorization control
- Duplicate detection settings

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yogeshkumar22/notibin.git
cd notibin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (for AI features):
```bash
cp .env.example .env.local
# Add your Google AI API key if using AI features
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:9002](http://localhost:9002) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding Notifications
1. Navigate to the Notifications page
2. Fill in the form with:
   - App Name (required)
   - Title (required)
   - Content (required)
   - Optional: App Icon (emoji), Image URL, Deep Link, Priority
3. Click "Save Notification"

### Managing Notifications
- **View Details**: Click "Details" button to see full notification with AI analysis
- **Delete**: Click trash icon to remove a notification
- **Clear All**: Use the "Clear All" button to remove all notifications

### Using AI Features
1. Open a notification's detail view
2. Click "Generate Summary" for a concise summary
3. Click "Analyze with AI" to extract insights and get action suggestions

### Importing Sample Data
To quickly populate with sample data:
1. Go to Profile page
2. Click "Import Data"
3. Select the `sample-data.json` file
4. Page will refresh with sample notifications

## Technology Stack

- **Framework**: Next.js 15.2.3
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **AI**: Google Genkit AI
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Forms**: React Hook Form + Zod

## Project Structure

```
src/
├── app/                      # Next.js app routes
│   ├── analytics/           # Analytics dashboard
│   ├── notifications/       # Notification list and details
│   ├── profile/            # User profile and data management
│   └── settings/           # App settings
├── components/
│   ├── layout/             # Header and layout components
│   ├── notifications/      # Notification-related components
│   └── ui/                 # Reusable UI components (shadcn)
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and types
└── ai/                     # AI flows and configuration
    └── flows/              # AI analysis flows
```

## Features in Detail

### Notification Data Model
Each notification supports:
- Basic info (app, title, content, timestamp)
- Visual elements (icon, image)
- Metadata (category, priority, read status)
- Actions (deep link)
- AI insights (summary, extracted data, suggestions)

### Auto-Categorization
Notifications are automatically categorized based on content keywords:
- Deals & Promotions
- Social
- Work & Productivity
- Finance
- News & Updates
- Entertainment
- Health & Fitness
- Travel
- Shopping & Delivery

### Duplicate Detection
The app generates content hashes to prevent duplicate notifications from cluttering your inbox.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Genkit](https://firebase.google.com/docs/genkit)
