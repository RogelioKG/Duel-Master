# Duel-Master

## Setting up this project

1. clone this repo
    ```
    git clone git@github.com:RogelioKG/Duel-Master.git
    ```

2. copy the contents of [this yugioh-card assets directory] to [`backend/assets/card-material`](https://github.com/RogelioKG/Duel-Master/tree/main/backend/assets/card-material)

## Frontend

### Using `npm`

1. install dependencies
    ```
    cd Duel-Master/frontend
    npm install
    ```

2. run
    ```
    npm run dev
    ```

### Using `pnpm`

1. install dependencies
    ```
    cd Duel-Master/frontend
    pnpm install
    ```

2. run
    ```
    pnpm dev
    ```

## Backend (testing)

### Using `poetry`
1. run

    + Windows
        ```bat
        scripts/run-backend.bat
        ```

    + Linux
        ```bash
        source scripts/run-backend.sh
        ```

### Using `pip`
1. run

    + Windows
        ```bat
        scripts/run-backend-pip.bat
        ```

    + Linux
        ```bash
        source scripts/run-backend.sh
        ```

[this yugioh-card assets directory]: https://github.com/RogelioKG/Duel-Master/releases/tag/assets
[yugioh card assets]: https://github.com/kooriookami/yugioh-card/tree/master/src/assets/yugioh-card
