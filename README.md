# SlashExtensionSampleAppV2

SlashExtensionSampleAppV2

## アプリの画面イメージ

![](./docs/init.png)

## デプロイしたNFTコントラクト (Goerli)

[0xd36dbfb7Cb30167A92650A00Ca460d0EDd834780](https://goerli.etherscan.io/address/0xd36dbfb7Cb30167A92650A00Ca460d0EDd834780#code)

## デプロイしたNFTコントラクト (Mumbai)

[0xdd71f86da74e8B28223074c83Df79BA203339057](https://goerli.etherscan.io/address/0xdd71f86da74e8B28223074c83Df79BA203339057)

## デプロイしたNFTコントラクト (Avalanche Fuji Chain)

[0x336709CAbCB19362Bf9374aE4811FF934E9626B6](https://testnet.snowtrace.io/address/0x336709CAbCB19362Bf9374aE4811FF934E9626B6#code)

## 実際にNFTを移転させたトランザクション (Goerli)

[0x65da2d7082c9692c67e717e23eccb42a77800e71b95013713b49b1ac5bd41bd7](https://goerli.etherscan.io/tx/0x65da2d7082c9692c67e717e23eccb42a77800e71b95013713b49b1ac5bd41bd7)

## 実際にNFTを移転させたトランザクション (Avalanche Fuji Chain)

[0x074d92e93e3e565b630623864a0513f60378a3be1698fd1acf70018680224f3c](https://testnet.snowtrace.io/tx/0x074d92e93e3e565b630623864a0513f60378a3be1698fd1acf70018680224f3c)

## OpenSea上のページ (testnet)

[slashextensionsample](https://testnets.opensea.io/ja/collection/slashextensionsample-1)

## 決済用URLを生成するためのコマンド

```bash
curl -Ss -XPOST localhost:3001/api/generateUrl -d '{ \"amount\": \" 2000\",  \"amount_type\": \"JPY\", \"ext_reserved\": \"0x\", \"ext_description\": \"テストです。\" }'
```

## 動かし方

### フロントエンド

```bash
cd frontend && npm i && npm run start
```

### APIサーバー

```bash
cd api && make start
```

### 参考サイト

1. [SushiSwap](https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x3813e82e6f7098b9583FC0F33a962D02018B6803&chainId=80001)
2. [GinFramework](https://gin-gonic.com/ja/docs/quickstart/)
3. [Goプロジェクトのはじめかたとおすすめライブラリ8.5選。ひな形にも使えるサンプルもあるよ。](https://qiita.com/yagi_eng/items/65cd812107362d36ae86)
4. [Slash Payment Request API](https://slash-fi.gitbook.io/docs/integration-guide/apis/payment-request-api)