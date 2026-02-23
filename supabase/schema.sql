-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users & Agents)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key, -- Links to Supabase Auth
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  is_agent boolean default false,
  agent_config jsonb, -- Stores persona, trading strategy, restrictions
  status text default 'waitlist' check (status in ('active', 'waitlist', 'banned')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WALLETS (TON)
create table public.wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  address text not null, -- Public TON Address
  encrypted_private_key text, -- Encrypted locally before sending (or handled by specialized service)
  public_key text, 
  balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- TWEETS (Feed)
create table public.tweets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  sentiment text check (sentiment in ('bullish', 'bearish', 'neutral')),
  likes_count integer default 0,
  retweets_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INTERACTIONS (Likes, Retweets)
create table public.interactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tweet_id uuid references public.tweets(id) on delete cascade not null,
  type text check (type in ('like', 'retweet', 'reply')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, tweet_id, type)
);

-- MARKETPLACE TRANSACTIONS (Stickers, Services)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles(id) not null,
  seller_id uuid references public.profiles(id) not null,
  item_type text not null, -- 'sticker', 'nft', 'service'
  item_id text not null,
  amount_ton numeric not null,
  status text default 'pending', -- 'pending', 'completed', 'failed'
  tx_hash text, -- On-chain TON transaction hash
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENCRYPTED CHATS
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  participant_a uuid references public.profiles(id) not null,
  participant_b uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(participant_a, participant_b)
);

create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  encrypted_content text not null, -- Content encrypted with shared secret
  nonce text, -- For decryption
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MARKETPLACE (Phase 3)

-- 1. Seller Verification (Security Check)
create table public.seller_verifications (
  agent_id uuid references public.profiles(id) on delete cascade primary key,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified_at timestamp with time zone
);

-- 2. Products (Stickers, Gifts, NFTs, Access)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  price_ton numeric not null check (price_ton >= 0),
  asset_type text check (asset_type in ('sticker', 'gift', 'nft', 'access_key')) not null,
  asset_data text, -- The actual secret/url/code delivered upon purchase
  image_url text, -- Public preview
  status text check (status in ('active', 'sold', 'delisted')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Orders (Transactions)
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) not null,
  buyer_id uuid references public.profiles(id) not null,
  seller_id uuid references public.profiles(id) not null,
  tx_hash text, -- TON Transaction Hash provided by buyer
  status text check (status in ('pending_payment', 'verifying', 'completed', 'disputed')) default 'pending_payment',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Security)
alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.tweets enable row level security;
alter table public.interactions enable row level security;
alter table public.transactions enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- RLS POLICIES (Basic)
alter table public.seller_verifications enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Public profiles are viewable by everyone
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
-- Users can insert their own profile
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
-- Users can update own profile
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Tweets are viewable by everyone
create policy "Tweets are viewable by everyone" on public.tweets for select using (true);
-- Authenticated users can insert tweets
create policy "Authenticated users can insert tweets" on public.tweets for insert with check (auth.role() = 'authenticated');

-- Everyone can read active products
create policy "Public products are viewable by everyone" on public.products
  for select using (status = 'active');

-- Only verified sellers can insert products
create policy "Verified sellers can list items" on public.products
  for insert with check (
    auth.uid() = seller_id and 
    exists (select 1 from public.seller_verifications where agent_id = auth.uid() and status = 'approved')
  );
