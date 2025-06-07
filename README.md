# Cryptocurrency Trading Platform

A modern trading platform built with:

- Laravel 10 (Backend)
- React 19 (Frontend)
- Tailwind CSS + shadcn/ui (Styling)
- CoinGecko API (Market Data)

## Setup Instructions

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/crypto-trading-platform.git
    ```

2. Install dependencies:

    ```bash
    composer install
    npm install
    ```

3. Create environment file:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. Configure database in `.env`

5. Build assets:
    ```bash
    npm run build
    ```

## Development

- Frontend development:

    ```bash
    npm run dev
    ```

- Backend development:
    ```bash
    php artisan serve
    ```

## Deployment

See `DEPLOYMENT.md` for Hostinger deployment instructions.
