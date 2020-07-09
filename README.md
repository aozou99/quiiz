# Quiiz

![quiz_pipeline](https://github.com/aozou99/quiiz/workflows/quiz_pipeline/badge.svg)

誰でも自由にクイズを解いたり作ったりできるサイトだよ

# DEMO

- comming soon ...

# Features

- 自由にクイズを作れるよ
- みんなが投稿したクイズで遊べるよ

# Requirement

- yarn
- firebase

# Installation

# Usage

### Downlod project

```bash
git clone https://github.com/aozou99/quiiz.git
```

### Install the liblary functions need

```bash
cd functions && yarn install && cd ../
```

### Install the liblary frontend need

```bash
cd frontend && yarn install && cd ../
```

### Local development environment

```bash
# firebaseのエミュレータを利用するのに必要
export GOOGLE_APPLICATION_CREDENTIALS=your_service_account.json
firebase emulators:start --import=./data
```

### Export FireStore Data

```
firebase emulators:export --force ./data/
```

# Note

comming soon ...

# Author

- aozou99
- E-mail

# License

"Quiiz" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
