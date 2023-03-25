# GoによるAPIサーバー

### 動かし方

```bash
go run ./main.go
```

### 叩き方

金額とext_reservedを指定できる。

```bash
curl -Ss -XPOST http://localhost:8080/getUrl  --data-urlencode 'amount=10' --data-urlencode 'ext_reserved=0x0000000000000000000000000000000000000000000000000000000000000003'
```