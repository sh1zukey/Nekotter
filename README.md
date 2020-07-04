# Nekotter
> Neko is GOD.

自分がリツイートした猫関連のツイートを自動収集して日付別で見れるWEBアプリケーションです。

[最新の検索結果](https://app.takashun.dev/date/latest)

## 技術
nuxt + expressでフロントとバックどっちも書いてます。
/api/v1/api.jsがAPI部分

収集はAM2時にcronでpythonスクリプトを動かしています。
[スクリプト](https://gist.github.com/takashun/c03733da6438a6f94f154b86828b0ba4)

## 今後
- Dockerで動かせると便利かな
- 今は完全に自分用なのでちゃんとしたWEBサービスとして公開してみたい

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
