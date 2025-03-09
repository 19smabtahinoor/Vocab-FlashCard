# Vocabulary Flashcards

A modern, responsive web application for creating and studying vocabulary flashcards. Built with React, TypeScript, and Supabase.

## Features

- 📝 Create and manage vocabulary flashcards
- 🔄 Interactive card flipping animation
- 📊 Track review progress for each card
- 🌓 Dark mode support
- 🔒 Secure authentication
- 💾 Persistent data storage
- 📱 Fully responsive design

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sat-flashcards.git
cd sat-flashcards
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

### Database Setup

The application requires the following Supabase table:

```sql
create table flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  word text not null,
  meaning text not null,
  example_sentence text,
  created_at timestamptz default now(),
  last_reviewed timestamptz default now(),
  review_count integer default 0,
  constraint word_unique unique (user_id, word)
);

-- Enable Row Level Security
alter table flashcards enable row level security;

-- Create policies
create policy "Users can create their own flashcards"
  on flashcards for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own flashcards"
  on flashcards for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own flashcards"
  on flashcards for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
  on flashcards for delete
  to authenticated
  using (auth.uid() = user_id);
```

## Features in Detail

### Authentication
- Email/password authentication
- Protected routes
- Secure session management

### Flashcard Management
- Create new flashcards with words, meanings, and example sentences
- Delete existing flashcards
- Track review count and last reviewed timestamp
- Prevent duplicate words per user

### User Interface
- Smooth card flip animations
- Dark mode support with system preference detection
- Responsive design for all screen sizes
- Loading states and error handling
- Real-time flashcard count

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/        # React components
├── lib/              # Utility functions and configurations
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
└── main.tsx         # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)

## Developer 

![Developer PIC](https://avatars.githubusercontent.com/u/73340940?s=48&v=4) - S.M.Abtahi Noor
- Linkedin: https://www.linkedin.com/in/smabtahinoor/ 
- Github : https://github.com/19smabtahinoor
