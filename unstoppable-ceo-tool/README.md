# The Unstoppable CEO Framework - Interactive Sales Diagnostic Tool

A production-ready interactive web-based sales diagnostic tool built with React + Vite + Tailwind CSS + Framer Motion.

## Features

- **Access Gate**: Lead capture with email validation
- **Framework Scoring**: 10 categories with instant color feedback (red/yellow/green)
- **Interactive Diagram**: Visual wheel matching the Unstoppable CEO Framework
- **ROI Calculator**: Real-time revenue calculations
- **Final Results**: Comprehensive score display with interpretation
- **Data Persistence**: Supabase integration for session storage
- **Webhook Integration**: Ontraport/Zapier compatible
- **Smooth Animations**: Framer Motion powered transitions
- **Light Mode**: Premium cream color scheme (#EEE7CA)

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3.4
- Framer Motion 11
- Supabase (PostgreSQL)

## Quick Start

### 1. Install Dependencies

```bash
cd unstoppable-ceo-tool
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WEBHOOK_URL=your_webhook_endpoint_url
```

### 3. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Create sessions table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  framework_data JSONB DEFAULT '[]',
  total_score INTEGER DEFAULT 0,
  roi_inputs JSONB DEFAULT '{}',
  roi_outputs JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_sessions_email ON sessions(email);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users
CREATE POLICY "Allow insert" ON sessions FOR INSERT WITH CHECK (true);

-- Allow updates
CREATE POLICY "Allow update" ON sessions FOR UPDATE USING (true);

-- Allow select for CSV export
CREATE POLICY "Allow select" ON sessions FOR SELECT USING (true);
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Embedding

### iframe Method

```html
<iframe 
  src="https://your-deployed-url.com" 
  width="100%" 
  height="900" 
  frameborder="0"
  allow="clipboard-write"
  style="border: none;"
></iframe>
```

## Webhook Payload

When a user completes the diagnostic, this JSON is sent to your webhook:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "framework_scores": [7, 8, 5, 6, 9, 4, 7, 8, 6, 7],
  "framework_descriptions": [
    { "category": "Avatar", "description": "...", "score": 7 }
  ],
  "total_score": 67,
  "roi_inputs": {
    "offer_price": 5000,
    "clients_per_month": 4,
    "close_rate": 25,
    "revenue_goal": 500000,
    "months_to_goal": 12
  },
  "roi_outputs": {
    "monthly_revenue": 20000,
    "annual_revenue": 240000,
    "projected_revenue": 500000,
    "revenue_gap": 260000,
    "roi_multiple": 2.08
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## CSV Export

To export data from Supabase:

1. Go to your Supabase dashboard
2. Navigate to Table Editor > sessions
3. Click "Export" > "Export as CSV"

## Customization

### Colors

Edit `tailwind.config.js` to modify the color scheme:

```js
colors: {
  cream: {
    300: '#EEE7CA',  // Primary cream
    // ...
  },
  navy: {
    DEFAULT: '#1a2744',  // Primary navy
  },
  score: {
    red: '#ef4444',
    yellow: '#f59e0b',
    green: '#22c55e',
  }
}
```

### Framework Categories

Edit `src/utils/constants.js` to modify the 10 categories.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Private - For use by Strength on Stages only.
