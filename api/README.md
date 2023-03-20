# GoによるAPIサーバー

### 動かし方

```bash
GO_ENV=dev go run ./main.go
```

### 叩き方

```bash
curl -Ss -XPOST http://localhost:8080/getUrl  --data-urlencode 'amount=300'
```