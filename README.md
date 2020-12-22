# NC Management Application

### 環境構築
プロジェクトルートで
```
docker-compose build && docker-compose up -d
```

コンテナに入る
```
docker exec -it firebase sh
```
firebaseにログイン。ルート(/app)で
```
npm run nodeAndLogin
```
※リンクが生成されるのでアクセスしてGoogleにログイン<br>
ログイン後表示されるコードをターミナルに張り付け<br>
※共同開発には、GoogleアカウントをFirebaseプロジェクトに紐づける必要あり。


### ローカル環境でのエミュレート
コンテナシェル内、ルート(/app)で
```
npm run emulate
```
http://localhost:5000
にアクセス



