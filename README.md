## Getting Started

First, run the development server:

```bash
brew install postgresql
```

In .zshrc:

```
export PATH=/usr/local/share/npm/bin:$PATH
export PATH=/usr/local/share/nvm/bin:$PATH
export PATH="/usr/local/opt/icu4c/bin:$PATH"
export PATH="/usr/local/opt/icu4c/sbin:$PATH"
export NVM_DIR=~/.nvm
export NVM_DIR="$HOME/.nvm"
export PGDATA=/usr/local/var/postgres
PATH="/usr/local/var/postgres:$PATH"
```

```
pg_ctl start

yarn dev
```
