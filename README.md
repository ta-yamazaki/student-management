# NC Management Application


### Firebase CLI のダウンロードとインストール
```
npm install -g firebase-tools
```
```
firebase --version
```

### FIREBASE_TOKENの取得
```
firebase login:ci
```
ブラウザが開きログイン画面が開くので、ログイン  

コマンドラインに以下表示される
```
+  Success! Use this token to login on a CI server:

1//0eXr1oKRyl7HACgYIARAAGA4SNwF-L9IrxVu-QbxTSRI25Nr-uDjSq2IjvjqmTx77aZprTS3sV1iUndUWX39ZhjPuSEdNMIteje8
```


### 環境構築 + エミュレーター起動
プロジェクトルートで
```
docker-compose build && docker-compose up -d
```


### (デプロイ)
※本番環境にデプロイされるので注意！<br>
コンテナ内で
```
firebase deploy
```


