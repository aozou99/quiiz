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

### Test Account

| mail           | password |
| -------------- | -------- |
| test1@test.com | test1234 |
| test2@test.com | test1234 |
| test3@test.com | test1234 |

### Export FireStore Data

```
firebase emulators:export --force ./data/
```

### Firestore Index Update

Issue the following commands when you update the Firestore index

```
firebase firestore:indexes > firestore.indexes.json
```

### Delete Cloud Functions

```
firebase functions:delete {functionName} --region asia-northeast1
```

# Note

comming soon ...

# Author

- aozou99
- E-mail

# License

"Quiiz" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
